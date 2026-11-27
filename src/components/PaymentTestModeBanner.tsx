import { getPaddleEnvironment } from '@/lib/paddle';
import { useLanguage } from '@/i18n/LanguageContext';
import { billingCopy } from '@/i18n/billing';
export function PaymentTestModeBanner() {
 const { language } = useLanguage();
 if (getPaddleEnvironment() !== 'sandbox') return null;
 return <div role="status" className="border-b border-accent/30 bg-accent/10 px-4 py-2 text-center text-xs text-foreground print:hidden">{billingCopy[language].test}</div>;
}
