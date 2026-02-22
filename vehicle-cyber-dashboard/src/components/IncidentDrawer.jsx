const ATTACK_INFO = {
    FUZZING: {
        description: "Random payload injection attempt detected. The CAN frame contains randomized bytes inconsistent with any known protocol pattern, indicating an active fuzzing attack against the vehicle ECU.",
        response: "Inspect ECU message integrity. Enable CAN frame filtering on affected IDs and review bus logs for injection source.",
        icon: "🎲",
    },
    DOS: {
        description: "High-frequency CAN message flooding detected. The bus is receiving an abnormal volume of messages from this node, saturating bandwidth and potentially preventing legitimate ECU communication.",
        response: "Monitor bus traffic load and isolate source node. Throttle or blocklist the offending CAN ID at the gateway level.",
        icon: "🌊",
    },
    RPM_SPOOF: {
        description: "Manipulated RPM signal anomaly detected. The CAN frame carries an RPM value that deviates significantly from physically expected readings, suggesting sensor spoofing or replay attack.",
        response: "Validate RPM sensor and ECU synchronization. Cross-check wheel speed and engine sensor readings for coherence.",
        icon: "⚙️",
    },
    UNKNOWN_ATTACK: {
        description: "Unrecognized abnormal CAN behavior detected. The frame exhibits statistical anomalies that do not match any catalogued attack signature.",
        response: "Escalate for manual investigation. Capture full bus trace and submit for signature analysis.",
        icon: "❓",
    },
    NORMAL: {
        description: "No threat detected. Frame pattern is within expected bounds.",
        response: "No action required.",
        icon: "✅",
    },
};

const levelColor = {
    SAFE: "#00ff88",
    WARNING: "#ffaa00",
    CRITICAL: "#ff2244",
};

const byteHex = (v) => (v ?? 0).toString(16).toUpperCase().padStart(2, "0");

export default function IncidentDrawer({ incident, onClose }) {
    if (!incident) return null;

    const { can_id, dlc, data0, data1, data2, data3, data4, data5, data6, data7, result, timestamp } = incident;
    const { threat_level, threat_score, attack_type, anomaly_flag } = result ?? {};

    const info = ATTACK_INFO[attack_type] ?? ATTACK_INFO["UNKNOWN_ATTACK"];
    const lColor = levelColor[threat_level] ?? "#888";
    const bytes = [data0, data1, data2, data3, data4, data5, data6, data7];
    const time = new Date(timestamp).toLocaleTimeString();

    return (
        <>
            {/* Backdrop */}
            <div className="drawer-backdrop" onClick={onClose} />

            {/* Drawer */}
            <aside className="incident-drawer">
                {/* Header */}
                <div className="drawer-header">
                    <span className="drawer-icon">🔍</span>
                    <h2 className="drawer-title">Incident Investigation</h2>
                    <button className="drawer-close" onClick={onClose} title="Close">✕</button>
                </div>

                <div className="drawer-body">
                    {/* Severity badge */}
                    <div className="drawer-badge" style={{ color: lColor, borderColor: lColor, boxShadow: `0 0 16px ${lColor}44` }}>
                        <span className="drawer-badge-level">{threat_level ?? "—"}</span>
                        {attack_type && attack_type !== "NORMAL" && (
                            <span className="drawer-badge-type">| {attack_type}</span>
                        )}
                    </div>

                    {/* Packet details */}
                    <section className="drawer-section">
                        <h3 className="drawer-section-title">📦 Packet Details</h3>
                        <div className="drawer-grid">
                            <div className="detail-row">
                                <span className="detail-key">CAN ID</span>
                                <span className="detail-val" style={{ color: "#00aaff" }}>
                                    0x{can_id?.toString(16).toUpperCase().padStart(3, "0")} ({can_id})
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-key">DLC</span>
                                <span className="detail-val">{dlc}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-key">Timestamp</span>
                                <span className="detail-val">{time}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-key">Threat Score</span>
                                <span className="detail-val" style={{ color: lColor }}>
                                    {threat_score != null ? (threat_score * 100).toFixed(1) + "%" : "—"}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-key">Anomaly Flag</span>
                                <span className="detail-val" style={{ color: anomaly_flag ? "#ff2244" : "#00ff88" }}>
                                    {anomaly_flag != null ? anomaly_flag.toString().toUpperCase() : "—"}
                                </span>
                            </div>
                        </div>

                        {/* Payload */}
                        <div className="payload-label">DATA [0–7]</div>
                        <div className="payload-bytes">
                            {bytes.map((b, i) => (
                                <div key={i} className="payload-byte">
                                    <span className="byte-index">[{i}]</span>
                                    <span className="byte-val">{byteHex(b)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Attack Description */}
                    <section className="drawer-section">
                        <h3 className="drawer-section-title">{info.icon} Attack Description</h3>
                        <p className="drawer-prose">{info.description}</p>
                    </section>

                    {/* Recommended Response */}
                    <section className="drawer-section drawer-section-response">
                        <h3 className="drawer-section-title">🛡️ Recommended Response</h3>
                        <p className="drawer-prose drawer-response">{info.response}</p>
                    </section>
                </div>
            </aside>
        </>
    );
}
