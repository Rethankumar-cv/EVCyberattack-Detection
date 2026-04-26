# ≡ƒ¢í∩╕Å EV Cyber Detection ΓÇö Vehicle Cyberattack Detection System

A full-stack, real-time automotive cybersecurity platform that monitors CAN bus traffic, detects cyberattacks using machine learning, and visualizes threats on a live SOC-style dashboard.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite%207-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![scikit-learn](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat&logo=python)](https://python.org/)

---

## ≡ƒôû Table of Contents

- [Overview](#-overview)
- [System Architecture](#∩╕Å-system-architecture)
- [Tech Stack](#∩╕Å-tech-stack)
- [Project Structure](#-project-structure)
- [ML Pipeline](#-ml-pipeline)
- [Backend API](#-backend-api)
- [Frontend Dashboard](#∩╕Å-frontend-dashboard)
- [Attack Types Detected](#∩╕Å-attack-types-detected)
- [API Reference](#-api-reference)
- [Getting Started](#∩╕Å-getting-started)
- [Running the Full Stack](#-running-the-full-stack)
- [Dashboard Features](#-dashboard-features)
- [Incident Investigation](#-incident-investigation)
- [Deployment](#-deployment)
- [Dataset](#∩╕Å-dataset)
- [Model Details](#-model-details)
- [Troubleshooting](#-troubleshooting)

---

## ≡ƒöì Overview

This project simulates a real-world **Automotive Security Operations Center (SOC)** targeting vehicle-level CAN bus intrusion detection. It combines:

- **Machine learning models** trained on real CAN bus attack datasets
- **A FastAPI backend** that serves real-time predictions via REST API
- **A React dashboard** that streams, visualizes, and investigates threats live

The system classifies incoming CAN packets into threat levels ΓÇö **SAFE**, **WARNING**, or **CRITICAL** ΓÇö and identifies specific attack signatures like **DOS**, **FUZZING**, and **RPM\_SPOOF**.

---

## ≡ƒÅù∩╕Å System Architecture

```
ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
Γöé                   React Dashboard                       Γöé
Γöé   ThreatMeter Γöé PacketStream Γöé AlertPanel Γöé ScoreChart  Γöé
Γöé                  IncidentDrawer                         Γöé
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
                         Γöé POST /predict (every 1s)
                         Γöé Axios
ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
Γöé              FastAPI Backend (app.py)                   Γöé
Γöé         CAN Packet ΓåÆ Scale ΓåÆ Predict ΓåÆ Score            Γöé
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
             Γöé                          Γöé
    ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ      ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
    Γöé  KNN + RF        Γöé      Γöé   Isolation Forest   Γöé
    Γöé  Classifiers     Γöé      Γöé   Anomaly Detection  Γöé
    Γöé  (supervised)    Γöé      Γöé   (unsupervised)     Γöé
    ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ      ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
             Γöé                          Γöé
    ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓû╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
    Γöé         Trained on processed_can_data.csv     Γöé
    ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
```

**Threat Score Formula:**
```
threat_score = (KNN_pred ├ù 0.4) + (RF_pred ├ù 0.4) + (anomaly_score ├ù 0.2)
```

| Threshold | Level |
|-----------|-------|
| `score > 0.6` | ≡ƒö┤ CRITICAL |
| `score > 0.3` | ≡ƒƒí WARNING |
| `score Γëñ 0.3` | ≡ƒƒó SAFE |

---

## ≡ƒ¢á∩╕Å Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + Vite | React 19, Vite 7 |
| **HTTP Client** | Axios | ^1.13 |
| **Charts** | Recharts | ^3.7 |
| **Styling** | Vanilla CSS ΓÇö dark SOC theme | ΓÇö |
| **Fonts** | Share Tech Mono, Rajdhani (Google Fonts) | ΓÇö |
| **Backend** | FastAPI + Uvicorn | 0.129 / 0.41 |
| **Validation** | Pydantic | ^2.12 |
| **ML Models** | scikit-learn | ^1.8 |
| **Data** | Pandas, NumPy | 3.0, 2.4 |
| **Serialization** | joblib | ^1.5 |
| **Language** | Python 3.10+ / JavaScript ES2022 | ΓÇö |

---

## ≡ƒôü Project Structure

```
ev-cyber-detection/
Γöé
Γö£ΓöÇΓöÇ backend/
Γöé   Γö£ΓöÇΓöÇ app.py              # FastAPI server ΓÇö /predict, /health endpoints
Γöé   Γö£ΓöÇΓöÇ predict.py          # Standalone prediction module (for testing)
Γöé   Γö£ΓöÇΓöÇ simulator.py        # CAN packet traffic simulator
Γöé   Γö£ΓöÇΓöÇ requirements.txt    # Backend-only Python dependencies
Γöé   ΓööΓöÇΓöÇ .env.example        # Environment variable template
Γöé
Γö£ΓöÇΓöÇ ml-pipeline/
Γöé   Γö£ΓöÇΓöÇ train.py            # Model training (KNN + RF + Isolation Forest)
Γöé   Γö£ΓöÇΓöÇ preprocess.py       # Data cleaning & feature engineering (uses AWS S3)
Γöé   Γö£ΓöÇΓöÇ knn_model.pkl       # Trained K-Nearest Neighbors (~300 MB)
Γöé   Γö£ΓöÇΓöÇ rf_model.pkl        # Trained Random Forest (~2 MB)
Γöé   Γö£ΓöÇΓöÇ iso_model.pkl       # Trained Isolation Forest (~1.2 MB)
Γöé   ΓööΓöÇΓöÇ scaler.pkl          # StandardScaler for KNN input normalization
Γöé
Γö£ΓöÇΓöÇ vehicle-cyber-dashboard/     # React frontend (Vite)
Γöé   Γö£ΓöÇΓöÇ .env.example             # Frontend env variable template
Γöé   ΓööΓöÇΓöÇ src/
Γöé       Γö£ΓöÇΓöÇ api.js               # Axios connector ΓÇö reads VITE_API_URL env var
Γöé       Γö£ΓöÇΓöÇ App.jsx              # Root ΓÇö polling loop, state, simulation fallback
Γöé       Γö£ΓöÇΓöÇ index.css            # Dark SOC theme (CSS custom properties)
Γöé       Γö£ΓöÇΓöÇ App.css              # Layout styles
Γöé       ΓööΓöÇΓöÇ components/
Γöé           Γö£ΓöÇΓöÇ ThreatMeter.jsx      # SVG arc gauge with animated needle
Γöé           Γö£ΓöÇΓöÇ PacketStream.jsx     # Live scrollable CAN packet log (last 50)
Γöé           Γö£ΓöÇΓöÇ AlertPanel.jsx       # CRITICAL-only alert list (clickable)
Γöé           Γö£ΓöÇΓöÇ ScoreChart.jsx       # Recharts line chart ΓÇö last 20 threat scores
Γöé           ΓööΓöÇΓöÇ IncidentDrawer.jsx   # Slide-in investigation panel
Γöé
Γö£ΓöÇΓöÇ requirements.txt         # Full Python dependency list (root)
Γö£ΓöÇΓöÇ render.yaml              # Render.com deploy configuration
Γö£ΓöÇΓöÇ .gitignore
ΓööΓöÇΓöÇ README.md
```

---

## ≡ƒñû ML Pipeline

### 1. Data Preprocessing (`ml-pipeline/preprocess.py`)

- Downloads raw dataset from **AWS S3** (`ev-cyber-raw-data` bucket)
- Cleans missing/corrupt records; strips whitespace
- Converts hex DATA bytes to integers
- Drops leakage columns (`Timestamp`, `Flag`)
- Labels: `R` = 0 (Normal), `T` = 1 (Attack)
- Outputs `processed_can_data.csv`

> **Requires:** `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` in `.env` (only for retraining)

### 2. Model Training (`ml-pipeline/train.py`)

Three models trained in sequence on `processed_can_data.csv`:

#### K-Nearest Neighbors (KNN)
- Supervised binary classifier
- Input: **scaled** features via `StandardScaler`
- `n_neighbors=5`, stratified 70/30 train/test split
- Detects patterns similar to known attack profiles

#### Random Forest (RF)
- Supervised ensemble classifier (`n_estimators=100`)
- Input: **raw unscaled** features
- Robust to feature scale; captures complex decision boundaries

#### Isolation Forest
- **Unsupervised** anomaly detection (`contamination=0.1`)
- Flags statistically rare CAN patterns without needing labels
- Output: `-1` = anomaly, `1` = normal

All models saved to `ml-pipeline/*.pkl` via `joblib`.

### 3. Threat Scoring (`backend/app.py`)

```python
# Weighted ensemble score (0.0 ΓÇô 1.0)
threat_score = (knn_pred * 0.4) + (rf_pred * 0.4) + (anomaly_score * 0.2)

# Threshold classification
CRITICAL  ΓåÆ threat_score > 0.6
WARNING   ΓåÆ threat_score > 0.3
SAFE      ΓåÆ threat_score Γëñ 0.3
```

---

## ≡ƒÜÇ Backend API

**File:** `backend/app.py`  
**Framework:** FastAPI + Uvicorn  
**Port:** `8000`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check ΓÇö returns service status |
| `GET` | `/health` | Render health probe endpoint |
| `POST` | `/predict` | CAN packet classification |
| `GET` | `/docs` | Auto-generated Swagger UI |
| `GET` | `/redoc` | ReDoc API documentation |

**Startup behaviour:** Loads all 4 model files from `ml-pipeline/` at boot. The `MODEL_DIR` path is configurable via environment variable.

---

## ≡ƒûÑ∩╕Å Frontend Dashboard

### `src/App.jsx` ΓÇö Core Logic

- Generates a random CAN packet every **1 second**
- Sends it to `POST /predict` via Axios
- Distributes the result to all panels via React state
- **Offline simulation mode:** If backend is unreachable, auto-generates realistic threat distributions so the UI stays live

### `src/api.js` ΓÇö API Connector

Reads the backend URL from the `VITE_API_URL` environment variable:

```js
// .env (local development)
VITE_API_URL=http://127.0.0.1:8000

// .env (production ΓÇö set in Vercel dashboard)
VITE_API_URL=https://ev-cyber-backend.onrender.com
```

Returns `null` on network failure, which triggers simulation mode in `App.jsx`.

---

## ΓÜá∩╕Å Attack Types Detected

| Attack | Trigger Condition | Description |
|--------|------------------|-------------|
| `FUZZING` | `DATA[0] > 200` | Random payload injection into CAN frames |
| `DOS` | `CAN ID > 1500` | High-frequency message flooding |
| `RPM_SPOOF` | `DATA[3] > 180` | Manipulated RPM sensor signal |
| `UNKNOWN_ATTACK` | All other anomalies | Unrecognized abnormal CAN behavior |
| `NORMAL` | `threat_score < 0.3` | Legitimate vehicle traffic |

---

## ≡ƒôí API Reference

### `POST /predict`

**Request Body:**
```json
{
  "can_id":  1234,
  "dlc":     8,
  "data0":   216,
  "data1":   0,
  "data2":   0,
  "data3":   138,
  "data4":   0,
  "data5":   0,
  "data6":   0,
  "data7":   0
}
```

**Response:**
```json
{
  "knn_prediction":  1,
  "rf_prediction":   1,
  "anomaly_flag":    1,
  "threat_score":    0.8,
  "threat_level":    "CRITICAL",
  "attack_type":     "FUZZING"
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `knn_prediction` | int | 0 / 1 | KNN binary prediction |
| `rf_prediction` | int | 0 / 1 | Random Forest binary prediction |
| `anomaly_flag` | int | 0 / 1 | 1 = anomaly (Isolation Forest) |
| `threat_score` | float | 0.0ΓÇô1.0 | Weighted ensemble threat score |
| `threat_level` | string | ΓÇö | `SAFE` / `WARNING` / `CRITICAL` |
| `attack_type` | string | ΓÇö | `NORMAL` / `FUZZING` / `DOS` / `RPM_SPOOF` / `UNKNOWN_ATTACK` |

### `GET /health`

```json
{ "status": "healthy" }
```

### `GET /`

```json
{ "status": "ok", "service": "Vehicle Cyberattack Detection API" }
```

---

## ΓÜÖ∩╕Å Getting Started

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | Any |

---

### Step 1 ΓÇö Clone the Repository

```bash
git clone https://github.com/Rethankumar-cv/EVCyberattack-Detection.git
cd EVCyberattack-Detection
```

---

### Step 2 ΓÇö Python Virtual Environment & Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate ΓÇö Windows (PowerShell)
venv\Scripts\activate

# Activate ΓÇö macOS / Linux
source venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

---

### Step 3 ΓÇö Frontend Dependencies

```bash
cd vehicle-cyber-dashboard
npm install
cd ..
```

---

### Step 4 ΓÇö Environment Variables (Optional)

Copy the env templates:

```bash
# Backend
copy backend\.env.example backend\.env

# Frontend
copy vehicle-cyber-dashboard\.env.example vehicle-cyber-dashboard\.env
```

Edit as needed. For local development the defaults work without any changes.

---

### Step 5 ΓÇö (Optional) Retrain Models

> Skip this if `.pkl` files already exist in `ml-pipeline/`. They are pre-trained and ready.

```bash
# Requires AWS credentials in backend/.env for S3 download
python ml-pipeline/preprocess.py

# Then train all three models (~5ΓÇô20 min depending on hardware)
python ml-pipeline/train.py
```

---

## ≡ƒÅâ Running the Full Stack

> Run **two terminals** side by side ΓÇö one for backend, one for frontend.

---

### Terminal 1 ΓÇö Start the Backend (FastAPI)

```bash
# From the project root: ev-cyber-detection/

# Windows (PowerShell) ΓÇö PYTHONUTF8=1 prevents encoding errors
$env:PYTHONUTF8="1"; venv\Scripts\python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port 8000

# macOS / Linux
PYTHONUTF8=1 venv/bin/uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

**Expected output:**
```
[INFO] Loading models from: D:\ev-cyber-detection\ml-pipeline
[INFO] Models loaded successfully.
INFO:     Started server process [XXXXX]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

| URL | Purpose |
|-----|---------|
| http://127.0.0.1:8000 | API root |
| http://127.0.0.1:8000/docs | Swagger UI |
| http://127.0.0.1:8000/health | Health check |

> ΓÜá∩╕Å **Windows Note:** Do NOT use `--reload` flag ΓÇö it causes a Unicode encoding crash via multiprocessing on Windows. Use the command above without `--reload`.

---

### Terminal 2 ΓÇö Start the Frontend (React/Vite)

```bash
cd vehicle-cyber-dashboard
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in 500 ms

  Γ₧£  Local:   http://localhost:5173/
  Γ₧£  Network: use --host to expose
```

Dashboard live at: **http://localhost:5173**

> **Tip:** The dashboard works **without the backend** ΓÇö it enters simulation mode automatically and generates random threats so you can explore the UI offline.

---

### Optional ΓÇö Run the Packet Simulator

To flood the backend with mixed normal/attack traffic for testing:

```bash
# In a third terminal (with venv activated)
python backend/simulator.py
```

---

## ≡ƒôè Dashboard Features

| Panel | Description |
|-------|-------------|
| ΓÜí **Threat Meter** | SVG arc gauge with animated needle ΓÇö SAFE / WARNING / CRITICAL zones |
| ≡ƒôí **Live Packet Stream** | Scrollable log of last 50 CAN packets with hex bytes, CAN ID, DLC, and threat badge |
| ≡ƒÜ¿ **Critical Alerts** | CRITICAL-only filtered list ΓÇö click any card to open investigation panel |
| ≡ƒôê **Threat Score Chart** | Recharts line graph of the last 20 threat scores over time |

**Color scheme:**
| Level | Color | Hex |
|-------|-------|-----|
| ≡ƒƒó SAFE | Green | `#00ff88` |
| ≡ƒƒí WARNING | Amber | `#ffaa00` |
| ≡ƒö┤ CRITICAL | Red | `#ff2244` |

**Connection status indicator (top-right):**
| Badge | Meaning |
|-------|---------|
| ≡ƒƒó `ONLINE` | Connected to FastAPI backend |
| ≡ƒƒí `SIMULATION` | Backend offline ΓÇö using local simulation |

---

## ≡ƒöì Incident Investigation

Click any **CRITICAL** alert card to open the slide-in investigation panel:

```
ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
Γöé   Incident Investigation     Γöé
ΓöéΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöé
Γöé  [CRITICAL | FUZZING]        Γöé
Γöé                              Γöé
Γöé  Packet Details              Γöé
Γöé  CAN ID    0x1A3 (419)       Γöé
Γöé  DLC       8                 Γöé
Γöé  Timestamp 8:42:31 PM        Γöé
Γöé  Score     87.0%             Γöé
Γöé  Anomaly   TRUE              Γöé
Γöé                              Γöé
Γöé  DATA [0ΓÇô7]                  Γöé
Γöé  D8   00   00  ...  00       Γöé
Γöé                              Γöé
Γöé  Attack Description          Γöé
Γöé  Random payload injection... Γöé
Γöé                              Γöé
Γöé  Recommended Response        Γöé
Γöé  Inspect ECU message...      Γöé
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
```

**Behaviour:**
- Selected alert gets a full red highlight border + `Γû╢ INVESTIGATING` badge
- Clicking a different alert updates the panel live
- Click the backdrop or `Γ£ò` button to dismiss
- Panel slides in from the right with smooth animation

---

## ≡ƒîÉ Deployment

### Frontend ΓåÆ Vercel

1. Push code to GitHub
2. Import `EVCyberattack-Detection` repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** = `vehicle-cyber-dashboard`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy

### Backend ΓåÆ Render

1. Create a **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** = `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add a **Render Disk** (5 GB, mounted at `/mnt/models`) for the 300 MB KNN model
6. Set environment variables:
   - `MODEL_DIR` = `/mnt/models`
   - `FRONTEND_URL` = your Vercel app URL (for CORS)

> See the full deployment guide in `render.yaml` and the `.env.example` files.

---

## ≡ƒùé∩╕Å Dataset

| File | Size | Description |
|------|------|-------------|
| `raw_dataset.csv` | ~190 MB | Original CAN bus captures (normal + attack) |
| `processed_can_data.csv` | ~111 MB | Cleaned, feature-engineered training data |

> Both CSV files are excluded from Git (`.gitignore`) due to size. They are stored in AWS S3.

**Features used for training:**

| Column | Type | Description |
|--------|------|-------------|
| `CAN ID` | int | CAN bus message identifier |
| `DLC` | int | Data Length Code (bytes per frame) |
| `DATA[0]`ΓÇô`DATA[7]` | int | 8 payload bytes per frame (hex ΓåÆ int) |
| `target` | int | Label: `0` = normal, `1` = attack |

---

## ≡ƒºá Model Details

| Model | File | Algorithm | Features | Size |
|-------|------|-----------|----------|------|
| KNN | `knn_model.pkl` | K-Nearest Neighbors (k=5) | Scaled | ~300 MB |
| Random Forest | `rf_model.pkl` | Random Forest (100 trees) | Raw | ~2 MB |
| Isolation Forest | `iso_model.pkl` | Isolation Forest (contamination=0.1) | Raw | ~1.2 MB |
| Scaler | `scaler.pkl` | StandardScaler | ΓÇö | <1 KB |

**Ensemble voting weights:**
| Model | Weight |
|-------|--------|
| KNN | 40% |
| Random Forest | 40% |
| Isolation Forest (anomaly) | 20% |

---

## ≡ƒöº Troubleshooting

### `ERR_CONNECTION_REFUSED` on frontend

The backend is not running. Start it with:
```powershell
$env:PYTHONUTF8="1"; venv\Scripts\python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

### `UnicodeEncodeError: 'charmap' codec` on Windows

Always start the backend with `PYTHONUTF8=1` set (shown above). Do **not** use `--reload` on Windows.

### Port 8000 already in use

```powershell
# Find and kill the process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Models not found (`FileNotFoundError`)

Ensure you are running uvicorn **from the project root** (`ev-cyber-detection/`), not from inside the `backend/` folder:
```bash
# Correct ΓÇö run from root
venv\Scripts\python.exe -m uvicorn backend.app:app ...

# Incorrect ΓÇö do NOT cd into backend first
cd backend && uvicorn app:app ...
```

### Frontend shows `SIMULATION` badge (yellow)

This means the backend is offline or unreachable. The dashboard still works ΓÇö it generates synthetic data. Start the backend to switch to live mode.

---

## ≡ƒôä License

This project is for educational and research purposes.

---

*Built with React + FastAPI + scikit-learn for automotive cybersecurity research.*
