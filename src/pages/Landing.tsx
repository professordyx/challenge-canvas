import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, Sparkles, Mic, BarChart3, ImageIcon, FileDown, Users, Lock, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { plansCopy } from '@/i18n/plans';
import { PREMIUM_MONTHLY_USD } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Footer from '@/components/layout/Footer';
import workshop from '@/assets/canvas-workshop.png.asset.json';

const featureIcons = [Sparkles, Mic, BarChart3, ImageIcon, FileDown, Users];

export default function Landing() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const c = plansCopy[language];
  const startPath = user ? '/dashboard' : '/auth';
  return (
    <>
      <Helmet>
        <title>challenge canvas — {c.eyebrow.toLocaleLowerCase()}</title>
        <meta name="description" content={c.subtitle} />
        <meta property="og:title" content="challenge canvas — Free & Premium" />
        <meta property="og:description" content={c.subtitle} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://challengecanvas.com/" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" />
      </Helmet>
      <section className="relative isolate overflow-hidden border-b border-border bg-secondary">
        <img src={workshop.url} alt={c.imageAlt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-background/80 sm:bg-background/25" />
        <div className="relative mx-auto flex min-h-[570px] max-w-7xl items-center px-5 py-16 sm:px-8 lg:min-h-[610px]">
          <div className="max-w-lg">
            <p className="mb-6 text-xs font-semibold text-accent">{c.eyebrow}</p>
            <h1 className="font-display text-5xl font-normal leading-[1.08] text-primary sm:text-6xl"><b className="block font-bold">challenge</b><span className="text-accent">canvas</span><span className="text-accent">.</span></h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-foreground">{c.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-3 rounded-md bg-accent text-accent-foreground hover:bg-accent/90"><Link to={startPath}>{c.start}<ArrowUpRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="rounded-md bg-background/80"><a href="#plans">{c.seePlans}<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="max-w-xl text-3xl font-semibold leading-tight text-primary">{c.stepsTitle}</h2>
          <div className="mt-10 grid gap-9 md:grid-cols-3">
            {c.steps.map(([title, description], i) => <div key={title} className="border-t border-border pt-5"><span className="font-display text-sm font-bold text-accent">0{i + 1}</span><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold text-primary">{c.featuresTitle}</h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.map(([title, description], i) => {
              const Icon = featureIcons[i];
              return <div key={title}>{Icon && <Icon className="mb-4 h-6 w-6 text-accent" />}<h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-20 border-y border-border bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="mb-10 text-center"><h2 className="text-3xl font-semibold text-primary">{c.plansTitle}</h2><p className="mt-3 text-muted-foreground">{c.plansDesc}</p></div>
          <div className="grid items-stretch gap-5 md:grid-cols-2">
            <article className="flex flex-col rounded-lg border border-border bg-card p-7 sm:p-8">
              <h3 className="text-2xl font-semibold">{c.free}</h3><p className="mt-2 text-sm text-muted-foreground">{c.freeDesc}</p>
              <p className="mt-7 font-display text-4xl font-semibold">USD 0<span className="ml-1 text-sm font-normal text-muted-foreground">{c.month}</span></p>
              <ul className="my-7 space-y-4">{c.freeItems.map(item => <li key={item} className="flex gap-3 text-sm"><Check className="h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul>
              <p className="mb-7 flex gap-3 text-xs leading-5 text-muted-foreground"><Lock className="mt-0.5 h-4 w-4 shrink-0" />{c.excluded}</p>
              <Button asChild variant="outline" className="mt-auto w-full rounded-md"><Link to={startPath}>{c.start}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </article>
            <article className="relative flex flex-col rounded-lg border-2 border-accent bg-card p-7 sm:p-8">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-accent"><Sparkles className="h-4 w-4" />{c.recommended}</p>
              <h3 className="text-2xl font-semibold">Premium</h3><p className="mt-2 text-sm text-muted-foreground">{c.premiumDesc}</p>
              <p className="mt-7 font-display text-4xl font-semibold">USD {PREMIUM_MONTHLY_USD.toLocaleString(language, { minimumFractionDigits: 2 })}<span className="ml-1 text-sm font-normal text-muted-foreground">{c.month}</span></p>
              <ul className="my-7 space-y-4">{c.premiumItems.map(item => <li key={item} className="flex gap-3 text-sm"><Check className="h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul>
              <Button disabled className="mt-auto w-full rounded-md bg-accent text-accent-foreground">{c.pending}</Button>
            </article>
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-6 text-muted-foreground">{c.notice}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20"><div className="mx-auto max-w-3xl px-5 sm:px-8"><h2 className="mb-7 text-3xl font-semibold text-primary">{c.faq}</h2><Accordion type="single" collapsible>{c.questions.map(([q, a], i) => <AccordionItem key={q} value={String(i)}><AccordionTrigger className="text-left">{q}</AccordionTrigger><AccordionContent className="text-sm leading-7 text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>
      <section className="border-t border-border bg-primary py-14"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-5 sm:px-8 md:flex-row md:items-center"><div><h2 className="text-3xl font-semibold text-primary-foreground">{c.closing}</h2><p className="mt-3 text-sm text-primary-foreground/80">{c.closingDesc}</p></div><Button asChild size="lg" variant="secondary" className="shrink-0 gap-3 rounded-md"><Link to={startPath}>{c.start}<ArrowUpRight className="h-4 w-4" /></Link></Button></div></section>
      <Footer />
    </>
  );
}
