import { RecommendationConfig } from './types.ts';

export const DATING_MODE_CONFIG: RecommendationConfig = {
  mode: 'dating',
  dailyLimit: 5,
  explorationRate: 0.15,
  weights: {
    interestSimilarity: 0.35,
    communityOverlap: 0.20,
    personalityAlignment: 0.25,
    activityScore: 0.10,
    freshness: 0.10,
  },
};

export const SOCIAL_MODE_CONFIG: RecommendationConfig = {
  mode: 'social',
  dailyLimit: 12,
  explorationRate: 0.30,
  weights: {
    interestSimilarity: 0.30,
    communityOverlap: 0.30,
    personalityAlignment: 0.20,
    activityScore: 0.10,
    freshness: 0.10,
  },
};

// v2 Antigravity (Recommendation Engine)
