"use client";

import type { ChartPoint } from "@/lib/types";

interface Props {
  data: ChartPoint[];
  isUp: boolean;
}

export function PriceChart({ data, isUp }: Props) {
  if (data.length < 2) {
    return (
      <div className="h-28 flex items-center justify-center text-gray-400 text-xs font-mono">
        No chart data
      </div>
    );
  }

  const closes = data.map((d) => d.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  const width = 300;
  const height = 100;
  const padding = 4;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.close - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  // Gradient fill area under the line
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  const strokeColor = isUp ? "#16a34a" : "#dc2626";
  const fillColor = isUp ? "#16a34a" : "#dc2626";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-28"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${isUp ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill={`url(#grad-${isUp ? "up" : "down"})`}
        />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Dot on most recent price */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={strokeColor}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-0.5 px-1">
        <span>{data[0].date.slice(5)}</span>
        <span>{data[data.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}
