import LegalLayout from "@/components/legal/LegalLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { privacyContent } from "@/i18n/legalPrivacy";

export default function Privacy() {
  const { language } = useLanguage();
  const doc = privacyContent[language];

  return (
    <LegalLayout
      title={doc.title}
      metaDescription={doc.metaDescription}
      canonicalPath="/privacy"
      updatedLabel={doc.updatedLabel}
      intro={doc.intro}
      sections={doc.sections}
    />
  );
}