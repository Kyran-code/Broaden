"use client";

interface RadarDomain {
  name: string;
  score: number;
  color: string;
}

interface RadarChartProps {
  domains: RadarDomain[];
}

const CX = 160;
const CY = 160;
const R = 110; // max radius
const LEVELS = 4; // concentric rings

function polarToCartesian(angle: number, radius: number) {
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

export default function RadarChart({ domains }: RadarChartProps) {
  if (domains.length < 3) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-[#444] text-xs font-sans">Log at least 3 entries across different domains to see your radar chart.</p>
      </div>
    );
  }

  const n = domains.length;
  // Start from top (-π/2), go clockwise
  const angles = domains.map((_, i) => (2 * Math.PI * i) / n - Math.PI / 2);
  const maxScore = Math.max(...domains.map((d) => d.score), 1);

  // Build concentric ring polygons
  const ringPolygons = Array.from({ length: LEVELS }, (_, level) => {
    const r = (R * (level + 1)) / LEVELS;
    const points = angles.map((a) => {
      const p = polarToCartesian(a, r);
      return `${p.x},${p.y}`;
    });
    return points.join(" ");
  });

  // Data polygon
  const dataPoints = domains.map((d, i) => {
    const r = (d.score / maxScore) * R;
    return polarToCartesian(angles[i], r);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions — push out slightly beyond the ring
  const labelPositions = domains.map((d, i) => {
    const p = polarToCartesian(angles[i], R + 22);
    // Shorten domain names to fit
    const label = d.name.length > 18 ? d.name.split(" ")[0] : d.name;
    return { ...p, label, color: d.color };
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 320 320"
        className="w-full max-w-xs"
        style={{ overflow: "visible" }}
      >
        {/* Concentric ring grid */}
        {ringPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#1e1e1e"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines from center to each vertex */}
        {angles.map((angle, i) => {
          const tip = polarToCartesian(angle, R);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={tip.x}
              y2={tip.y}
              stroke="#1e1e1e"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon fill */}
        <polygon
          points={dataPolygon}
          fill="#c8a96e"
          fillOpacity="0.12"
          stroke="#c8a96e"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={domains[i].color}
            fillOpacity="0.9"
          />
        ))}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r="2" fill="#333" />

        {/* Labels */}
        {labelPositions.map((lp, i) => {
          // Align text based on position around the circle
          const angle = angles[i];
          let anchor: "middle" | "start" | "end" = "middle";
          if (Math.cos(angle) > 0.3) anchor = "start";
          else if (Math.cos(angle) < -0.3) anchor = "end";

          return (
            <text
              key={i}
              x={lp.x}
              y={lp.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="9"
              fontFamily="system-ui, sans-serif"
              fill="#888"
            >
              {lp.label}
            </text>
          );
        })}

        {/* Ring level labels (%) */}
        {Array.from({ length: LEVELS }, (_, i) => {
          const r = (R * (i + 1)) / LEVELS;
          const pct = Math.round(((i + 1) / LEVELS) * 100);
          return (
            <text
              key={i}
              x={CX + 3}
              y={CY - r + 3}
              fontSize="7"
              fontFamily="system-ui, sans-serif"
              fill="#333"
            >
              {pct}%
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 w-full max-w-xs">
        {domains.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[#666] font-sans truncate" style={{ fontSize: "10px" }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
