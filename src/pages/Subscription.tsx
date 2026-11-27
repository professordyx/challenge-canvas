import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Crown, Loader2, RefreshCw, Check, ArrowLeft } from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { usePaddleCheckout } from '@/hooks/usePaddleCheckout';
import { useLanguage } from '@/i18n/LanguageContext';
import { billingCopy } from '@/i18n/billing';
import { plansCopy } from '@/i18n/plans';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/layout/Footer';

export default function Subscription() {
 const { language } = useLanguage();
 const c = billingCopy[language];
 const plan = usePlan();
 const checkout = usePaddleCheckout();
 const { toast } = useToast();
 const [params] = useSearchParams();
 const [waiting, setWaiting] = useState(params.get('checkout') === 'success');
 useEffect(() => {
  if (!waiting || plan.data?.premium) return;
  let attempts = 0;
  const timer = window.setInterval(() => {
   void plan.refetch();
   if (++attempts >= 20) { window.clearInterval(timer); setWaiting(false); }
  }, 3000);
  return () => window.clearInterval(timer);
 }, [waiting, plan.data?.premium, plan.refetch]);
 const pay = async (portal: boolean) => {
  try { if (portal) await checkout.openPortal(); else await checkout.openCheckout(); }
  catch { toast({ title: c.paymentError, variant: 'destructive' }); }
 };
 const date = (value: string) => new Date(value).toLocaleDateString(language);
 return <>
  <Helmet><title>{c.title} | Challenge Canvas</title><meta name="description" content={plansCopy[language].premiumDesc} /><meta name="robots" content="noindex" /></Helmet>
  <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-8">
   <Button asChild variant="ghost" size="sm" className="mb-6 gap-2"><Link to="/dashboard"><ArrowLeft className="h-4 w-4" />{c.return}</Link></Button>
   <h1 className="mb-8 text-3xl font-semibold text-primary">{c.title}</h1>
   {plan.isLoading ? <Loader2 className="h-6 w-6 animate-spin" aria-label={c.pending} /> : plan.isError ? <div role="alert"><p>{c.error}</p><Button variant="outline" onClick={() => void plan.refetch()} className="mt-4 gap-2"><RefreshCw className="h-4 w-4" />{c.retry}</Button></div> : plan.data && <>
    {!plan.data.enabled && <p className="mb-6 border-l-2 border-accent pl-4 text-sm text-muted-foreground">{c.livePending}</p>}
    {waiting && <p role="status" className="mb-6 text-sm text-accent">{plan.data.premium ? c.success : c.pending}</p>}
    {plan.data.subscription?.status === 'past_due' && <p role="alert" className="mb-6 text-sm text-destructive">{c.pastDue}</p>}
    <div className="grid gap-10 border-y border-border py-8 md:grid-cols-2">
     <div>
      <Badge variant={plan.data.premium ? 'default' : 'secondary'} className="mb-4 gap-2"><Crown className="h-4 w-4" />{plan.data.premium ? c.premium : c.free}</Badge>
      <p className="font-display text-3xl font-semibold">{c.price}</p>
      <ul className="my-6 space-y-3">{plansCopy[language].premiumItems.map(item => <li className="flex gap-2 text-sm" key={item}><Check className="h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul>
      {plan.data.subscription ? <Button className="gap-2" onClick={() => void pay(true)} disabled={checkout.loading}><CreditCard className="h-4 w-4" />{c.manage}</Button> : !plan.data.premium && <Button onClick={() => void pay(false)} disabled={checkout.loading || !plan.data.enabled} className="gap-2 bg-accent text-accent-foreground">{checkout.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}{c.upgrade}</Button>}
      {plan.data.subscription?.current_period_end && (plan.data.subscription.cancel_at_period_end || plan.data.subscription.status === 'canceled') && <p className="mt-4 text-sm text-muted-foreground">{c.canceled} {date(plan.data.subscription.current_period_end)}</p>}
     </div>
     <div><h2 className="text-lg font-semibold">{c.usage}</h2><dl className="mt-4 divide-y divide-border">{(['canvases','evaluations','infographics'] as const).map(key => <div key={key} className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-muted-foreground">{c[key]}</dt><dd className="text-sm font-semibold">{plan.data?.premium || !plan.data?.enabled ? c.unlimited : `${plan.data.usage[key]} / 1`}</dd></div>)}</dl><p className="mt-4 text-xs text-muted-foreground">{c.reset} {date(plan.data.resets_at)} (UTC)</p><Button variant="ghost" className="mt-3 gap-2" onClick={() => void plan.refetch()}><RefreshCw className="h-4 w-4" />{c.retry}</Button></div>
    </div>
   </>}
  </div><Footer />
 </>;
}
