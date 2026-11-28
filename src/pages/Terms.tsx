import LegalLayout from "@/components/legal/LegalLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { termsContent } from "@/i18n/legalTerms";

export default function Terms() {
  const { language } = useLanguage();
  const doc = termsContent[language];

  return (
    <LegalLayout
      title={doc.title}
      metaDescription={doc.metaDescription}
      canonicalPath="/terms"
      updatedLabel={doc.updatedLabel}
      intro={doc.intro}
      sections={doc.sections}
    />
  );
}