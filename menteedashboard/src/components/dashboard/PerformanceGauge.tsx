import React from 'react';

interface PerformanceGaugeProps {
  value: number;
}

const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({ value }) => {
  // Calculate the rotation angle based on the value (0-10000)
  const angle = (value / 10000) * 180;
  
  return (
    <div className="relative w-48 h-48">
      {/* Gauge Background */}
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#4ECCA7', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#4ECCA7', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Background Arc */}
        <path
          d="M 40 160 A 80 80 0 0 1 160 160"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
          strokeLinecap="round"
        />
        
        {/* Value Arc */}
        <path
          d={`M 40 160 A 80 80 0 0 1 ${40 + Math.sin(angle * Math.PI / 180) * 120} ${160 - Math.cos(angle * Math.PI / 180) * 120}`}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        
        {/* Pointer */}
        <circle
          cx={40 + Math.sin(angle * Math.PI / 180) * 120}
          cy={160 - Math.cos(angle * Math.PI / 180) * 120}
          r="6"
          fill="#4ECCA7"
        />
      </svg>
      
      {/* Value Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-semibold text-dark">{value.toLocaleString()}</div>
        <div className="text-gray-500 text-sm">Your Point</div>
      </div>
    </div>
  );
};

export default PerformanceGauge;