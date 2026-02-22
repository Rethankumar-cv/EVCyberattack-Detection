import { useEffect, useRef } from "react";

const levelConfig = {
    SAFE: { color: "#00ff88", glow: "#00ff88", label: "SAFE", angle: -90 },
    WARNING: { color: "#ffaa00", glow: "#ffaa00", label: "WARNING", angle: 0 },
    CRITICAL: { color: "#ff2244", glow: "#ff2244", label: "CRITICAL", angle: 90 },
};

export default function ThreatMeter({ threatLevel, threatScore, attackType }) {
    const config = levelConfig[threatLevel] || levelConfig["SAFE"];
    const score = Math.round((threatScore ?? 0) * 100);

    // Needle angle: score 0->0%, 100->100%  mapped to -135° to 135°
    const needleAngle = -135 + (score / 100) * 270;

    return (
        <div className="threat-meter">
            <h2 className="panel-title">⚡ THREAT METER</h2>

            <div className="gauge-wrap">
                {/* SVG arc gauge */}
                <svg viewBox="0 0 200 120" className="gauge-svg">
                    {/* Track */}
                    <path
                        d="M 15 110 A 85 85 0 0 1 185 110"
                        fill="none"
                        stroke="#1a1a2e"
                        strokeWidth="18"
                        strokeLinecap="round"
                    />
                    {/* Green segment */}
                    <path
                        d="M 15 110 A 85 85 0 0 1 100 25"
                        fill="none"
                        stroke="#00ff8844"
                        strokeWidth="18"
                        strokeLinecap="round"
                    />
                    {/* Orange segment */}
                    <path
                        d="M 100 25 A 85 85 0 0 1 185 110"
                        fill="none"
                        stroke="#ffaa0044"
                        strokeWidth="18"
                        strokeLinecap="round"
                    />
                    {/* Active fill up to score */}
                    <path
                        d="M 15 110 A 85 85 0 0 1 185 110"
                        fill="none"
                        stroke={config.color}
                        strokeWidth="18"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 267} 267`}
                        style={{ filter: `drop-shadow(0 0 8px ${config.glow})`, transition: "stroke-dasharray 0.5s ease, stroke 0.4s" }}
                    />
                    {/* Needle */}
                    <g transform={`rotate(${needleAngle}, 100, 110)`} style={{ transition: "transform 0.5s ease" }}>
                        <line x1="100" y1="110" x2="100" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="100" cy="110" r="6" fill={config.color} style={{ filter: `drop-shadow(0 0 6px ${config.glow})` }} />
                    </g>
                    {/* Score text */}
                    <text x="100" y="100" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{score}%</text>
                </svg>

                {/* Status badge */}
                <div className="threat-badge" style={{ color: config.color, boxShadow: `0 0 20px ${config.glow}44`, borderColor: config.color }}>
                    <h2 style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit" }}>
                        {config.label}
                        {attackType && attackType !== "NORMAL" && (
                            <span style={{ fontSize: "60%", opacity: 0.85, marginLeft: "0.5em" }}>| {attackType}</span>
                        )}
                    </h2>
                </div>
            </div>

            {/* Zone labels */}
            <div className="gauge-zones">
                <span className="zone-safe">SAFE</span>
                <span className="zone-warn">WARNING</span>
                <span className="zone-crit">CRITICAL</span>
            </div>
        </div>
    );
}
