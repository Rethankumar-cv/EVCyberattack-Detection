# -*- coding: utf-8 -*-
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# -------------------------------------------------
# Environment Config
# -------------------------------------------------

# On Render, set MODEL_DIR env var to the path of your model files
# Defaults to ../ml-pipeline relative to this file (local dev)
MODEL_DIR = os.getenv(
    "MODEL_DIR",
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml-pipeline")
)

# Frontend URL — set FRONTEND_URL env var on Render/Vercel
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

# -------------------------------------------------
# Initialize FastAPI
# -------------------------------------------------

app = FastAPI(title="Vehicle Cyberattack Detection API")

# CORS for React dashboard (local + production)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

# Inject production frontend URL from env (set this on Render)
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Load Models
# -------------------------------------------------

print(f"[INFO] Loading models from: {MODEL_DIR}")

knn = joblib.load(os.path.join(MODEL_DIR, "knn_model.pkl"))
rf = joblib.load(os.path.join(MODEL_DIR, "rf_model.pkl"))
iso = joblib.load(os.path.join(MODEL_DIR, "iso_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

print("[INFO] Models loaded successfully.")

# -------------------------------------------------
# Health Check (required by Render)
# -------------------------------------------------

@app.get("/")
def root():
    return {"status": "ok", "service": "Vehicle Cyberattack Detection API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# -------------------------------------------------
# Request Schema
# -------------------------------------------------

class CANPacket(BaseModel):
    can_id: int
    dlc: int
    data0: int
    data1: int
    data2: int
    data3: int
    data4: int
    data5: int
    data6: int
    data7: int

# -------------------------------------------------
# Threat Score Logic
# -------------------------------------------------

def calculate_threat_score(knn_pred, rf_pred, anomaly_score):
    score = (knn_pred * 0.4) + (rf_pred * 0.4) + (anomaly_score * 0.2)
    return score

# -------------------------------------------------
# Attack Type Classification
# -------------------------------------------------

def classify_attack(df, threat_score):
    if threat_score < 0.3:
        return "NORMAL"

    if df['DATA[0]'].values[0] > 200:
        return "FUZZING"

    if df['CAN ID'].values[0] > 1500:
        return "DOS"

    if df['DATA[3]'].values[0] > 180:
        return "RPM_SPOOF"

    return "UNKNOWN_ATTACK"

# -------------------------------------------------
# Prediction Endpoint
# -------------------------------------------------

@app.post("/predict")
def predict(packet: CANPacket):

    df = pd.DataFrame([{
        'CAN ID': packet.can_id,
        'DLC': packet.dlc,
        'DATA[0]': packet.data0,
        'DATA[1]': packet.data1,
        'DATA[2]': packet.data2,
        'DATA[3]': packet.data3,
        'DATA[4]': packet.data4,
        'DATA[5]': packet.data5,
        'DATA[6]': packet.data6,
        'DATA[7]': packet.data7
    }])

    # Scale for KNN
    scaled = scaler.transform(df)

    # Predictions
    knn_pred = knn.predict(scaled)[0]
    rf_pred = rf.predict(df)[0]
    anomaly = iso.predict(df)[0]

    anomaly_score = 1 if anomaly == -1 else 0

    # Threat scoring
    threat_score = calculate_threat_score(knn_pred, rf_pred, anomaly_score)

    # Threat level
    if threat_score > 0.6:
        threat_level = "CRITICAL"
    elif threat_score > 0.3:
        threat_level = "WARNING"
    else:
        threat_level = "SAFE"

    # Attack type
    attack_type = classify_attack(df, threat_score)

    return {
        "knn_prediction": int(knn_pred),
        "rf_prediction": int(rf_pred),
        "anomaly_flag": int(anomaly_score),
        "threat_score": float(round(threat_score, 3)),
        "threat_level": threat_level,
        "attack_type": attack_type
    }
