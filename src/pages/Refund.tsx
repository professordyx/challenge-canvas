import LegalLayout from "@/components/legal/LegalLayout";
import { useLanguage } from "@/i18n/LanguageContext";
import { refundPolicyContent } from "@/i18n/legalRefund";

export default function Refund() {
  const { language } = useLanguage();
  const doc = refundPolicyContent[language];

  return (
    <LegalLayout
      title={doc.title}
      metaDescription={doc.metaDescription}
      canonicalPath="/refund"
      updatedLabel={doc.updatedLabel}
      intro={doc.intro}
      sections={doc.sections}
    />
  );
}