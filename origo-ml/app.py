from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
from model import UserEmbeddingNetwork
from features import FeatureEngineer
from scorer import CompatibilityScorer
from dotenv import load_dotenv

# Load Env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Components
feature_engineer = FeatureEngineer()

# Load Model (or init fresh for MVP)
model = UserEmbeddingNetwork()
try:
    model.load_state_dict(torch.load('user_embedding_model.pth'))
    model.eval()
    print("✅ Loaded trained model.")
except:
    print("⚠️ No trained model found. Initializing random weights (OK for testing flow).")
    model.eval()

scorer = CompatibilityScorer(model, feature_engineer)

@app.route('/', methods=['GET'])
def health():
    return jsonify({"status": "Origo ML Engine Online 🧠"})

@app.route('/api/ml/generate-embedding', methods=['POST'])
def generate_embedding():
    """
    Receives User Profile + Answers -> Returns 128-dim Vector
    """
    try:
        data = request.json
        user_data = data.get('user_data', {})
        
        # 1. Process Features
        features = feature_engineer.process_user(user_data) # Returns np array
        
        # 2. Forward Pass
        embedding = model.encode_user(features)
        
        return jsonify({
            "status": "success",
            "user_id": user_data.get('user_id'),
            "embedding": embedding.tolist()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ml/calculate-compatibility', methods=['POST'])
def check_compatibility():
    """
    Compare two users completely (Hybrid Score)
    """
    try:
        data = request.json
        user1 = data.get('user1')
        user2 = data.get('user2')
        
        score = scorer.calculate_compatibility(user1, user2)
        
        return jsonify({
            "compatibility_score": score,
            "match_grade": "High" if score > 80 else "Medium" if score > 50 else "Low"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
