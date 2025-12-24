import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer

class FeatureEngineer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        # TF-IDF for Bio text processing
        self.tfidf = TfidfVectorizer(max_features=50)
        
        # Hardcoded Categories for One-Hot Encoding consistency
        self.categories = {
            'gender': ['male', 'female', 'non-binary', 'prefer-not-to-say'],
            'social_level': ['Homebody', 'Social butterfly', 'Ambivert'], # Q1
            'weekend_vibe': ['Gaming/Chill', 'Small Group', 'Party', 'Outdoor'], # Q2
            'recharge': ['Alone', 'With People', 'Both'], # Q3
            'communication_style': ['In-person', 'Calls', 'Texting', 'Any'], # Q4
            'texting_style': ['Quick', 'Thoughtful', 'Memes', 'Short'], # Q5
            'sleep_schedule': ['Night owl', 'Early bird', 'Flexible'], # Q6
            'planning_style': ['Spontaneous', 'Planner', 'Flexible'], # Q7
            'stress_handling': ['Talk', 'Active', 'Distract', 'Process Alone'], # Q13
            'group_role': ['Lead', 'Contribute', 'Chill', 'Solo'], # Q15
            'dating_intent': ['Serious', 'Casual', 'Friendship', 'Exploring'] # D1
        }
        
        # Fit label encoders immediately
        for key, values in self.categories.items():
            le = LabelEncoder()
            le.fit(values)
            self.label_encoders[key] = le

    def process_user(self, user_data):
        """
        Convert raw user data (DB Dict) into ML-ready feature vector (numpy array).
        """
        features_list = []
        
        # --- 1. Demographic Features (4 dims) ---
        # Age (Normalized 18-30 map to 0-1)
        age = self._calculate_age(user_data.get('date_of_birth', '2000-01-01'))
        features_list.append((age - 18) / 12.0) 
        
        # Year of Study (Normalized 1-5)
        features_list.append(user_data.get('year_of_study', 1) / 5.0)
        
        # Gender (One-Hot - 4 dims)
        gender_vec = self._encode_one_hot('gender', user_data.get('gender', 'prefer-not-to-say'))
        features_list.extend(gender_vec)

        # --- 2. Bio Embedding (TF-IDF - 50 dims) ---
        # Note: In production, we'd fit this on the whole dataset. 
        # For individual inference, we transform using pre-fitted state or use a simpler embedding if empty.
        # Here we mock a 50-dim vector if bio is missing or model not fully trained to avoid fit errors on single sample.
        try:
            bio_vec = self.tfidf.transform([user_data.get('bio', '')]).toarray()[0]
        except:
            bio_vec = np.zeros(50)
        features_list.extend(bio_vec)

        # --- 3. Matching Questions (The Core 15) ---
        answers = user_data.get('answers', {})
        
        # Q1: Social Vibe
        features_list.extend(self._encode_one_hot('social_level', answers.get('social_level')))
        # Q2: Weekend
        features_list.extend(self._encode_one_hot('weekend_vibe', answers.get('weekend_vibe')))
        # Q3: Recharge
        features_list.extend(self._encode_one_hot('recharge', answers.get('recharge')))
        # Q4: Comm Style (High Weight)
        features_list.extend(self._encode_one_hot('communication_style', answers.get('communication_style')))
        # Q5: Texting
        features_list.extend(self._encode_one_hot('texting_style', answers.get('texting_style')))
        # Q6: Sleep
        features_list.extend(self._encode_one_hot('sleep_schedule', answers.get('sleep_schedule')))
        # Q7: Planning
        features_list.extend(self._encode_one_hot('planning_style', answers.get('planning_style')))
        
        # Multi-Selects (Simplified as count/ratio for encoding vector, detailed comparison happens in Scorer)
        # Q8 Hangout Spots (Ratio of 6)
        features_list.append(len(answers.get('hangout_spots', [])) / 6.0)
        # Q9 Music (Ratio of 8)
        features_list.append(len(answers.get('music_taste', [])) / 8.0)
        # Q10 Free Time (Ratio of 6)
        features_list.append(len(answers.get('free_time', [])) / 6.0)
        
        # Q13 Stress
        features_list.extend(self._encode_one_hot('stress_handling', answers.get('stress_handling')))
        # Q15 Group Role
        features_list.extend(self._encode_one_hot('group_role', answers.get('group_role')))
        
        # Dating (D1)
        if user_data.get('dating_enabled', False):
            features_list.extend(self._encode_one_hot('dating_intent', answers.get('dating_intent')))
        else:
            features_list.extend([0,0,0,0]) # Zero out if not dating

        # --- 4. Behavioral (3 dims) ---
        features_list.append(user_data.get('response_rate', 0.5))
        features_list.append(user_data.get('connection_acceptance_rate', 0.5))
        
        # Pad or Trim to match Input Dimension (e.g., 200)
        # Current logic yields ~100-120 dims. We will pad to 200.
        current_len = len(features_list)
        target_len = 200
        if current_len < target_len:
            features_list.extend([0] * (target_len - current_len))
        
        return np.array(features_list[:target_len], dtype=np.float32)

    def _encode_one_hot(self, category, value):
        valid_values = self.categories.get(category, [])
        vec = [0] * len(valid_values)
        if value in valid_values:
            idx = valid_values.index(value)
            vec[idx] = 1
        return vec

    def _calculate_age(self, dob_str):
        if not dob_str: return 20
        # Placeholder logic
        return 20
