export interface LearnerState {
  concept: string;
  understanding: number;
  reasoning_stability: number;
  transfer_strength: number;
  confidence: number;
  misconceptions: string[];
  evidence_count: number;
  last_updated: string;
}

export type ConceptStatus = 'strong' | 'medium' | 'fragile';

export interface ConceptNode {
  id: string;
  label: string;
  score: number;
  status: ConceptStatus;
  x?: number;
  y?: number;
  children?: string[];
}

export interface Prediction {
  concept: string;
  misconception: string;
  confidence: number;
  evidence: string;
}

export type SimulationStage = 'understand' | 'predict' | 'stress-test' | 'repair' | 'transfer' | 'prove';
