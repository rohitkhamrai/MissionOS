export interface MissionAnalysis {
  feasible: boolean;
  conflict: {
    required: number;
    available: number;
  };
  strategies: {
    id: string;
    label: string;
    success: number;
    sacrifice_score: number;
    cuts: string[];
    reason: string;
  }[];
  recommended: string | null;
  rejected_alternatives_summary: string;
  evidence_reviewed: string[];
  primary_risks: string[];
  milestones: {
    title: string;
    expected_day: number;
    critical: boolean;
  }[];
}

export interface InitialMissionInput {
  description: string;
  githubData?: string;
}

export interface RenegotiationInput {
  originalMission: MissionAnalysis;
  delayedMilestone: string;
  expectedDay: number;
  actualDay: number;
}
