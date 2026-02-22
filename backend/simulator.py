import requests
import random
import time

API_URL = "http://localhost:8000/predict"

# -------------------------------------------------
# Normal Traffic Generator
# -------------------------------------------------

def generate_normal_packet():
    return {
        "can_id": random.choice([512, 545, 600]),
        "dlc": 8,
        "data0": random.randint(0, 50),
        "data1": 0,
        "data2": 0,
        "data3": random.randint(0, 120),
        "data4": 0,
        "data5": 0,
        "data6": 0,
        "data7": 0
    }

# -------------------------------------------------
# Fuzzing Attack Generator
# -------------------------------------------------

def generate_attack_packet():
    return {
        "can_id": random.randint(0, 2047),
        "dlc": 8,
        "data0": random.randint(200, 255),
        "data1": random.randint(200, 255),
        "data2": random.randint(200, 255),
        "data3": random.randint(200, 255),
        "data4": random.randint(200, 255),
        "data5": random.randint(200, 255),
        "data6": random.randint(200, 255),
        "data7": random.randint(200, 255)
    }

# -------------------------------------------------
# Send Packet to API
# -------------------------------------------------

def send_packet(packet):
    try:
        response = requests.post(API_URL, json=packet)
        return response.json()
    except:
        return None

# -------------------------------------------------
# Simulation Loop (Normal + DoS Burst)
# -------------------------------------------------

if __name__ == "__main__":

    print("🚗 Starting Vehicle Traffic Simulation...\n")

    while True:

        # DoS burst mode
        if random.random() < 0.1:
            print("🚨 DOS BURST MODE 🚨")

            for _ in range(20):
                packet = generate_attack_packet()
                result = send_packet(packet)

                if result:
                    print(f"DOS | {result['threat_level']} | {result['attack_type']}")

            time.sleep(2)
            continue

        # Normal vs attack traffic
        if random.random() < 0.7:
            packet = generate_normal_packet()
            traffic_type = "NORMAL"
        else:
            packet = generate_attack_packet()
            traffic_type = "ATTACK"

        result = send_packet(packet)

        if result:
            print(f"{traffic_type} | {result['threat_level']} | {result['attack_type']} | Score: {result['threat_score']}")

        time.sleep(1)
