import axios from "axios";

export const API_URL = "http://127.0.0.1:8000/predict";

export const sendPacket = async (packet) => {
  try {
    const res = await axios.post(API_URL, packet);
    return res.data;
  } catch (err) {
    console.log("Backend offline, using simulation");
    return null;
  }
};
