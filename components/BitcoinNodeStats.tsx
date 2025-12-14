import { useState, useEffect } from "react";

type BitrefStats = {
  updatedAt: string;
  bitcoinCore: { total: number; percentage: string };
  coreV30: { total: number; percentage: string };
  bitcoinKnots: { total: number; percentage: string };
  torNetwork: { total: number; percentage: string };
  totalPublic: { total: number };
};

export default function BitcoinNodeStats() {
  const [stats, setStats] = useState<BitrefStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const res = await fetch("/data/bitref-stats.json");
        if (!res.ok) throw new Error(`Failed to load stats: ${res.status}`);
        const payload = (await res.json()) as BitrefStats;
        if (cancelled) return;
        setStats(payload);
        setError(null);
      } catch (err) {
        console.error("Unable to load node statistics", err);
        setError("Unable to load node statistics. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate pie chart segments
  // Only Core (including Core V.30) vs Knots, without Tor
  function calculatePieChart(stats: BitrefStats) {
    // Core total includes all Core nodes (Core V.30 is already included in bitcoinCore.total)
    const coreTotal = stats.bitcoinCore.total;
    const knots = stats.bitcoinKnots.total;
    const chartTotal = coreTotal + knots; // Only Core vs Knots comparison

    const segments = [
      { label: "Bitcoin Core", value: coreTotal, color: "#ffaa00" }, // Lighter orange
      { label: "Bitcoin Knots", value: knots, color: "#ff8800" }, // Orange
    ].filter((s) => s.value > 0);

    let currentAngle = -90; // Start at top
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return segments.map((segment) => {
      const percentage = (segment.value / chartTotal) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate path for pie slice
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      const largeArcFlag = angle > 180 ? 1 : 0;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      const labelAngle = startAngle + angle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
      const labelY = centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);

      currentAngle = endAngle;

      return {
        ...segment,
        pathData,
        labelX,
        labelY,
        percentage: percentage.toFixed(1),
      };
    });
  }

  if (loading) {
    return (
      <div className="mp-bitref-stats">
        <p className="mp-body">Loading node statistics…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mp-bitref-stats">
        <p className="mp-body" style={{ color: "#d00" }}>
          {error || "No statistics available."}
        </p>
      </div>
    );
  }

  const formattedDate = stats.updatedAt
    ? new Date(stats.updatedAt).toLocaleString()
    : null;

  const pieSegments = calculatePieChart(stats);

  return (
    <div className="mp-bitref-stats">
      {formattedDate && (
        <p className="mp-bitref-stats-meta">
          Last updated: {formattedDate}
        </p>
      )}

      {/* Pie Chart */}
      <div className="mp-bitref-chart-container">
        <svg
          viewBox="0 0 200 200"
          className="mp-bitref-pie-chart"
          aria-label="Bitcoin Node Distribution"
        >
          {pieSegments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="2"
              />
              {parseFloat(segment.percentage) > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#222"
                  fontWeight="bold"
                >
                  {segment.percentage}%
                </text>
              )}
            </g>
          ))}
        </svg>
        <div className="mp-bitref-chart-legend">
          {pieSegments.map((segment, index) => (
            <div key={index} className="mp-bitref-legend-item">
              <span
                className="mp-bitref-legend-color"
                style={{ backgroundColor: segment.color }}
              />
              <span className="mp-bitref-legend-label">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics List */}
      <div className="mp-bitref-stats-list">
        {/* Bitcoin Core */}
        <div className="mp-bitref-stat-item">
          <span className="mp-bitref-stat-label">Bitcoin Core</span>
          <span className="mp-bitref-stat-value">
            <span className="mp-bitref-number-orange">
              {stats.bitcoinCore.total.toLocaleString()}
            </span>
          </span>
        </div>

        {/* Core V.30 (indented) */}
        <div className="mp-bitref-stat-item mp-bitref-indented">
          <span className="mp-bitref-stat-label">Core v.30</span>
          <span className="mp-bitref-stat-value">
            <span className="mp-bitref-percentage">
              ({stats.coreV30.percentage}%)
            </span>
            <span className="mp-bitref-number-red">
              {" "}{stats.coreV30.total.toLocaleString()}
            </span>
          </span>
        </div>

        {/* Bitcoin Knots */}
        <div className="mp-bitref-stat-item">
          <span className="mp-bitref-stat-label">Bitcoin Knots</span>
          <span className="mp-bitref-stat-value">
            <span className="mp-bitref-number-orange">
              {stats.bitcoinKnots.total.toLocaleString()}
            </span>
            <span className="mp-bitref-percentage">
              {" "}({stats.bitcoinKnots.percentage}%)
            </span>
          </span>
        </div>

        {/* Tor Network */}
        <div className="mp-bitref-stat-item">
          <span className="mp-bitref-stat-label">Tor Network</span>
          <span className="mp-bitref-stat-value">
            <span className="mp-bitref-number-orange">
              {stats.torNetwork.total.toLocaleString()}
            </span>
          </span>
        </div>

        {/* Total Public */}
        <div className="mp-bitref-stat-item mp-bitref-stat-total">
          <span className="mp-bitref-stat-label">Total Public (clear-net)</span>
          <span className="mp-bitref-stat-value">
            <span className="mp-bitref-number-orange">
              {stats.totalPublic.total.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Source Attribution */}
      <p className="mp-bitref-stats-source">
        (Data source:{" "}
        <a
          href="https://bitref.com/nodes/"
          target="_blank"
          rel="noopener noreferrer"
          className="mp-link"
        >
          bitref.com/nodes/
        </a>
        )
      </p>
    </div>
  );
}
