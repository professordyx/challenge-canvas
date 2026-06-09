import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Sparkles, FileDown, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";

const benefits = [
  { icon: LayoutGrid, titleKey: "benefit1Title" as const, descKey: "benefit1Desc" as const },
  { icon: Sparkles, titleKey: "benefit2Title" as const, descKey: "benefit2Desc" as const },
  { icon: FileDown, titleKey: "benefit3Title" as const, descKey: "benefit3Desc" as const },
];

const Landing = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Challenge Canvas Builder — Diocélio Goulart</title>
        <meta name="description" content="Estruture problemas complexos com clareza estratégica. Ferramenta de problem framing para consultores e líderes de inovação." />
        <meta property="og:title" content="Challenge Canvas Builder — Diocélio Goulart" />
        <meta property="og:description" content="Estruture problemas complexos com clareza estratégica. Ferramenta de problem framing para consultores e líderes de inovação." />
        <meta property="og:url" content="https://challengecanvas.com/" />
        <meta property="og:image" content="https://challengecanvas.com/og-image.jpg" />
        <link rel="canonical" href="https://challengecanvas.com/" />
      </Helmet>
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.3),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl"
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80"
          >
            {t("heroSubtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/auth">
              <Button size="lg" className="gap-2 bg-background text-foreground hover:bg-background/90">
                {t("createAccount")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" className="gap-2 bg-background text-foreground hover:bg-primary hover:text-primary-foreground">
                {t("signIn")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.titleKey}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="rounded-xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-card-foreground">
                  {t(b.titleKey)}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(b.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
    </>
  );
};

export default Landing;
