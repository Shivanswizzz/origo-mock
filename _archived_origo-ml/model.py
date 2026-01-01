import torch
import torch.nn as nn
import numpy as np

class UserEmbeddingNetwork(nn.Module):
    """
    Deep neural network to encode user features into 128-dimensional vector
    """
    def __init__(self, input_dim=200, embedding_dim=128):
        super(UserEmbeddingNetwork, self).__init__()
        
        self.encoder = nn.Sequential(
            # Input layer
            nn.Linear(input_dim, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            
            # Hidden layer 1
            nn.Linear(256, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            
            # Hidden layer 2
            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.2),
            
            # Embedding layer
            nn.Linear(128, embedding_dim),
            nn.Tanh()  # Normalize to [-1, 1]
        )
        
        # L2 normalization for cosine similarity
        self.normalize = nn.functional.normalize
        
    def forward(self, x):
        embedding = self.encoder(x)
        # L2 normalize for cosine similarity
        return self.normalize(embedding, p=2, dim=1)
    
    def encode_user(self, features):
        """
        Generate embedding for a single user (Numpy input -> Numpy output)
        """
        self.eval() # Ensure eval mode
        with torch.no_grad():
            x = torch.FloatTensor(features).unsqueeze(0) # Add batch dim
            embedding = self.forward(x)
            return embedding.squeeze(0).numpy()
