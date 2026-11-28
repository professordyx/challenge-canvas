import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/50 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
        <p>
          {t("developedBy")}{" "}
          <a
            href="https://dioceliogoulart.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Diocélio Goulart
          </a>{" "}
          — © {new Date().getFullYear()} BlueStars. {t("allRightsReserved")}
        </p>
        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link to="/terms" className="hover:text-primary hover:underline">
            {t("termsOfService")}
          </Link>
          <Link to="/privacy" className="hover:text-primary hover:underline">
            {t("privacyPolicy")}
          </Link>
          <Link to="/refund" className="hover:text-primary hover:underline">
            {t("refundPolicy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
