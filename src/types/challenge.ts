export type ChallengeStatus = "draft" | "in_progress" | "completed";

export interface CanvasFields {
  strategic_context: string;
  problem: string;
  impact: string;
  stakeholders: string;
  challenge_statement: string;
  success_metrics: string;
  constraints: string;
  resources: string;
  hypotheses: string;
  solution_approach: string;
  governance: string;
  deliverables: string;
}

export interface Evaluation {
  score: number;
  level: string;
  summary: string;
  sections: Record<string, { score: number; feedback: string }>;
  recommendations: string[];
}

export interface Challenge {
  id: string;
  title: string;
  status: ChallengeStatus;
  quality_score: number | null;
  created_at: string;
  updated_at: string;
  canvas: CanvasFields;
  evaluation: Evaluation | null;
}

export const emptyCanvas: CanvasFields = {
  strategic_context: "",
  problem: "",
  impact: "",
  stakeholders: "",
  challenge_statement: "",
  success_metrics: "",
  constraints: "",
  resources: "",
  hypotheses: "",
  solution_approach: "",
  governance: "",
  deliverables: "",
};
