import { MissionAnalysis } from "@/types/mission";

export function getMockMission(url?: string): MissionAnalysis {
  const isNext = url?.includes("next.js");
  const isBootstrap = url?.includes("bootstrap");

  if (isNext) {
    return {
      feasible: false,
      conflict: { required: 150, available: 60 },
      strategies: [
        {
          id: "delay-features",
          label: "Delay Experimental",
          success: 90,
          sacrifice_score: 7,
          cuts: ["Drop Server Actions v2", "Delay React Compiler integration"],
          reason: "Turbopack integration is already consuming 80% of bandwidth. We must drop experimental React features."
        },
        {
          id: "crunch-core",
          label: "Core Only Crunch",
          success: 70,
          sacrifice_score: 5,
          cuts: ["Drop documentation overhaul"],
          reason: "We can save the compiler and server actions if we sacrifice documentation and examples."
        }
      ],
      recommended: "delay-features",
      rejected_alternatives_summary: "A crunch on the core without proper documentation risks alienating the enterprise user base.",
      evidence_reviewed: [
        "Parsed 2,143 open issues",
        "Detected Vercel/Next.js repository",
        "Identified Turbopack PR bottlenecks"
      ],
      primary_risks: [
        "Turbopack instability in edge cases",
        "Community confusion over Server Actions v2 delay",
        "Incomplete documentation frustrates early adopters"
      ],
      milestones: [
        { title: "Stabilize Turbopack HMR", expected_day: 2, critical: true },
        { title: "Drop Server Actions v2", expected_day: 4, critical: true },
        { title: "Conference Demo Build", expected_day: 7, critical: false }
      ]
    };
  }

  if (isBootstrap) {
    return {
      feasible: false,
      conflict: { required: 90, available: 45 },
      strategies: [
        {
          id: "keep-mixins",
          label: "Retain Legacy Mixins",
          success: 95,
          sacrifice_score: 9,
          cuts: ["Drop native CSS Grid timeline", "Cancel container queries"],
          reason: "We cannot rewrite the grid and migrate away from Sass mixins in this timeframe without breaking millions of sites."
        },
        {
          id: "hard-break",
          label: "v6 Hard Break",
          success: 40,
          sacrifice_score: 4,
          cuts: ["Drop IE11 fallback scripts"],
          reason: "We push the grid rewrite but accept a 60% chance of community backlash due to broken layouts."
        }
      ],
      recommended: "keep-mixins",
      rejected_alternatives_summary: "A v6 hard break would fragment the community too aggressively right now.",
      evidence_reviewed: [
        "Parsed 340 open issues",
        "Detected twbs/bootstrap repository",
        "Identified CSS Grid migration conflicts"
      ],
      primary_risks: [
        "Legacy codebase maintenance overhead",
        "Sub-optimal grid performance",
        "Alienation of modern CSS-in-JS developers"
      ],
      milestones: [
        { title: "Revert CSS Grid Branch", expected_day: 1, critical: true },
        { title: "Patch Sass Mixins", expected_day: 3, critical: true },
        { title: "Publish v6 Alpha", expected_day: 5, critical: false }
      ]
    };
  }

  // Default: React
  return {
    feasible: false,
    conflict: { required: 120, available: 80 },
    strategies: [
      {
        id: "conservative",
        label: "Scope Reduction",
        success: 95,
        sacrifice_score: 8,
        cuts: ["Remove realtime sync", "Drop dark mode", "Delay analytics"],
        reason: "Significant resource deficit requires cutting non-critical path features to ensure core stability."
      },
      {
        id: "aggressive",
        label: "Weekend Crunch",
        success: 60,
        sacrifice_score: 4,
        cuts: ["Drop dark mode"],
        reason: "High risk approach requiring overtime, preserving most scope but risking burnout and bugs."
      },
      {
        id: "balanced",
        label: "Phased Rollout",
        success: 85,
        sacrifice_score: 6,
        cuts: ["Delay analytics", "Simplify UI animations"],
        reason: "Optimal balance of scope and risk, deferring nice-to-have features post-launch."
      }
    ],
    recommended: "balanced",
    rejected_alternatives_summary: "Scope reduction sacrifices too much product value, while crunching risks catastrophic failure on launch day.",
    evidence_reviewed: [
      "Parsed 1,204 open issues",
      "Identified 45 pending PRs",
      "Detected React/TypeScript stack",
      "Analyzed 230k Stargazers"
    ],
    primary_risks: [
      "Core architecture setup takes longer than 1 day",
      "API rate limits during integration testing",
      "Burnout due to reduced buffering in schedule"
    ],
    milestones: [
      { title: "Core Architecture Setup", expected_day: 1, critical: true },
      { title: "API Integration", expected_day: 3, critical: true },
      { title: "UI Polish", expected_day: 5, critical: false }
    ]
  };
}

export function getMockRenegotiation(url?: string): MissionAnalysis {
  const base = getMockMission(url);
  return {
    ...base,
    conflict: { required: base.conflict.required - 20, available: base.conflict.available - 40 }, 
    strategies: base.strategies.map(s => ({
      ...s,
      success: Math.max(10, s.success - 25)
    })),
    evidence_reviewed: [
      "Analyzed schedule drift impact",
      "Re-evaluated resource availability",
      "Calculated cascading dependency delays"
    ]
  };
}

export async function simulateLatency<T>(data: T, min = 500, max = 1200): Promise<T> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}
