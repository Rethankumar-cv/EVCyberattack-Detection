import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# -------------------------------------------------
# 1️⃣ Load Processed Dataset
# -------------------------------------------------

print("📂 Loading processed dataset...")

df = pd.read_csv("processed_can_data.csv")

print("Dataset shape:", df.shape)

# -------------------------------------------------
# 2️⃣ Split Features & Target
# -------------------------------------------------

X = df.drop(columns=['target'])
y = df['target']

# Stratified split (important for classification)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.3,
    random_state=42,
    stratify=y
)

# -------------------------------------------------
# 3️⃣ Feature Scaling (Important for KNN)
# -------------------------------------------------

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -------------------------------------------------
# 4️⃣ Train KNN
# -------------------------------------------------

print("🔹 Training KNN...")

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)

y_pred_knn = knn.predict(X_test_scaled)

print("KNN Accuracy:", accuracy_score(y_test, y_pred_knn))
print("\nKNN Classification Report:\n")
print(classification_report(y_test, y_pred_knn))

# -------------------------------------------------
# 5️⃣ Train Random Forest
# -------------------------------------------------

print("🔹 Training Random Forest...")

rf = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

rf.fit(X_train, y_train)

y_pred_rf = rf.predict(X_test)

print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf))
print("\nRandom Forest Classification Report:\n")
print(classification_report(y_test, y_pred_rf))

# -------------------------------------------------
# 6️⃣ Train Isolation Forest (Anomaly Detection)
# -------------------------------------------------

print("🔹 Training Isolation Forest...")

iso = IsolationForest(
    contamination=0.1,
    random_state=42
)

iso.fit(X_train)

# -------------------------------------------------
# 7️⃣ Save Models
# -------------------------------------------------

print("💾 Saving models...")

joblib.dump(knn, "knn_model.pkl")
joblib.dump(rf, "rf_model.pkl")
joblib.dump(iso, "iso_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("🎉 Models saved successfully.")
