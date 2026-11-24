import { describe, expect, it } from "vitest";
import { emptyCanvas } from "@/types/challenge";
import {
  applyInterviewMerge,
  defaultMergeActions,
  setAllMergeActions,
  validateAudioFile,
  MAX_AUDIO_BYTES,
} from "@/lib/interview-merge";

describe("interview merge rules", () => {
  const current = {
    ...emptyCanvas,
    problem: "Alto tempo de resposta no suporte.",
    impact: "Perda de 15% dos clientes.",
    constraints: "Orçamento fixo.",
  };
  const proposed = {
    strategic_context: "Expansão para América Latina em 2026.",
    problem: "Fila média de 48 horas no atendimento.",
    impact: "Churn anual de US$ 300 mil.",
    constraints: "",
  };

  it("defaults empty fields to replace, filled fields to append, and missing proposals to ignore", () => {
    const actions = defaultMergeActions(current, proposed);
    expect(actions.strategic_context).toBe("replace");
    expect(actions.problem).toBe("append");
    expect(actions.impact).toBe("append");
    expect(actions.constraints).toBe("ignore");
    expect(actions.deliverables).toBe("ignore");
  });

  it("applies replace, append, and ignore per field without erasing existing content on empty proposals", () => {
    const actions = {
      ...defaultMergeActions(current, proposed),
      problem: "replace" as const,
      impact: "append" as const,
      constraints: "replace" as const,
      strategic_context: "ignore" as const,
    };
    const merged = applyInterviewMerge(current, proposed, actions);
    expect(merged.strategic_context).toBe("");
    expect(merged.problem).toBe("Fila média de 48 horas no atendimento.");
    expect(merged.impact).toBe("Perda de 15% dos clientes.\n\nChurn anual de US$ 300 mil.");
    expect(merged.constraints).toBe("Orçamento fixo.");
  });

  it("applies bulk actions only to fields with proposed content", () => {
    const replaceAll = setAllMergeActions(proposed, "replace");
    expect(replaceAll.problem).toBe("replace");
    expect(replaceAll.constraints).toBe("ignore");
    const merged = applyInterviewMerge(current, proposed, replaceAll);
    expect(merged.problem).toBe("Fila média de 48 horas no atendimento.");
    expect(merged.constraints).toBe("Orçamento fixo.");
  });

  it("validates audio size up to 20 MB and supported formats", () => {
    expect(validateAudioFile({ size: 0, type: "audio/webm", name: "a.webm" })).toBe("empty");
    expect(validateAudioFile({ size: MAX_AUDIO_BYTES + 1, type: "audio/mp3", name: "big.mp3" })).toBe("too_large");
    expect(validateAudioFile({ size: 1024, type: "application/pdf", name: "doc.pdf" })).toBe("unsupported_type");
    expect(validateAudioFile({ size: 5 * 1024 * 1024, type: "audio/webm;codecs=opus", name: "rec.webm" })).toBeNull();
    expect(validateAudioFile({ size: 2 * 1024 * 1024, type: "", name: "interview.m4a" })).toBeNull();
  });
});