import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  currentValue: string;
  onTranscript: (text: string) => void;
}

export function MicButton({ currentValue, onTranscript }: MicButtonProps) {
  const { t, language } = useLanguage();
  const { isListening, toggle } = useSpeechToText({
    language,
    onResult: onTranscript,
    appendMode: true,
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-7 gap-1 text-xs",
        isListening
          ? "text-red-500 hover:text-red-600"
          : "text-muted-foreground"
      )}
      onClick={() => toggle(currentValue)}
      title={isListening ? t("micListening") : t("micStart")}
    >
      {isListening ? (
        <>
          <MicOff className="h-3 w-3 animate-pulse" />
          {t("micListening")}
        </>
      ) : (
        <>
          <Mic className="h-3 w-3" />
          {t("micStart")}
        </>
      )}
    </Button>
  );
}
