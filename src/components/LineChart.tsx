/**
 * Line Chart Component
 *
 * Displays data as a line chart with area fill.
 *
 * @module components/LineChart
 * @category Components - Charts
 */

import { ChartData } from '@/types/analytics';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: ChartData;
  height?: number;
  className?: string;
  showTooltip?: boolean;
}

export function LineChart({
  data,
  height = 250,
  className = '',
  showTooltip = true,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const maxValue = Math.max(...data.data.map(d => d.value));
  const minValue = Math.min(...data.data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800;
  const chartHeight = height - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;

  // Generate points for the line
  const points = data.data.map((point, index) => {
    const x = padding.left + (index / (data.data.length - 1)) * innerWidth;
    const y = padding.top + chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, value: point.value, label: point.label, index };
  });

  // Generate path for the line
  const linePath = points
    .map((point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
    .join(' ');

  // Generate area fill path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className={`w-full ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = padding.top + (chartHeight * percent) / 100;
          const value = maxValue - (range * percent) / 100;
          return (
            <g key={percent}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/20"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-muted-foreground"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#gradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.5 }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Data points */}
        {points.map((point) => (
          <g key={point.index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === point.index ? 6 : 4}
              fill="hsl(var(--primary))"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(point.index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />

            {/* X-axis labels */}
            <text
              x={point.x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* Tooltip */}
        {showTooltip && hoveredPoint !== null && (
          <g>
            <rect
              x={points[hoveredPoint].x - 40}
              y={points[hoveredPoint].y - 35}
              width={80}
              height={25}
              rx="4"
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            <text
              x={points[hoveredPoint].x}
              y={points[hoveredPoint].y - 18}
              textAnchor="middle"
              className="text-xs fill-foreground font-bold"
            >
              {points[hoveredPoint].value.toLocaleString('tr-TR')}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export { LineChart as default };
