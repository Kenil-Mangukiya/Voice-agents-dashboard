import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Mock data for statistics cards
  const statsData = [
    {
      title: 'Calls Served',
      value: 35,
      change: 12.5,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Redirected Calls',
      value: 7,
      change: 8.2,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Bookings Made',
      value: 9,
      change: 15.7,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Escalated to Emergency',
      value: 7,
      change: 3.4,
      trend: 'down',
      color: 'text-red-600'
    }
  ];

  // Mock data for calls over time chart
  const callsOverTime = [
    { date: 'Oct 4', calls: 2 },
    { date: 'Oct 5', calls: 5 },
    { date: 'Oct 6', calls: 5 },
    { date: 'Oct 7', calls: 3 },
    { date: 'Oct 8', calls: 6 },
    { date: 'Oct 9', calls: 5 },
    { date: 'Oct 10', calls: 5 }
  ];

  // Mock data for routing by niche (donut chart) - matching image proportions
  const routingData = [
    { name: 'Substance Abuse', value: 40, color: '#06B6D4' },
    { name: 'Mental Health', value: 30, color: '#8B5CF6' },
    { name: 'Domestic Violence', value: 20, color: '#EC4899' },
    { name: 'Homelessness', value: 10, color: '#F97316' }
  ];

  // Mock data for outcomes breakdown
  const outcomesData = [
    { name: 'Redirected', value: 7 },
    { name: 'Booked', value: 9 },
    { name: 'Escalated', value: 6 },
    { name: 'Resolved', value: 5 },
    { name: 'Abandoned', value: 7 }
  ];

  // Mock data for top providers
  const topProviders = [
    { name: 'Presbyterian Kaseman Hospital', count: 6, time: '1:03 AM' },
    { name: 'University of NM Psychiatric Center', count: 4, time: '10:09 AM' },
    { name: 'Recovery Services of New Mexico', count: 4, time: '11:04 PM' },
    { name: 'Enlace Comunitario', count: 3, time: '8:44 AM' },
    { name: 'Turquoise Lodge', count: 3, time: '4:01 PM' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Albuquerque Harm Dashboard - Admin Portal</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium text-foreground">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8 bg-background overflow-y-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-border shadow-sm relative overflow-hidden">
                {/* Background Chart */}
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d="M0,15 Q10,5 20,10 T40,8 T60,12 T80,6 T100,10 L100,20 L0,20 Z"
                      fill="currentColor"
                      className="text-primary"
                    />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    {stat.trend === 'up' ? (
                      <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${stat.color}`}>
                      {stat.trend === 'up' ? '↑' : '↓'} {stat.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Calls Over Time */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-foreground mb-6">Calls Over Time</h3>
            <div className="h-80 relative">
                 <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                   {/* Grid lines */}
                   {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                     <line
                       key={y}
                       x1="40"
                       y1={20 + y * 20}
                       x2="380"
                       y2={20 + y * 20}
                       stroke="#E5E7EB"
                       strokeWidth="1"
                     />
                   ))}
                   
                   {/* Area chart */}
                   <defs>
                     <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                       <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
                     </linearGradient>
                   </defs>
                   
                   <path
                     d={`M 40,${180 - callsOverTime[0].calls * 20} ${callsOverTime.map((point, index) => 
                       `L ${60 + index * 50},${180 - point.calls * 20}`
                     ).join(' ')} L ${60 + (callsOverTime.length - 1) * 50},180 L 40,180 Z`}
                     fill="url(#areaGradient)"
                   />
                   
                   <path
                     d={`M 40,${180 - callsOverTime[0].calls * 20} ${callsOverTime.map((point, index) => 
                       `L ${60 + index * 50},${180 - point.calls * 20}`
                     ).join(' ')}`}
                     fill="none"
                     stroke="#06B6D4"
                     strokeWidth="2"
                   />
                   
                  {/* Invisible hover areas for each data point */}
                  {callsOverTime.map((point, index) => (
                    <rect
                      key={`hover-${index}`}
                      x={60 + index * 50 - 25}
                      y="20"
                      width="50"
                      height="160"
                      fill="transparent"
                      onMouseEnter={() => {
                        setHoveredPoint({ ...point, index, x: 60 + index * 50, y: 180 - point.calls * 20 });
                        setHoveredSegment(null); // Clear other hover states
                        setHoveredBar(null);
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    />
                  ))}
                   
                   {/* Data points */}
                   {callsOverTime.map((point, index) => (
                     <circle
                       key={index}
                       cx={60 + index * 50}
                       cy={180 - point.calls * 20}
                       r="3"
                       fill="#06B6D4"
                     />
                   ))}
                   
                   {/* X-axis labels */}
                   {callsOverTime.map((point, index) => (
                     <text
                       key={index}
                       x={60 + index * 50}
                       y="195"
                       textAnchor="middle"
                       className="text-xs fill-gray-500"
                     >
                       {point.date}
                     </text>
                   ))}
                   
                   {/* Y-axis labels */}
                   {[0, 2, 4, 6, 8].map((value) => (
                     <text
                       key={value}
                       x="35"
                       y={185 - value * 20}
                       textAnchor="end"
                       className="text-xs fill-gray-500"
                     >
                       {value}
                     </text>
                   ))}
                 </svg>
                 
              {/* Tooltip for area chart */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-10"
                  style={{
                    left: `${(hoveredPoint.x / 400) * 100}%`,
                    top: `${(hoveredPoint.y / 200) * 100}%`,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-10px'
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{hoveredPoint.date}</div>
                  <div className="text-sm text-cyan-600">value : {hoveredPoint.calls}</div>
                </div>
              )}
            </div>
          </div>

          {/* Routing by Niche */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-foreground mb-6">Routing by Niche</h3>
            <div className="flex items-center justify-center h-80">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {routingData.map((segment, index) => {
                      const total = routingData.reduce((sum, item) => sum + item.value, 0);
                      const percentage = (segment.value / total) * 100;
                      const startAngle = routingData.slice(0, index).reduce((sum, item) => sum + (item.value / total) * 360, 0);
                      const endAngle = startAngle + (percentage * 3.6);
                      
                      const startAngleRad = (startAngle * Math.PI) / 180;
                      const endAngleRad = (endAngle * Math.PI) / 180;
                      
                      const x1 = 50 + 35 * Math.cos(startAngleRad);
                      const y1 = 50 + 35 * Math.sin(startAngleRad);
                      const x2 = 50 + 35 * Math.cos(endAngleRad);
                      const y2 = 50 + 35 * Math.sin(endAngleRad);
                      
                      const largeArcFlag = percentage > 50 ? 1 : 0;
                      
                      const pathData = [
                        `M 50,50`,
                        `L ${x1},${y1}`,
                        `A 35,35 0 ${largeArcFlag},1 ${x2},${y2}`,
                        'Z'
                      ].join(' ');
                      
                      return (
                        <path
                          key={index}
                          d={pathData}
                          fill={segment.color}
                          stroke="white"
                          strokeWidth="2"
                          onMouseEnter={() => {
                            setHoveredSegment({ ...segment, index });
                            setHoveredPoint(null); // Clear other hover states
                            setHoveredBar(null);
                          }}
                          onMouseLeave={() => setHoveredSegment(null)}
                          className="cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {routingData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
              
            {/* Tooltip for donut chart */}
            {hoveredSegment && (
              <div 
                className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-10"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="text-sm font-medium text-gray-900">{hoveredSegment.name}</div>
                <div className="text-sm text-cyan-600">value : {hoveredSegment.value}</div>
              </div>
            )}
          </div>
          </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Outcomes Breakdown */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-foreground mb-6">Outcomes Breakdown</h3>
            <div className="h-80 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  {[0, 3, 6, 9, 12].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={180 - y * 15}
                      x2="380"
                      y2={180 - y * 15}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Bars with hover areas */}
                  {outcomesData.map((outcome, index) => (
                    <g key={index}>
                      {/* Invisible hover area */}
                      <rect
                        x={60 + index * 60}
                        y="20"
                        width="40"
                        height="160"
                        fill="transparent"
                        onMouseEnter={() => {
                          setHoveredBar({ ...outcome, index, x: 80 + index * 60, y: 180 - outcome.value * 15 });
                          setHoveredPoint(null); // Clear other hover states
                          setHoveredSegment(null);
                        }}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="cursor-pointer"
                      />
                      
                      {/* Actual bar */}
                      <rect
                        x={60 + index * 60}
                        y={180 - outcome.value * 15}
                        width="40"
                        height={outcome.value * 15}
                        fill="#06B6D4"
                        rx="2"
                      />
                      
                      {/* Bar labels */}
                      <text
                        x={80 + index * 60}
                        y="195"
                        textAnchor="middle"
                        className="text-xs fill-gray-500"
                      >
                        {outcome.name}
                      </text>
                    </g>
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 3, 6, 9, 12].map((value) => (
                    <text
                      key={value}
                      x="35"
                      y={185 - value * 15}
                      textAnchor="end"
                      className="text-xs fill-gray-500"
                    >
                      {value}
                    </text>
                  ))}
                </svg>
                
              {/* Tooltip for bar chart */}
              {hoveredBar && (
                <div 
                  className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-10"
                  style={{
                    left: `${(hoveredBar.x / 400) * 100}%`,
                    top: `${(hoveredBar.y / 200) * 100}%`,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-10px'
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{hoveredBar.name}</div>
                  <div className="text-sm text-cyan-600">value : {hoveredBar.value}</div>
                </div>
              )}
            </div>
          </div>

          {/* Top Providers */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-foreground mb-6">Top Providers</h3>
            <div className="space-y-6">
                {topProviders.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{provider.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(provider.count / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-foreground">{provider.count}</p>
                      <p className="text-xs text-muted-foreground">{provider.time}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
