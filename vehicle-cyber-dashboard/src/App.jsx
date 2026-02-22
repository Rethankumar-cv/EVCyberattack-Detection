import { useEffect, useState } from "react";
import { sendPacket } from "./api";
import ThreatMeter from "./components/ThreatMeter";
import PacketStream from "./components/PacketStream";
import AlertPanel from "./components/AlertPanel";
import ScoreChart from "./components/ScoreChart";
import IncidentDrawer from "./components/IncidentDrawer";

const generatePacket = () => ({
  can_id: Math.floor(Math.random() * 2000),
  dlc: 8,
  data0: Math.floor(Math.random() * 255),
  data1: 0,
  data2: 0,
  data3: Math.floor(Math.random() * 255),
  data4: 0,
  data5: 0,
  data6: 0,
  data7: 0,
});

function App() {
  const [threat, setThreat] = useState(null);
  const [history, setHistory] = useState([]);   // last 20 results
  const [packets, setPackets] = useState([]);   // all packets w/ results
  const [alerts, setAlerts] = useState([]);   // CRITICAL only
  const [online, setOnline] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const tick = async () => {
      const packet = generatePacket();
      try {
        const result = await sendPacket(packet);
        if (!result) throw new Error("null result");
        setOnline(true);
        setError(null);
        setThreat(result);
        setHistory(prev => [...prev.slice(-19), result]);
        const entry = { ...packet, result, timestamp: Date.now() };
        setPackets(prev => [...prev.slice(-49), entry]);
        if (result.threat_level === "CRITICAL") {
          setAlerts(prev => [...prev.slice(-49), entry]);
        }
      } catch (e) {
        setOnline(false);
        setError("Backend offline – running in simulation mode");
        // Simulate a result so UI stays lively
        const levels = ["SAFE", "WARNING", "CRITICAL"];
        const lvl = levels[Math.floor(Math.random() * levels.length)];
        const score = lvl === "SAFE" ? Math.random() * 0.35
          : lvl === "WARNING" ? 0.35 + Math.random() * 0.35
            : 0.70 + Math.random() * 0.29;
        const result = { threat_level: lvl, threat_score: score, anomaly_flag: lvl !== "SAFE" };
        setThreat(result);
        setHistory(prev => [...prev.slice(-19), result]);
        const entry = { ...packet, result, timestamp: Date.now() };
        setPackets(prev => [...prev.slice(-49), entry]);
        if (lvl === "CRITICAL") {
          setAlerts(prev => [...prev.slice(-49), entry]);
        }
      }
    };

    const interval = setInterval(tick, 1000);
    tick(); // immediate first call
    return () => clearInterval(interval);
  }, []);

  const threatLevel = threat?.threat_level ?? "SAFE";
  const threatScore = threat?.threat_score ?? 0;
  const attackType = threat?.attack_type ?? "NORMAL";

  return (
    <div className="dashboard">
      {/* ─── Header ─────────────────────────────────── */}
      <header className="dash-header">
        <div className="dash-title">
          <span className="dash-icon">🛡️</span>
          Vehicle Cyberattack Detection System
        </div>
        <div className="dash-status">
          <span className={`status-dot ${online ? "online" : "offline"}`} />
          <span className={`status-text ${online ? "online" : "offline"}`}>
            {online ? "ONLINE" : "SIMULATION"}
          </span>
          {error && <span className="status-error">{error}</span>}
        </div>
      </header>

      {/* ─── Main Grid ──────────────────────────────── */}
      <div className="dash-grid">
        <ThreatMeter threatLevel={threatLevel} threatScore={threatScore} attackType={attackType} />
        <PacketStream packets={packets} />
        <AlertPanel
          alerts={alerts}
          selectedIncident={selectedIncident}
          onSelect={(inc) => setSelectedIncident(inc)}
        />
      </div>

      {/* ─── Bottom Chart ───────────────────────────── */}
      <div className="dash-chart-wrap">
        <ScoreChart history={history} />
      </div>

      {/* ─── Incident Drawer ────────────────────────── */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}

export default App;
