/**
 * Doughnut Chart Component
 *
 * Displays data as a doughnut/pie chart with legend.
 *
 * @module components/DoughnutChart
 * @category Components - Charts
 */

import { ChartData } from '@/types/analytics';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DoughnutChartProps {
  data: ChartData;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

const COLORS = [
  'hsl(217, 91%, 60%)',   // blue
  'hsl(142, 76%, 36%)',   // green
  'hsl(48, 96%, 53%)',    // yellow
  'hsl(351, 87%, 54%)',   // red
  'hsl(262, 83%, 58%)',   // purple
  'hsl(188, 84%, 46%)',   // cyan
  'hsl(330, 81%, 60%)',   // pink
  'hsl(25, 95%, 53%)',    // orange
];

export function DoughnutChart({
  data,
  height = 250,
  className = '',
  showLegend = true,
}: DoughnutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const total = data.data.reduce((sum, point) => sum + point.value, 0);

  const size = Math.min(height, 300);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const innerRadius = radius * 0.6;

  // Calculate segment angles
  let currentAngle = -Math.PI / 2; // Start from top
  const segments = data.data.map((point, index) => {
    const percentage = point.value / total;
    const angle = percentage * Math.PI * 2;
    const segment = {
      index,
      label: point.label,
      value: point.value,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: COLORS[index % COLORS.length],
    };
    currentAngle += angle;
    return segment;
  });

  // Generate SVG path for a segment
  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    const x3 = centerX + innerRadius * Math.cos(endAngle);
    const y3 = centerY + innerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(startAngle);
    const y4 = centerY + innerRadius * Math.sin(startAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Segments */}
        {segments.map((segment) => {
          const path = createSegmentPath(segment.startAngle, segment.endAngle);
          const isHovered = hoveredSegment === segment.index;
          const scale = isHovered ? 1.05 : 1;

          return (
            <g key={segment.index}>
              <motion.path
                d={path}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale }}
                transformOrigin={`${centerX} ${centerY}`}
                transition={{ duration: 0.3 }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSegment(segment.index)}
                onMouseLeave={() => setHoveredSegment(null)}
                opacity={hoveredSegment === null || isHovered ? 1 : 0.5}
              />

              {/* Percentage label for hovered segment */}
              {isHovered && (
                <g>
                  <text
                    x={centerX}
                    y={centerY - 5}
                    textAnchor="middle"
                    className="text-sm fill-foreground font-bold"
                  >
                    {(segment.percentage * 100).toFixed(1)}%
                  </text>
                  <text
                    x={centerX}
                    y={centerY + 15}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {segment.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Center text when nothing is hovered */}
        {hoveredSegment === null && (
          <g>
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="text-xl fill-foreground font-bold"
            >
              {total.toLocaleString('tr-TR')}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              Toplam
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          {segments.map((segment) => (
            <div
              key={segment.index}
              className="flex items-center gap-2 text-sm"
              onMouseEnter={() => setHoveredSegment(segment.index)}
              onMouseLeave={() => setHoveredSegment(null)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate">{segment.label}</span>
              <span className="text-muted-foreground ml-auto">
                {(segment.percentage * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { DoughnutChart as default };
