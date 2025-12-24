import numpy as np

class CompatibilityScorer:
    """
    Calculates compatibility scores using the Hybrid Weighted Formula.
    """
    def __init__(self, model, feature_engineer):
        self.model = model
        self.feature_engineer = feature_engineer
        
        # 1. Macro Weights
        self.weights = {
            'vector_similarity': 0.40,  # Neural Network Match
            'interest_overlap': 0.25,    # Direct Interest Match
            'question_alignment': 0.20,  # Algorithm Logic Match
            'behavioral_fit': 0.10,      # Activity Match
            'purpose_match': 0.05        # Intent Match
        }

        # 2. Question-Specific Weights (The "Hinge" Logic)
        self.question_weights = {
            'social_level': 2.5,
            'communication_style': 3.0, # Highest
            'friend_values': 2.5,
            'dating_intent': 4.0,       # Critical
            'weekend_vibe': 2.0,
            'recharge': 2.0,
            'texting_style': 2.0,
            'planning_style': 2.0,
            'music_taste': 1.5,
            'stress_handling': 1.5
        }
    
    def calculate_compatibility(self, user1_data, user2_data):
        """
        Calculate overall compatibility score (0-100)
        """
        scores = {}
        
        # --- A. Vector Similarity (40%) ---
        # Note: We assume embeddings are pre-calculated or fast to calc
        f1 = self.feature_engineer.process_user(user1_data)
        f2 = self.feature_engineer.process_user(user2_data)
        vec1 = self.model.encode_user(f1)
        vec2 = self.model.encode_user(f2)
        scores['vector_similarity'] = self._cosine_similarity(vec1, vec2)
        
        # --- B. Interest Overlap (25%) ---
        scores['interest_overlap'] = self._jaccard_similarity(
            user1_data.get('interests', []), 
            user2_data.get('interests', [])
        )
        
        # --- C. Question Alignment (20%) ---
        scores['question_alignment'] = self._calculate_question_alignment(
            user1_data.get('answers', {}),
            user2_data.get('answers', {})
        )
        
        # --- D. Behavioral & Purpose (15%) ---
        scores['behavioral_fit'] = 0.8 # Placeholder for MVP
        scores['purpose_match'] = 1.0 if user1_data.get('purpose') == user2_data.get('purpose') else 0.5
        
        # --- Weighted Sum ---
        final_score = sum(scores[k] * self.weights[k] for k in scores.keys())
        
        # Scale to 0-100
        return min(max(int(final_score * 100), 0), 100)
    
    def _cosine_similarity(self, vec1, vec2):
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
    
    def _jaccard_similarity(self, list1, list2):
        s1, s2 = set(list1), set(list2)
        if not s1 or not s2: return 0.0
        return len(s1.intersection(s2)) / len(s1.union(s2))

    def _calculate_question_alignment(self, answers1, answers2):
        """
        Calculates weighted agreement on the specific questions.
        """
        total_weight = 0
        earned_score = 0
        
        for q_key, weight in self.question_weights.items():
            if q_key not in answers1 or q_key not in answers2:
                continue
                
            val1 = answers1[q_key]
            val2 = answers2[q_key]
            
            # Logic: Categorical matches earn full points
            # Lists earn Jaccard points
            sim = 0
            if isinstance(val1, list):
                sim = self._jaccard_similarity(val1, val2)
            elif val1 == val2:
                sim = 1.0
            
            earned_score += sim * weight
            total_weight += weight
            
        if total_weight == 0: return 0.5 # Neutral if no data
        return earned_score / total_weight
