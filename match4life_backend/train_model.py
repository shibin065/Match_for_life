import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
import joblib
from pathlib import Path
import urllib.request

MODEL_PATH = Path(__file__).parent / "ml_model" / "match4life_donation_model.pkl"
DATA_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/blood-transfusion/transfusion.data"

def train_and_evaluate():
    print("Fetching UCI Blood Transfusion dataset...")
    # Load data directly from UCI repo
    df = pd.read_csv(DATA_URL)
    
    # Rename columns to match our expected format
    df.columns = ['Recency', 'Frequency', 'Monetary', 'Time', 'Target']
    
    # Drop Monetary as specified by requirements
    X = df[['Recency', 'Frequency', 'Time']]
    y = df['Target']
    
    # Split the dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_probs = rf_model.predict_proba(X_test)[:, 1]
    
    print("Training Gradient Boosting...")
    gb_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    gb_model.fit(X_train, y_train)
    gb_preds = gb_model.predict(X_test)
    gb_probs = gb_model.predict_proba(X_test)[:, 1]
    
    # Evaluate
    print("\n--- Random Forest ---")
    print(classification_report(y_test, rf_preds))
    print(f"ROC-AUC: {roc_auc_score(y_test, rf_probs):.4f}")
    
    print("\n--- Gradient Boosting ---")
    print(classification_report(y_test, gb_preds))
    print(f"ROC-AUC: {roc_auc_score(y_test, gb_probs):.4f}")
    
    # Choose better model (simplistic choice based on ROC-AUC or just select RF)
    best_model = rf_model if roc_auc_score(y_test, rf_probs) > roc_auc_score(y_test, gb_probs) else gb_model
    print(f"\nSelected Model: {type(best_model).__name__}")
    
    # Save the model
    os.makedirs(MODEL_PATH.parent, exist_ok=True)
    joblib.dump(best_model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_and_evaluate()
