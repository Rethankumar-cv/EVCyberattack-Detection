import axios from "axios";

// In production, set VITE_API_URL in Vercel environment variables
// e.g. VITE_API_URL=https://ev-cyber-backend.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const API_URL = `${BASE_URL}/predict`;

export const sendPacket = async (packet) => {
  try {
    const res = await axios.post(API_URL, packet);
    return res.data;
  } catch (err) {
    console.log("Backend offline, using simulation");
    return null;
  }
};
