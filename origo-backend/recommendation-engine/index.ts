import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DATING_MODE_CONFIG, SOCIAL_MODE_CONFIG } from './config.ts';
import { ScoredMatch, RecommendationConfig } from './types.ts';

export class RecommendationEngine {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get personalized recommendations for a user
   */
  async getRecommendations(
    userId: string,
    mode: 'dating' | 'social' = 'dating'
  ): Promise<ScoredMatch[]> {
    const config = mode === 'dating' ? DATING_MODE_CONFIG : SOCIAL_MODE_CONFIG;

    // 1. Candidate Generation (Refined Rules SQL)
    const { data: candidates, error: candidateError } = await this.supabase
      .rpc('get_candidates_v2', {
        query_user_id: userId,
        match_mode: mode,
        limit_count: 100 // Pool size for ranking
      });

    if (candidateError) throw candidateError;
    if (!candidates || candidates.length === 0) return [];

    // 2. Scoring & Ranking (Pairwise via SQL RPC v2)
    const scoredMatches: ScoredMatch[] = await Promise.all(
      candidates.map(async (candidate: any) => {
        const { data: scoreData, error: scoreError } = await this.supabase
          .rpc('calculate_match_score_v2', {
            user_a_id: userId,
            user_b_id: candidate.id,
            w1: config.weights.interestSimilarity,
            w2: config.weights.communityOverlap,
            w3: config.weights.personalityAlignment,
            w4: config.weights.activityScore,
            w5: config.weights.freshness
          });

        if (scoreError) {
          console.error(`Error scoring candidate ${candidate.id}:`, scoreError);
          return null;
        }

        return {
          userData: candidate,
          scoreData
        };
      })
    );

    // 3. Post-processing: Constraints & Safety
    // Filter out nulls, sort by score, and apply daily limits
    return scoredMatches
      .filter((m): m is ScoredMatch => m !== null)
      .sort((a, b) => b.scoreData.total_score - a.scoreData.total_score)
      .slice(0, config.dailyLimit);
  }

  /**
   * Log feedback for a match (Like/Skip/View)
   * This is critical for personalization (learning loop)
   */
  async logFeedback(
    actorId: string,
    targetId: string,
    action: 'like' | 'pass' | 'view',
    duration?: number
  ) {
    if (action === 'view') {
      return await this.supabase
        .from('analytics_profile_views')
        .insert({
          viewer_id: actorId,
          viewed_id: targetId,
          view_duration_seconds: duration || 0
        });
    } else {
      return await this.supabase
        .from('analytics_likes')
        .insert({
          actor_id: actorId,
          target_id: targetId,
          action_type: action === 'like' ? 'like' : 'pass'
        });
    }
  }
}

// v2 Antigravity (Recommendation Engine)
