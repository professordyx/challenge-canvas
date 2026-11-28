import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

export interface LegalSection {
  heading: string;
  paragraphs?: ReactNode[];
  items?: ReactNode[];
}

interface LegalLayoutProps {
  title: string;
  metaDescription: string;
  canonicalPath: string;
  updatedLabel: string;
  intro: ReactNode;
  sections: LegalSection[];
}

const backLabels = {
  pt: "Voltar ao início",
  es: "Volver al inicio",
  en: "Back to home",
} as const;

export default function LegalLayout({
  title,
  metaDescription,
  canonicalPath,
  updatedLabel,
  intro,
  sections,
}: LegalLayoutProps) {
  const { language, t } = useLanguage();
  const { pathname } = useLocation();
  const canonicalUrl = `https://challengecanvas.com${canonicalPath}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const legalLinks = [
    { to: "/terms", label: t("termsOfService") },
    { to: "/privacy", label: t("privacyPolicy") },
    { to: "/refund", label: t("refundPolicy") },
  ];

  return (
    <>
      <Helmet>
        <title>{title} | Challenge Canvas</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${title} | Challenge Canvas`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              {backLabels[language]}
            </Link>
          </Button>
          <nav aria-label="Legal" className="flex flex-wrap gap-4 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  pathname === link.to
                    ? "font-semibold text-primary underline underline-offset-4"
                    : "text-muted-foreground hover:text-primary hover:underline"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">{updatedLabel}</p>
          <p className="mt-5 text-base leading-relaxed text-foreground">{intro}</p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-primary">{section.heading}</h2>
              {section.paragraphs?.map((paragraph, idx) => (
                <p key={idx} className="text-sm leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                  {section.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      <Footer />
    </>
  );
}