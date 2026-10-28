import os
from pathlib import Path
import joblib
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

MODEL_PATH = Path(__file__).parent / "match4life_donation_model.pkl"

def get_model():
    if not MODEL_PATH.exists():
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

model = get_model()

def predict_donation(recency, frequency, time):
    global model
    if model is None:
        model = get_model()
        if model is None:
            return {"prediction": 0, "donation_propensity": 0.0, "error": "Model not trained yet."}
            
    row = pd.DataFrame({
        "Recency": [recency],
        "Frequency": [frequency],
        "Time": [time],
    })
    
    try:
        label = int(model.predict(row)[0])
        # Ensure robust positive class index checking
        if 1 in model.classes_:
            positive_index = list(model.classes_).index(1)
            score = float(model.predict_proba(row)[0][positive_index])
        else:
            score = 0.0
            
        return {
            "prediction": label,
            "donation_propensity": round(score * 100, 2),
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {
            "prediction": 0,
            "donation_propensity": 0.0,
            "error": str(e)
        }
