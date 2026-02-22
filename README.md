# 🛡️ EV Cyber Detection — Vehicle Cyberattack Detection System

A full-stack, real-time automotive cybersecurity platform that monitors CAN bus traffic, detects cyberattacks using machine learning, and visualizes threats on a live SOC-style dashboard.

---

## 📖 Table of Contents
- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [ML Pipeline](#-ml-pipeline)
- [Attack Types Detected](#-attack-types-detected)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Running the Full Stack](#-running-the-full-stack)
- [Dashboard Features](#-dashboard-features)
- [Incident Investigation](#-incident-investigation)
- [Dataset & Model Details](#-dataset--model-details)

---

## 🔍 Overview

This project simulates a real-world **Automotive Security Operations Center (SOC)** targeting vehicle-level CAN bus intrusion detection. It combines:

- **Machine learning models** trained on real CAN bus attack datasets
- **A FastAPI backend** that serves real-time predictions
- **A React dashboard** that streams, visualizes, and investigates threats live

The system classifies incoming CAN packets into threat levels — **SAFE**, **WARNING**, or **CRITICAL** — and identifies specific attack signatures like **DOS**, **FUZZING**, and **RPM_SPOOF**.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Dashboard                       │
│   ThreatMeter │ PacketStream │ AlertPanel │ ScoreChart  │
│                  IncidentDrawer                         │
└────────────────────────┬────────────────────────────────┘
                         │ POST /predict (every 1s)
                         │ Axios
┌────────────────────────▼────────────────────────────────┐
│              FastAPI Backend (app.py)                   │
│         CAN Packet → Scale → Predict → Score            │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
    ┌────────▼────────┐      ┌──────────▼──────────┐
    │  KNN + RF        │      │   Isolation Forest   │
    │  Classifiers     │      │   Anomaly Detection  │
    │  (supervised)    │      │   (unsupervised)     │
    └─────────────────┘      └─────────────────────┘
```

**Threat Score Formula:**
```
threat_score = (KNN_pred × 0.4) + (RF_pred × 0.4) + (anomaly_score × 0.2)
```

| Threat Score | Level |
|---|---|
| > 0.6 | 🔴 CRITICAL |
| 0.3 – 0.6 | 🟡 WARNING |
| < 0.3 | 🟢 SAFE |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 7, Axios, Recharts |
| **Styling** | Vanilla CSS — dark SOC theme |
| **Backend** | FastAPI, Uvicorn, Pydantic |
| **ML Models** | scikit-learn (KNN, Random Forest, Isolation Forest) |
| **Data** | Pandas, NumPy, joblib |

---

## 📁 Project Structure

```
ev-cyber-detection/
│
├── backend/
│   ├── app.py              # FastAPI server — /predict endpoint
│   ├── predict.py          # Standalone prediction module
│   └── simulator.py        # CAN packet simulator for testing
│
├── ml-pipeline/
│   ├── train.py            # Model training (KNN + RF + Isolation Forest)
│   ├── preprocess.py       # Data cleaning & feature engineering
│   ├── knn_model.pkl       # Trained KNN model
│   ├── rf_model.pkl        # Trained Random Forest model
│   ├── iso_model.pkl       # Trained Isolation Forest model
│   └── scaler.pkl          # StandardScaler for KNN normalization
│
├── vehicle-cyber-dashboard/     # React frontend (Vite)
│   └── src/
│       ├── api.js               # Axios connector to FastAPI
│       ├── App.jsx              # Root — polling loop + state
│       ├── index.css            # Dark SOC theme
│       └── components/
│           ├── ThreatMeter.jsx      # SVG arc gauge with animated needle
│           ├── PacketStream.jsx     # Live scrollable CAN packet log
│           ├── AlertPanel.jsx       # CRITICAL alert list (clickable)
│           ├── ScoreChart.jsx       # Recharts line graph
│           └── IncidentDrawer.jsx   # Slide-in investigation panel
│
├── processed_can_data.csv
├── raw_dataset.csv
└── requirements.txt
```

---

## 🤖 ML Pipeline

Three models are trained and combined into an ensemble:

| Model | Type | Input | Role |
|-------|------|-------|------|
| **KNN** (k=5) | Supervised | Scaled features | Attack classification |
| **Random Forest** (100 trees) | Supervised | Raw features | Attack classification |
| **Isolation Forest** (contamination=0.1) | Unsupervised | Raw features | Anomaly detection |

```bash
# Preprocess data
python ml-pipeline/preprocess.py

# Train all models
python ml-pipeline/train.py
```

---

## ⚠️ Attack Types Detected

| Attack Type | Detection Logic | Description |
|-------------|----------------|-------------|
| `FUZZING` | `DATA[0] > 200` | Random payload injection into CAN frames |
| `DOS` | `CAN ID > 1500` | High-frequency message bus flooding |
| `RPM_SPOOF` | `DATA[3] > 180` | Manipulated RPM sensor signal |
| `UNKNOWN_ATTACK` | Other anomalies | Unrecognized abnormal CAN behavior |
| `NORMAL` | `threat_score < 0.3` | Legitimate vehicle traffic |

---

## 📡 API Reference

### `POST /predict`

**Request:**
```json
{
  "can_id": 1234,
  "dlc": 8,
  "data0": 216,
  "data1": 0,
  "data2": 0,
  "data3": 138,
  "data4": 0,
  "data5": 0,
  "data6": 0,
  "data7": 0
}
```

**Response:**
```json
{
  "knn_prediction": 1,
  "rf_prediction": 1,
  "anomaly_flag": 1,
  "threat_score": 0.8,
  "threat_level": "CRITICAL",
  "attack_type": "FUZZING"
}
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone & Setup Python Environment

```bash
git clone <your-repo-url>
cd ev-cyber-detection

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
cd vehicle-cyber-dashboard
npm install
```

---

## 🏃 Running the Full Stack

**Terminal 1 — Backend:**
```bash
uvicorn backend.app:app --reload --port 8000
```
> API docs: http://127.0.0.1:8000/docs

**Terminal 2 — Frontend:**
```bash
cd vehicle-cyber-dashboard
npm run dev
```
> Dashboard: http://localhost:5173

> **Note:** The dashboard runs in **simulation mode** automatically when the backend is offline — so you can explore the full UI without the ML backend running.

---

## 📊 Dashboard Features

| Panel | Description |
|-------|-------------|
| ⚡ **Threat Meter** | Animated SVG arc gauge — SAFE / WARNING / CRITICAL |
| 📡 **Live Packet Stream** | Last 50 CAN frames with hex bytes, CAN ID, DLC, threat level |
| 🚨 **Critical Alerts** | CRITICAL-only log — clickable for deep investigation |
| 📈 **Threat Score Chart** | Live Recharts line graph of the last 20 threat scores |

Color coding: 🟢 SAFE `#00ff88` &nbsp;|&nbsp; 🟡 WARNING `#ffaa00` &nbsp;|&nbsp; 🔴 CRITICAL `#ff2244`

---

## 🔍 Incident Investigation

Click any **CRITICAL** alert card to open the investigation drawer:

- **Packet Details** — CAN ID, DLC, Timestamp, Threat Score, Anomaly Flag
- **DATA [0–7]** — Full hex payload grid
- **Attack Description** — Explanation specific to the detected attack type
- **Recommended Response** — Actionable SOC response steps

The selected alert stays highlighted. Clicking another alert updates the panel live. Close with `✕` or by clicking the backdrop.

---

## 🗂️ Dataset & Model Details

| File | Size | Description |
|------|------|-------------|
| [raw_dataset.csv](cci:7://file:///d:/ev-cyber-detection/raw_dataset.csv:0:0-0:0) | ~190 MB | Original CAN captures (normal + attack) |
| [processed_can_data.csv](cci:7://file:///d:/ev-cyber-detection/processed_can_data.csv:0:0-0:0) | ~111 MB | Cleaned, labeled training data |

**Ensemble weights:**
- KNN → **40%** &nbsp;|&nbsp; Random Forest → **40%** &nbsp;|&nbsp; Isolation Forest → **20%**

---

*Built for automotive cybersecurity research using React + FastAPI + scikit-learn.*
