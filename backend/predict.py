import joblib
import numpy as np
import pandas as pd
import os

# -------------------------------------------------
# 1️⃣ Resolve Project Paths
# -------------------------------------------------

# Get project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model paths
knn_path = os.path.join(BASE_DIR, "ml-pipeline", "knn_model.pkl")
rf_path = os.path.join(BASE_DIR, "ml-pipeline", "rf_model.pkl")
iso_path = os.path.join(BASE_DIR, "ml-pipeline", "iso_model.pkl")
scaler_path = os.path.join(BASE_DIR, "ml-pipeline", "scaler.pkl")

# -------------------------------------------------
# 2️⃣ Load Models
# -------------------------------------------------

print("🔄 Loading models...")

knn = joblib.load(knn_path)
rf = joblib.load(rf_path)
iso = joblib.load(iso_path)
scaler = joblib.load(scaler_path)

print("✅ Models loaded successfully.")

# -------------------------------------------------
# 3️⃣ Threat Scoring Logic
# -------------------------------------------------

def calculate_threat_score(knn_pred, rf_pred, anomaly_score):
    """
    Combines predictions into a unified threat score
    """
    score = (knn_pred * 0.4) + (rf_pred * 0.4) + (anomaly_score * 0.2)
    return score

# -------------------------------------------------
# 4️⃣ Prediction Function
# -------------------------------------------------

def predict_attack(packet):
    """
    packet: dictionary containing CAN telemetry values
    """

    df = pd.DataFrame([packet])

    # Scale features for KNN
    scaled = scaler.transform(df)

    # Model predictions
    knn_pred = knn.predict(scaled)[0]
    rf_pred = rf.predict(df)[0]

    # Isolation Forest anomaly detection
    anomaly = iso.predict(df)[0]
    anomaly_score = 1 if anomaly == -1 else 0

    # Threat score
    threat_score = calculate_threat_score(knn_pred, rf_pred, anomaly_score)

    # Threat label
    if threat_score > 0.6:
        threat_level = "CRITICAL"
    elif threat_score > 0.3:
        threat_level = "WARNING"
    else:
        threat_level = "SAFE"
    return {
    "knn_prediction": int(knn_pred),
    "rf_prediction": int(rf_pred),
    "anomaly_flag": int(anomaly_score),
    "threat_score": float(round(threat_score, 3)),
    "threat_level": threat_level
}

    

# -------------------------------------------------
# 5️⃣ Test Prediction (Manual Run)
# -------------------------------------------------

if __name__ == "__main__":

    # Sample CAN packet
    sample_packet = {
        'CAN ID': 545,
        'DLC': 8,
        'DATA[0]': 216,
        'DATA[1]': 0,
        'DATA[2]': 0,
        'DATA[3]': 138,
        'DATA[4]': 0,
        'DATA[5]': 0,
        'DATA[6]': 0,
        'DATA[7]': 0
    }

    result = predict_attack(sample_packet)

    print("\n🚨 Prediction Result:\n")
    print(result)
