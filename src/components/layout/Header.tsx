import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Globe } from "lucide-react";
import logo from "@/assets/logo-diocelio.png";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Diocélio Goulart" className="h-10" />
          <span className="hidden text-lg font-semibold text-foreground sm:inline">
            Challenge Canvas
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!isLanding && (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard")}</span>
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "pt" ? "es" : "pt")}
            className="gap-1.5"
          >
            <Globe className="h-4 w-4" />
            {language === "pt" ? "ES" : "PT"}
          </Button>

          {isLanding && (
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("signIn")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
