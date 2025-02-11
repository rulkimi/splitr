import { useMemo } from 'react';

interface RadialProgressBarProps {
  size?: number;
  color?: string;
  radius?: number; 
  progress?: number;
}

const RadialProgressBar = ({
  size = 60,
  color = 'text-primary',
  radius = 40,
  progress = 0
}: RadialProgressBarProps) => {
  const strokeWidth = 10;

  const clampedProgress = useMemo(() => 
    Math.min(100, Math.max(0, progress)),
    [progress]
  );

  const circumference = useMemo(() => 
    Number((2 * Math.PI * radius).toFixed(1)),
    [radius]
  );

  const strokeDashOffset = useMemo(() => 
    circumference - (circumference * clampedProgress) / 100,
    [circumference, clampedProgress]
  );

  const viewBoxSize = useMemo(() => 
    radius * 2 + strokeWidth * 2,
    [radius]
  );

  return (
    <div style={{ width: `${size}px`, height: `${size}px` }}>
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <circle
          className="text-gray-200 stroke-current"
          strokeWidth={strokeWidth}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="transparent"
        />
        <circle
          className={`progress-ring__circle stroke-current ${color}`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashOffset}
          style={{
            transition: 'stroke-dashoffset 0.35s',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
        <text
          x={viewBoxSize / 2}
          y={viewBoxSize / 2 - 8}
          fontSize={16}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          {clampedProgress}%
        </text>
        <text
          x={viewBoxSize / 2}
          y={viewBoxSize / 2 + 8}
          fontSize={16}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="gray"
        >
          Paid
        </text>
      </svg>
    </div>
  );
};

export default RadialProgressBar;
