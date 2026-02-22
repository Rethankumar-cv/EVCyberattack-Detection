import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const val = payload[0].value;
        return (
            <div className="chart-tooltip">
                <p>Score: {val.toFixed(1)}%</p>
            </div>
        );
    }
    return null;
};

const dotColor = (score) => {
    if (score >= 70) return "#ff2244";
    if (score >= 40) return "#ffaa00";
    return "#00ff88";
};

export default function ScoreChart({ history }) {
    const data = history.map((h, i) => ({
        tick: i + 1,
        score: Math.round((h.threat_score ?? 0) * 100),
        level: h.threat_level,
    }));

    return (
        <div className="score-chart">
            <h2 className="panel-title">📈 THREAT SCORE HISTORY</h2>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#1e2a3a" strokeDasharray="4 4" />
                    <XAxis dataKey="tick" tick={{ fill: "#445566", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#445566", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={70} stroke="#ff224455" strokeDasharray="3 3" label={{ value: "CRIT", fill: "#ff2244", fontSize: 10 }} />
                    <ReferenceLine y={40} stroke="#ffaa0055" strokeDasharray="3 3" label={{ value: "WARN", fill: "#ffaa00", fontSize: 10 }} />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#00aaff"
                        strokeWidth={2}
                        dot={(props) => {
                            const { cx, cy, payload } = props;
                            return (
                                <circle
                                    key={cx + cy}
                                    cx={cx}
                                    cy={cy}
                                    r={4}
                                    fill={dotColor(payload.score)}
                                    stroke="none"
                                    style={{ filter: `drop-shadow(0 0 4px ${dotColor(payload.score)})` }}
                                />
                            );
                        }}
                        activeDot={{ r: 6, fill: "#00aaff" }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
