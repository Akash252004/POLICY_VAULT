import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const PolicyBarChart = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
          <YAxis tick={{ fill: '#6b7280' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              borderColor: '#e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PolicyPieChart = ({ data }) => {
  // Vibrant gradient colors for better visual appeal
  const COLORS = [
    ['#4338ca', '#6366f1'], // indigo gradient
    ['#0369a1', '#38bdf8'], // sky gradient
    ['#b45309', '#fbbf24'], // amber gradient
    ['#047857', '#34d399'], // emerald gradient
    ['#b91c1c', '#ef4444']  // red gradient
  ];

  // Get a gradient color for each segment
  const getGradientFill = (index) => {
    const id = `policyGradient-${index}`;
    return `url(#${id})`;
  };

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    // Don't render labels for segments less than 10%
    if (percent < 0.1) return null;
    
    // Calculate position for the label
    const radius = outerRadius * 0.65;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        fontWeight="800"
        style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.7)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Create a more engaging and informative legend
  const customLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="mt-6">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {payload.map((entry, index) => {
            // Split by category - for visual representation
            const isLarge = entry.payload.value > 1;
            
            return (
              <li key={`legend-${index}`} className="flex items-center">
                <div 
                  className={`w-5 h-5 rounded-md mr-2 shadow-lg transform transition-all duration-300 hover:scale-110`}
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS[index % COLORS.length][0]}, ${COLORS[index % COLORS.length][1]})`,
                  }}
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800">{entry.value}</span>
                  <span className={`text-xs ml-1 px-1.5 py-0.5 rounded ${isLarge ? 'bg-insurance-100 text-insurance-800' : 'bg-gray-100 text-gray-600'}`}>
                    {entry.payload.value} {entry.payload.value === 1 ? 'policy' : 'policies'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="h-72 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Define gradients for each segment */}
          <defs>
            {data.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`policyGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={COLORS[index % COLORS.length][0]} />
                <stop offset="100%" stopColor={COLORS[index % COLORS.length][1]} />
              </linearGradient>
            ))}
          </defs>
          
          <Pie
            data={data}
            cx="50%"
            cy="43%"
            labelLine={false}
            outerRadius={90}
            innerRadius={40}
            cornerRadius={4}
            paddingAngle={4}
            dataKey="value"
            label={renderCustomizedLabel}
            animationDuration={1500}
            animationBegin={300}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getGradientFill(index)}
                stroke="#ffffff" 
                strokeWidth={3}
                className="hover:opacity-90 transition-opacity duration-300"
              />
            ))}
          </Pie>
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              borderColor: '#e2e8f0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontWeight: 'bold',
              padding: '10px'
            }}
            formatter={(value, name) => [
              <span className="text-gray-900 font-medium">{name}: <span className="text-insurance-600">{value}</span> {value === 1 ? 'policy' : 'policies'}</span>,
              ''
            ]}
            wrapperStyle={{ zIndex: 100 }}
            animationDuration={300}
            animationEasing="ease-out"
          />
          
          <Legend 
            content={customLegend} 
            verticalAlign="bottom" 
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
