from dotenv import load_dotenv
import os
import boto3
import pandas as pd
import numpy as np

# -------------------------------------------------
# 1️⃣ Load Environment Variables
# -------------------------------------------------

load_dotenv()

aws_access_key_id = os.getenv("AWS_ACCESS_KEY")
aws_secret_access_key = os.getenv("AWS_SECRET_KEY")

if not aws_access_key_id or not aws_secret_access_key:
    raise ValueError("AWS credentials not found. Check your .env file.")

# -------------------------------------------------
# 2️⃣ Connect to AWS S3
# -------------------------------------------------

s3 = boto3.client(
    's3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name='ap-south-2'
)

bucket_name = 'ev-cyber-raw-data'
file_key = 'Fuzzy_dataset.csv'

print("⬇ Downloading dataset from S3...")

s3.download_file(bucket_name, file_key, 'raw_dataset.csv')

print("✅ Dataset downloaded successfully.")

# -------------------------------------------------
# 3️⃣ Load Dataset Safely
# -------------------------------------------------

print("📂 Loading dataset...")

df = pd.read_csv(
    "raw_dataset.csv",
    encoding="ISO-8859-1",
    header=None,
    on_bad_lines='skip',
    engine='python'
)

# -------------------------------------------------
# 4️⃣ Assign Column Names
# -------------------------------------------------

df.columns = [
    'Timestamp', 'CAN ID', 'DLC',
    'DATA[0]', 'DATA[1]', 'DATA[2]', 'DATA[3]',
    'DATA[4]', 'DATA[5]', 'DATA[6]', 'DATA[7]',
    'Flag'
]

print("🧱 Columns assigned.")

# -------------------------------------------------
# 5️⃣ Clean Data
# -------------------------------------------------

# Strip whitespace safely
for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = df[col].astype(str).str.strip()

# Target column
df['target'] = df['Flag'].map({'R': 0, 'T': 1})

# Convert numeric fields
df['CAN ID'] = pd.to_numeric(df['CAN ID'], errors='coerce')
df['DLC'] = pd.to_numeric(df['DLC'], errors='coerce')

# -------------------------------------------------
# 6️⃣ Safe Hex Conversion
# -------------------------------------------------

hex_columns = [
    'DATA[0]', 'DATA[1]', 'DATA[2]', 'DATA[3]',
    'DATA[4]', 'DATA[5]', 'DATA[6]', 'DATA[7]'
]

def safe_hex_convert(value):
    try:
        return int(value, 16)
    except:
        return np.nan

for col in hex_columns:
    df[col] = df[col].apply(
        lambda x: safe_hex_convert(x) if isinstance(x, str) else np.nan
    )

print("🔄 Hex conversion completed.")

# -------------------------------------------------
# 7️⃣ Remove Leakage + Missing Values
# -------------------------------------------------

df.drop(columns=['Timestamp', 'Flag'], inplace=True)

df.dropna(inplace=True)

print("🧹 Cleaned dataset.")

# -------------------------------------------------
# 8️⃣ Save Processed Dataset
# -------------------------------------------------

df.to_csv("processed_can_data.csv", index=False)

print("🎉 Preprocessing complete.")
print(f"Final dataset shape: {df.shape}")
print("Saved as processed_can_data.csv")

