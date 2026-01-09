export interface RecommendationConfig {
  mode: 'dating' | 'social';
  dailyLimit: number;
  explorationRate: number; // For future implementation of novelty
  weights: {
    interestSimilarity: number;
    communityOverlap: number;
    personalityAlignment: number;
    activityScore: number;
    freshness: number;
  };
}

export interface MatchScoreDetails {
  interest_match: number;
  community_overlap: number;
  personality_alignment: number;
  activity_score: number;
  freshness: number;
}

export interface ScoredMatch {
  userData: any; // Profile data
  scoreData: {
    total_score: number;
    explanation: string;
    details: MatchScoreDetails;
  };
}

// v2 Antigravity (Recommendation Engine)
