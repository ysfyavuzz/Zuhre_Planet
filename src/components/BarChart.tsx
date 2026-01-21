/**
 * Bar Chart Component
 *
 * Displays data as vertical bars with values.
 *
 * @module components/BarChart
 * @category Components - Charts
 */

import { ChartData } from '@/types/analytics';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: ChartData;
  height?: number;
  className?: string;
  showValues?: boolean;
  horizontal?: boolean;
}

export function BarChart({
  data,
  height = 250,
  className = '',
  showValues = true,
  horizontal = false,
}: BarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxValue = Math.max(...data.data.map(d => d.value));
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = 800;
  const chartHeight = height - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;
  const barWidth = (innerWidth / data.data.length) * 0.6;
  const gap = (innerWidth / data.data.length) * 0.4;

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
          const value = maxValue - (maxValue * percent) / 100;
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
                {Math.round(value).toLocaleString('tr-TR')}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.data.map((point, index) => {
          const barHeight = (point.value / maxValue) * chartHeight;
          const x = padding.left + index * (barWidth + gap) + gap / 2;
          const y = padding.top + chartHeight - barHeight;
          const isHovered = hoveredBar === index;

          return (
            <g key={index}>
              {/* Bar */}
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="hsl(var(--primary))"
                rx="4"
                initial={{ height: 0, y: padding.top + chartHeight }}
                animate={{
                  height: barHeight,
                  y,
                  opacity: hoveredBar === null || isHovered ? 1 : 0.5,
                }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              />

              {/* Value label on hover */}
              {showValues && (hoveredBar === null || isHovered) && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-xs fill-foreground font-bold"
                >
                  {point.value.toLocaleString('tr-TR')}
                </text>
              )}

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className={`text-xs fill-muted-foreground ${isHovered ? 'fill-foreground font-bold' : ''}`}
              >
                {point.label.length > 10 ? point.label.substring(0, 10) + '...' : point.label}
              </text>
            </g>
          );
        })}

        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={chartWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          strokeWidth="2"
          className="fill-muted-foreground"
        />
      </svg>
    </div>
  );
}

export { BarChart as default };
