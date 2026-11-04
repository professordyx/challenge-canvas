import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Activity, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useLanguage } from '@/i18n/LanguageContext';
import { adminCopy } from '@/i18n/admin';
import { ApiSummary, CostSummary, ModelPrice, estimateCost, successRate } from '@/lib/api-monitoring';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PAGE_SIZE = 20;

export default function Admin() {
  const { language } = useLanguage();
  const c = adminCopy[language];
  const access = useAdmin();
  const [days, setDays] = useState('7');
  const [provider, setProvider] = useState('all');
  const [operation, setOperation] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState('all');
  const [priceEdits, setPriceEdits] = useState<Record<string, Partial<ModelPrice>>>({});
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 });
  const since = useMemo(() => new Date(Date.now() - Number(days) * 86400000).toISOString(), [days]);
  const number = new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'es');
  const operationName = (name: string) => name === 'improve-section' ? c.improve : name === 'evaluate-canvas' ? c.evaluate : c.infographic;
  const query = useQuery({
    queryKey: ['api-monitoring', since, provider, operation, status, page, userId], enabled: access.isAdmin,
    refetchInterval: 30_000,
    queryFn: async () => {
      let history = supabase.from('api_usage_logs').select('*', { count: 'exact' }).gte('created_at', since);
      if (provider !== 'all') history = history.eq('provider', provider);
      if (operation !== 'all') history = history.eq('operation', operation);
      if (status !== 'all') history = history.eq('success', status === 'success');
      if (userId !== 'all') history = history.eq('user_id', userId);
      const filters = { since_at: since, ...(provider === 'all' ? {} : { provider_filter: provider }), ...(operation === 'all' ? {} : { operation_filter: operation }), ...(status === 'all' ? {} : { status_filter: status }) };
      const [rows, totals, costs, prices] = await Promise.all([
        history.order('created_at', { ascending: false }).order('id').range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
        supabase.rpc('api_monitoring_summary', {
          since_at: since,
          ...(provider === 'all' ? {} : { provider_filter: provider }),
          ...(operation === 'all' ? {} : { operation_filter: operation }),
          ...(status === 'all' ? {} : { status_filter: status }),
        }),
        supabase.rpc('api_usage_by_user', filters),
        supabase.from('api_model_prices').select('*').order('model'),
      ]);
      if (rows.error) throw rows.error;
      if (totals.error) throw totals.error;
      if (costs.error) throw costs.error;
      if (prices.error) throw prices.error;
      const ids = [...new Set(rows.data.map(row => row.user_id))];
      const emails = ids.length ? await supabase.rpc('api_user_emails', { user_ids: ids }) : { data: [], error: null };
      if (emails.error) throw emails.error;
      const emailMap = Object.fromEntries((emails.data ?? []).map(e => [e.user_id, e.email]));
      return { rows: rows.data, count: rows.count ?? 0, summary: totals.data as unknown as ApiSummary, costs: costs.data as unknown as CostSummary, prices: prices.data as unknown as ModelPrice[], emailMap };
    },
  });
  const savePrices = async () => {
    const list = query.data?.prices ?? [];
    const updates = Object.entries(priceEdits).map(([model, edit]) => ({ ...list.find(p => p.model === model)!, ...edit, model, updated_at: new Date().toISOString() }));
    if (!updates.length) return;
    const { error } = await supabase.from('api_model_prices').upsert(updates);
    if (error) { toast.error(c.failure); return; }
    setPriceEdits({}); toast.success(c.saved); query.refetch();
  };
  const filter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(0); };
  const selector = (label: string, value: string, change: (value: string) => void, options: [string, string][]) => (
    <div className="min-w-0 space-y-2"><label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={change}><SelectTrigger aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>{options.map(([key, text]) => <SelectItem key={key} value={key}>{text}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
  if (access.loading) return <div className="mx-auto max-w-7xl p-6" role="status">{c.loading}</div>;
  if (access.error) return <div className="mx-auto max-w-7xl p-6"><p role="alert">{c.failure}</p><Button onClick={() => access.retry()}>{c.retry}</Button></div>;
  if (!access.isAdmin) return <div className="mx-auto max-w-7xl p-6" role="alert">{c.denied}</div>;
  const summary = query.data?.summary;
  const rate = summary ? successRate(summary.total, summary.errors) : null;
  const metrics = [
    { label: c.requests, value: summary ? number.format(summary.total) : '—', icon: Activity },
    { label: c.errors, value: summary ? number.format(summary.errors) : '—', icon: AlertTriangle },
    { label: c.rate, value: rate === null ? '—' : `${number.format(Math.round(rate * 10) / 10)}%`, icon: CheckCircle2 },
    { label: c.cost, value: query.data?.costs ? usd.format(Number(query.data.costs.cost_total)) : '—', icon: Activity },
    { label: c.latency, value: summary?.total ? `${number.format(summary.avg_ms / 1000)} s` : '—', icon: Clock },
  ];
  const max = Math.max(1, ...(summary?.daily.map(item => item.requests) ?? []));
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <Helmet><title>{c.title} | Challenge Canvas Builder</title><meta name="robots" content="noindex,nofollow" /></Helmet>
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent"><ShieldCheck className="h-4 w-4" />{c.admin}</p>
        <h1 className="text-3xl font-bold">{c.title}</h1><p className="mt-2 text-muted-foreground">{c.subtitle}</p></div>
      <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching} className="gap-2"><RefreshCw className={`h-4 w-4 ${query.isFetching ? 'animate-spin motion-reduce:animate-none' : ''}`} />{c.refresh}</Button>
    </div>
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {selector(c.period, days, filter(setDays), [['1', c.day], ['7', c.week], ['30', c.month]])}
      {selector(c.provider, provider, filter(setProvider), [['all', c.all], ['anthropic', 'Anthropic'], ['gemini', 'Gemini']])}
      {selector(c.operation, operation, filter(setOperation), [['all', c.all], ['improve-section', c.improve], ['evaluate-canvas', c.evaluate], ['generate-infographic', c.infographic]])}
      {selector(c.status, status, filter(setStatus), [['all', c.all], ['success', c.success], ['error', c.error]])}
      {selector(c.userFilter, userId, filter(setUserId), [['all', c.all], ...((query.data?.costs.users ?? []).map(u => [u.user_id, u.email ?? u.user_id] as [string, string]))])}
    </div>
    {query.isPending ? <p role="status">{c.loading}</p> : query.isError ? <div role="alert" className="flex items-center gap-4 py-8"><p>{c.failure}</p><Button onClick={() => query.refetch()}>{c.retry}</Button></div> : <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{metrics.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-lg border bg-card p-5"><div className="flex items-center justify-between text-sm text-muted-foreground"><span>{label}</span><Icon className="h-4 w-4" /></div><p className="mt-4 text-3xl font-semibold tabular-nums">{value}</p></div>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">{c.attemptsNote}</p>
      <div className="my-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section><h2 className="mb-4 text-lg font-semibold">{c.trend}</h2>{summary?.daily.length ? <div className="space-y-3">{summary.daily.map(day => <div key={day.day} className="grid grid-cols-[5.5rem_1fr_5rem] items-center gap-3 text-xs"><time>{day.day.slice(5)}</time><div className="flex h-3 overflow-hidden rounded-sm bg-muted" aria-label={`${day.day}: ${day.requests} ${c.requests}, ${day.errors} ${c.errors}`}><svg width="100%" height="12" viewBox={`0 0 ${max} 12`} preserveAspectRatio="none" aria-hidden="true"><rect width={day.requests - day.errors} height="12" className="fill-accent" /><rect x={day.requests - day.errors} width={day.errors} height="12" className="fill-destructive" /></svg></div><span className="text-right tabular-nums">{day.requests} / {day.errors}</span></div>)}<p className="flex gap-4 pt-2 text-xs text-muted-foreground"><span className="text-accent">{c.success}</span><span className="text-destructive">{c.errors}</span></p></div> : <p className="text-sm text-muted-foreground">{c.empty}</p>}</section>
        <section className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><h2 className="text-lg font-semibold">{c.tokens}</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt>{c.input}</dt><dd className="font-semibold">{summary?.token_reports ? number.format(summary.input_tokens) : '—'}</dd></div><div className="flex justify-between"><dt>{c.output}</dt><dd className="font-semibold">{summary?.token_reports ? number.format(summary.output_tokens) : '—'}</dd></div></dl><p className="mt-4 text-xs text-muted-foreground">{c.tokenNote}</p></section>
      </div>
      <section className="mb-8 border-t pt-6"><h2 className="mb-1 text-xl font-semibold">{c.byUser}</h2>
        <p className="mb-4 text-xs text-muted-foreground">Anthropic: {usd.format(Number(query.data?.costs.cost_anthropic ?? 0))} · Gemini: {usd.format(Number(query.data?.costs.cost_gemini ?? 0))} — {c.costNote}{query.data?.costs.unpriced_models.length ? ` ${c.unpriced} ${query.data.costs.unpriced_models.join(', ')}` : ''}</p>
        <Table><TableHeader><TableRow>{[c.email, c.calls, c.errors, c.input, c.output, c.cost].map(l => <TableHead key={l}>{l}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{query.data?.costs.users.map(u => <TableRow key={u.user_id} className="cursor-pointer" onClick={() => filter(setUserId)(u.user_id)}>
            <TableCell className="break-all font-medium">{u.email ?? u.user_id}</TableCell><TableCell className="tabular-nums">{number.format(u.calls)}</TableCell><TableCell className="tabular-nums">{number.format(u.errors)}</TableCell>
            <TableCell className="tabular-nums">{number.format(u.input_tokens)}</TableCell><TableCell className="tabular-nums">{number.format(u.output_tokens)}</TableCell><TableCell className="font-semibold tabular-nums">{usd.format(Number(u.cost ?? 0))}</TableCell>
          </TableRow>)}{!query.data?.costs.users.length && <TableRow><TableCell colSpan={6} className="py-6 text-center text-muted-foreground">{c.empty}</TableCell></TableRow>}</TableBody></Table>
      </section>
      <section className="border-t pt-6"><h2 className="mb-4 text-xl font-semibold">{c.history}</h2>
        <Table><TableHeader><TableRow>{[c.date, c.email, c.operation, c.model, c.status, c.duration, c.tokens, c.detail].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{query.data?.rows.map(row => <TableRow key={row.id}>
            <TableCell className="whitespace-nowrap text-xs">{new Date(row.created_at).toLocaleString(language === 'pt' ? 'pt-BR' : 'es')}</TableCell>
            <TableCell className="break-all text-xs">{query.data?.emailMap[row.user_id] ?? row.user_id}</TableCell>
            <TableCell><p className="whitespace-nowrap font-medium">{operationName(row.operation)}</p><p className="mt-1 text-xs text-muted-foreground">{row.provider === 'anthropic' ? 'Anthropic' : 'Gemini'}</p></TableCell>
            <TableCell className="text-xs">{row.model}</TableCell>
            <TableCell><span className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-medium ${row.success ? 'text-accent' : 'text-destructive'}`}>{row.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}{row.success ? c.success : c.error}</span></TableCell>
            <TableCell className="whitespace-nowrap tabular-nums">{number.format(row.duration_ms / 1000)} s</TableCell>
            <TableCell className="whitespace-nowrap tabular-nums">{row.input_tokens ?? '—'} / {row.output_tokens ?? '—'}<p className="text-xs text-muted-foreground">{(() => { const v = estimateCost(row, query.data?.prices.find(p => p.model === row.model)); return v === null ? '—' : usd.format(v); })()}</p></TableCell>
            <TableCell className="min-w-48 max-w-80 text-xs"><p className="break-words">{row.error_message ?? '—'}</p><p className="mt-1 text-muted-foreground">{row.http_status ?? '—'} {row.error_code}</p><details className="mt-2"><summary className="cursor-pointer text-muted-foreground">{c.user}</summary><p className="mt-1 break-all">{row.user_id}</p></details></TableCell>
          </TableRow>)}{!query.data?.rows.length && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">{c.empty}</TableCell></TableRow>}</TableBody></Table>
        <div className="mt-4 flex items-center justify-end gap-3"><span className="text-sm text-muted-foreground">{c.page} {page + 1} / {Math.max(1, Math.ceil((query.data?.count ?? 0) / PAGE_SIZE))}</span><Button variant="outline" size="icon" aria-label={c.previous} disabled={page === 0} onClick={() => setPage(value => value - 1)}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" aria-label={c.next} disabled={(page + 1) * PAGE_SIZE >= (query.data?.count ?? 0)} onClick={() => setPage(value => value + 1)}><ChevronRight className="h-4 w-4" /></Button></div>
      </section>
      <section className="mt-8 border-t pt-6"><h2 className="mb-4 text-xl font-semibold">{c.prices}</h2>
        <Table><TableHeader><TableRow>{[c.model, c.priceIn, c.priceOut, c.priceImg].map(l => <TableHead key={l}>{l}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{query.data?.prices.map(p => <TableRow key={p.model}><TableCell className="text-xs">{p.model}</TableCell>
            {(['input_per_mtok', 'output_per_mtok', 'per_image'] as const).map(k => <TableCell key={k}><Input type="number" min="0" step="0.001" className="w-28" aria-label={`${p.model} ${k}`} value={String(priceEdits[p.model]?.[k] ?? p[k])} onChange={e => setPriceEdits(prev => ({ ...prev, [p.model]: { ...prev[p.model], [k]: Math.max(0, Number(e.target.value) || 0) } }))} /></TableCell>)}
          </TableRow>)}</TableBody></Table>
        <Button className="mt-4" onClick={savePrices} disabled={!Object.keys(priceEdits).length}>{c.save}</Button>
      </section><p className="mt-8 text-xs text-muted-foreground">{c.start}</p>
    </>}
  </div>;
}