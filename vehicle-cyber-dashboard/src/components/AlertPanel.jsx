import { useEffect, useRef } from "react";

export default function AlertPanel({ alerts, selectedIncident, onSelect }) {
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [alerts]);

    const formatTime = (ts) => new Date(ts).toLocaleTimeString();

    return (
        <div className="alert-panel">
            <h2 className="panel-title alert-title">
                <span className="alert-dot" />
                🚨 CRITICAL ALERTS
            </h2>
            <div className="alert-hint">Click an alert to investigate</div>
            <div className="alert-list" ref={listRef}>
                {alerts.length === 0 && (
                    <div className="alert-empty">No critical events detected</div>
                )}
                {alerts.map((a, i) => {
                    const isSelected = selectedIncident && selectedIncident.timestamp === a.timestamp;
                    return (
                        <div
                            key={i}
                            className={`alert-row ${isSelected ? "alert-row-selected" : ""}`}
                            onClick={() => onSelect(a)}
                            title="Click to investigate"
                        >
                            <div className="alert-row-header">
                                <span className="alert-time">{formatTime(a.timestamp)}</span>
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    {isSelected && <span className="alert-selected-marker">▶ INVESTIGATING</span>}
                                    <span className="alert-crit-badge">CRITICAL</span>
                                </div>
                            </div>
                            <div className="alert-can">
                                CAN #{a.can_id?.toString(16).toUpperCase().padStart(3, "0")} | DLC:{a.dlc}
                            </div>
                            {a.result?.attack_type && a.result.attack_type !== "NORMAL" && (
                                <div className="alert-attack-type">{a.result.attack_type}</div>
                            )}
                            <div className="alert-detail">
                                Score: {(a.result.threat_score * 100).toFixed(1)}% &nbsp;|&nbsp; Anomaly: {a.result.anomaly_flag?.toString()}
                            </div>
                            <div className="alert-bytes">
                                {[a.data0, a.data1, a.data2, a.data3, a.data4, a.data5, a.data6, a.data7]
                                    .map(b => (b ?? 0).toString(16).toUpperCase().padStart(2, "0"))
                                    .join(" ")}
                            </div>
                            <div className="alert-row-cta">🔍 Investigate →</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
