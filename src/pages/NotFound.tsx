import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 | Challenge Canvas</title>
        <meta name="description" content={t("metaNotFoundDesc")} />
        <meta property="og:title" content="404 | Challenge Canvas" />
        <meta property="og:description" content={t("metaNotFoundDesc")} />
        <meta property="og:url" content="https://challengecanvas.com/404" />
        <meta property="og:image" content="https://challengecanvas.com/og-image.jpg" />
        <link rel="canonical" href="https://challengecanvas.com/404" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">{t("notFoundText")}</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            {t("returnHome")}
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
