import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/50 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6">
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
          — © {new Date().getFullYear()} {t("allRightsReserved")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
