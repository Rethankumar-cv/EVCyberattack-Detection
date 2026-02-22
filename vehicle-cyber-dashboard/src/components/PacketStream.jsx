import { useRef, useEffect } from "react";

const levelColor = {
    SAFE: "#00ff88",
    WARNING: "#ffaa00",
    CRITICAL: "#ff2244",
};

export default function PacketStream({ packets }) {
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [packets]);

    return (
        <div className="packet-stream">
            <h2 className="panel-title">📡 LIVE PACKET STREAM</h2>
            <div className="packet-list" ref={listRef}>
                {packets.length === 0 && (
                    <div className="packet-empty">Waiting for packets…</div>
                )}
                {packets.map((p, i) => (
                    <div
                        key={i}
                        className="packet-row"
                        style={{
                            borderLeft: `3px solid ${levelColor[p.result?.threat_level] || "#444"}`,
                            animation: i === packets.length - 1 ? "fadeIn 0.3s ease" : "none",
                        }}
                    >
                        <div className="packet-header">
                            <span className="packet-id">CAN #{p.can_id?.toString(16).toUpperCase().padStart(3, "0")}</span>
                            <span className="packet-dlc">DLC:{p.dlc}</span>
                            <span className="packet-level" style={{ color: levelColor[p.result?.threat_level] || "#888" }}>
                                {p.result?.threat_level || "—"}
                            </span>
                        </div>
                        <div className="packet-data">
                            {[p.data0, p.data1, p.data2, p.data3, p.data4, p.data5, p.data6, p.data7]
                                .map((b) => (b ?? 0).toString(16).toUpperCase().padStart(2, "0"))
                                .join(" ")}
                        </div>
                        <div className="packet-score">
                            Score: {p.result ? (p.result.threat_score * 100).toFixed(1) + "%" : "—"} &nbsp;|&nbsp; Flag: {p.result?.anomaly_flag != null ? p.result.anomaly_flag.toString() : "—"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
