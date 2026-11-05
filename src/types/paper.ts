export interface QuantitativeMetric {
  metricName: string;
  paperValue: string;
  baselineValue: string;
  relativeGain: string;
}

export interface ProblemDefinition {
  centralChallenge: string;
  openQuestion: string;
  baselineLimitations: string[];
}

export interface ProposedMethodology {
  novelArchitecture: string;
  mathematicalFormulation: string; // LaTeX formatted string
  algorithmicFramework: string;
  datasetsUsed: string[];
}

export interface KeyFindingsAndMetrics {
  quantitativeResults: QuantitativeMetric[];
  baselineComparisons: string;
  keyAchievements: string[];
}

export interface LimitationsAndFutureWork {
  notedConstraints: string[];
  hardwareDependencies: string;
  potentialBiases: string[];
  openDirections: string[];
}

export interface PaperAnalysisSteps {
  problemDefinition: ProblemDefinition;
  proposedMethodology: ProposedMethodology;
  keyFindingsAndMetrics: KeyFindingsAndMetrics;
  limitationsAndFutureWork: LimitationsAndFutureWork;
  executiveSummary: [string, string, string]; // Exactly 3 bullets
}

export interface PaperAnalysisResult {
  paperTitle: string;
  authors: string[];
  publicationYear?: string;
  institutionOrVenue?: string;
  analyzedAt: string;
  modelUsed: string;
  steps: PaperAnalysisSteps;
}

export interface PaperDocument {
  id: string;
  title: string;
  authors: string[];
  year: string;
  venue?: string;
  abstract: string;
  pages: { pageNumber: number; text: string }[];
  rawText: string;
  fileSize?: string;
  isBenchmark?: boolean;
  precomputedAnalysis?: PaperAnalysisResult;
}
