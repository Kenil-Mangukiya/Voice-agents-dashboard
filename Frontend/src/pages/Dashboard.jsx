import React, { useState, useEffect } from 'react';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:3000/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hoveredSentiment, setHoveredSentiment] = useState(null);
  const [timeFilter, setTimeFilter] = useState('7'); // 7 days, 30 days, 1 year
  const [callsData, setCallsData] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [expandedProviders, setExpandedProviders] = useState({});
  const [allProvidersWithPhones, setAllProvidersWithPhones] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [routingData, setRoutingData] = useState([]);
  const [callsOverTime, setCallsOverTime] = useState([]);

  // Helper function to get short provider name
  const getShortProviderName = (providerName, callData = null) => {
    if (!providerName) return 'Unknown';
    
    // Check for emergency escalation indicators
    if (callData) {
      const transcript = callData.transcript || '';
      
      // Very specific emergency detection - user says emergency AND agent says call 911
      const lines = transcript.split('\n');
      let userSaidEmergency = false;
      let agentSaidCall911 = false;
      
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('user:') && lowerLine.includes('emergency')) {
          userSaidEmergency = true;
        }
        if (lowerLine.includes('agent:') && (lowerLine.includes('call 9-1-1') || lowerLine.includes('call 911'))) {
          agentSaidCall911 = true;
        }
      }
      
      if (userSaidEmergency && agentSaidCall911) {
        return 'Escalated to Emergency';
      }
    }
    
    const lowerName = providerName.toLowerCase();
    
    if (lowerName.includes('mental') || lowerName.includes('psychiatric')) {
      return 'Mental';
    } else if (lowerName.includes('domestic') || lowerName.includes('violence') || lowerName.includes('abuse')) {
      return 'Domestic Violence';
    } else if (lowerName.includes('substance') || lowerName.includes('alcohol') || lowerName.includes('addiction')) {
      return 'Substance';
    } else if (lowerName.includes('homeless') || lowerName.includes('housing') || lowerName.includes('shelter') || lowerName.includes('rescue') || lowerName.includes('mission')) {
      return 'Homelessness';
    } else if (lowerName.includes('elder') || lowerName.includes('senior')) {
      return 'Elder Care';
    } else if (lowerName.includes('youth') || lowerName.includes('teen') || lowerName.includes('child')) {
      return 'Youth';
    } else if (lowerName.includes('gambling') || lowerName.includes('financial')) {
      return 'Gambling';
    } else if (lowerName.includes('escalated') || lowerName.includes('emergency')) {
      return 'Escalated to Emergency';
    }
    
    return providerName.length > 20 ? providerName.substring(0, 20) + '...' : providerName;
  };

  // Format phone nicely
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    const d = String(phone).replace(/\D/g, '');
    if (d.length === 11 && d.startsWith('1')) return `(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    return phone;
  };

  // Fetch calls data from backend
  const fetchCallsData = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '1000', // Get all calls for analysis
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      const response = await fetch(`${API_BASE_URL}/calls?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCallsData(data.data.calls || []);
        processCallsData(data.data.calls || []);
      } else {
        throw new Error(data.message || 'Failed to fetch calls');
      }
    } catch (err) {
      console.error('Error fetching calls:', err);
      setCallsData([]);
    }
  };

  // Process calls data to generate statistics and charts
  const processCallsData = (calls) => {
    const currentDate = new Date();
    let filteredCalls = calls;

    // Filter by time range
    if (timeFilter === '7') {
      const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredCalls = calls.filter(call => new Date(call.createdAt) >= sevenDaysAgo);
    } else if (timeFilter === '30') {
      const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredCalls = calls.filter(call => new Date(call.createdAt) >= thirtyDaysAgo);
    } else if (timeFilter === '365') {
      const oneYearAgo = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredCalls = calls.filter(call => new Date(call.createdAt) >= oneYearAgo);
    }

    // Calculate statistics
    const totalCalls = filteredCalls.length;
    const redirectedCalls = filteredCalls.filter(call => 
      call.phone_number && call.phone_number.trim() !== ''
    ).length;
    const bookingMadeCalls = filteredCalls.filter(call => 
      getShortProviderName(call.provider_name, call).toLowerCase().includes('homeless')
    ).length;
    const escalatedCalls = filteredCalls.filter(call => 
      getShortProviderName(call.provider_name, call).toLowerCase().includes('escalated') || 
      getShortProviderName(call.provider_name, call).toLowerCase().includes('emergency')
    ).length;

    setStatsData([
    {
      title: 'Calls Served',
        value: totalCalls,
      color: 'text-green-600'
    },
    {
      title: 'Redirected Calls',
        value: redirectedCalls,
      color: 'text-green-600'
    },
    {
      title: 'Bookings Made',
        value: bookingMadeCalls,
      color: 'text-green-600'
    },
    {
      title: 'Escalated to Emergency',
        value: escalatedCalls,
      color: 'text-red-600'
    }
    ]);

    // Process routing by niche data
    const nicheCounts = {};
    filteredCalls.forEach(call => {
      const niche = getShortProviderName(call.provider_name, call);
      nicheCounts[niche] = (nicheCounts[niche] || 0) + 1;
    });

  const routingData = [
      { name: 'Substance Abuse', value: nicheCounts['Substance'] || 0, color: '#06B6D4' },
      { name: 'Mental Health', value: nicheCounts['Mental'] || 0, color: '#8B5CF6' },
      { name: 'Domestic Violence', value: nicheCounts['Domestic Violence'] || 0, color: '#EC4899' },
      { name: 'Homelessness', value: nicheCounts['Homelessness'] || 0, color: '#F97316' },
      { name: 'Youth Crisis', value: nicheCounts['Youth'] || 0, color: '#10B981' },
      { name: 'Elder Care', value: nicheCounts['Elder Care'] || 0, color: '#6366F1' },
      { name: 'Gambling', value: nicheCounts['Gambling'] || 0, color: '#EF4444' },
      { name: 'Escalated to Emergency', value: nicheCounts['Escalated to Emergency'] || 0, color: '#DC2626' }
    ].filter(item => item.value > 0);

    setRoutingData(routingData);

    // Process calls over time data
    const timeData = {};
    filteredCalls.forEach(call => {
      const date = new Date(call.createdAt);
      let key;
      
      if (timeFilter === '7') {
        // Group by day for 7 days
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeFilter === '30') {
        // Group by week for 30 days
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeFilter === '365') {
        // Group by month for 1 year
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      
      timeData[key] = (timeData[key] || 0) + 1;
    });

    // Fill in missing dates for better visualization
    const callsOverTimeData = [];
    const chartDate = new Date();
    
    if (timeFilter === '7') {
      // Fill last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(chartDate);
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        callsOverTimeData.push({ date: key, calls: timeData[key] || 0 });
      }
    } else if (timeFilter === '30') {
      // Fill last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date(chartDate);
        date.setDate(date.getDate() - (i * 7));
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        callsOverTimeData.push({ date: key, calls: timeData[key] || 0 });
      }
    } else if (timeFilter === '365') {
      // Fill last 6 months to avoid overcrowding
      for (let i = 5; i >= 0; i--) {
        const date = new Date(chartDate);
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        callsOverTimeData.push({ date: key, calls: timeData[key] || 0 });
      }
    }

    setCallsOverTime(callsOverTimeData);

    // Compute top 8 providers and phone breakdown (redirected only)
    const providerAgg = {};
    filteredCalls
      .filter(call => call.phone_number && call.phone_number.trim() !== '')
      .forEach(call => {
        const provider = getShortProviderName(call.provider_name, call) || 'Unknown';
        if (!providerAgg[provider]) providerAgg[provider] = { total: 0, phones: {} };
        providerAgg[provider].total += 1;
        const phone = call.phone_number.trim();
        providerAgg[provider].phones[phone] = (providerAgg[provider].phones[phone] || 0) + 1;
      });

    const top = Object.entries(providerAgg)
      .map(([name, data]) => ({
        name,
        total: data.total,
        phones: Object.entries(data.phones)
          .map(([phone, count]) => ({ phone, count }))
          .sort((a, b) => b.count - a.count)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    setTopProviders(top);

    // Baseline provider phone numbers (match Provider.jsx short names)
    const providerPhoneNumbers = {
      'Mental Health': ['+18556009276', '+18563630633', '+18887247240', '+18777244747', '+17149916412', '+19163683111', '+18552784204', '+14157810500', '+16282068125', '+16282177000'],
      'Substance Use / Addiction': ['+18448047500', '+18662101303', '+18009682636', '+14158341144'],
      'Domestic Violence': ['+18007997233', '+18006564673', '+18663319474', '+18779435778', '+17149572737', '+19498319110', '+14156477273'],
      'Youth Crisis / LGBTQ+ Identity': ['+18008435200', '+18004483000', '+18008528336', '+18007862929', '+14082793000', '+14088506125'],
      'Elder Concern': ['+18884363600', '+18004515155', '+18004917123', '+18774773646', '+18005102020', '+18886701360'],
      'Homelessness': ['+18005486047', '+14083852400', '+18005694287', '+18009552232', '+18778473663'],
      'Gambling': ['+18004262537']
    };

    // Build full list including zero-call phones
    const allProviders = Object.entries(providerPhoneNumbers).map(([name, phones]) => {
      const agg = providerAgg[name] || { total: 0, phones: {} };
      const phoneRows = phones.map(p => ({ phone: p, count: agg.phones[p] || 0 }));
      const total = phoneRows.reduce((s, x) => s + x.count, 0);
      return { name, total, phones: phoneRows };
    }).sort((a, b) => b.total - a.total);

    setAllProvidersWithPhones(allProviders);
  };

  // Fetch providers data for routing by niche
  const fetchProvidersData = async () => {
    try {
      // This would typically come from a providers API endpoint
      // For now, we'll use the data from the Provider.jsx file structure
      const providers = {
        'mental-health': [
          { name: 'Albuquerque Crisis Center', count: 6, time: '1:03 AM' },
    { name: 'University of NM Psychiatric Center', count: 4, time: '10:09 AM' },
          { name: 'PB&J Family Services', count: 3, time: '2:15 PM' }
        ],
        'domestic-violence': [
          { name: 'Domestic Violence Resource Center', count: 5, time: '8:44 AM' },
          { name: 'Safe House New Mexico', count: 3, time: '4:01 PM' },
          { name: 'Family Advocacy Center', count: 2, time: '11:30 AM' }
        ],
        'substance-abuse': [
          { name: 'Albuquerque Treatment Services', count: 8, time: '3:22 PM' },
          { name: 'New Mexico Recovery Center', count: 6, time: '9:15 AM' },
    { name: 'Recovery Services of New Mexico', count: 4, time: '11:04 PM' },
          { name: 'Serenity House', count: 3, time: '7:45 PM' }
        ],
        'homelessness': [
          { name: 'Albuquerque Rescue Mission', count: 7, time: '6:30 AM' },
          { name: 'Joy Junction', count: 5, time: '12:20 PM' },
          { name: 'Good Shepherd Center', count: 4, time: '2:45 PM' },
          { name: 'St. Martin\'s Hospitality Center', count: 3, time: '5:10 PM' },
          { name: 'Albuquerque Health Care for the Homeless', count: 2, time: '8:15 AM' }
        ],
        'youth-crisis': [
          { name: 'Youth Crisis Center of Albuquerque', count: 6, time: '1:30 PM' },
          { name: 'New Mexico Youth Crisis Line', count: 4, time: '10:45 PM' },
          { name: 'Youth Development Inc.', count: 3, time: '4:20 PM' },
          { name: 'Teen Crisis Center', count: 2, time: '7:15 AM' }
        ],
        'elder-concern': [
          { name: 'Albuquerque Senior Services', count: 5, time: '9:30 AM' },
          { name: 'Elder Abuse Prevention Center', count: 3, time: '2:15 PM' },
          { name: 'Senior Care Network', count: 2, time: '11:45 AM' }
        ],
        'gambling': [
          { name: 'New Mexico Gambling Addiction Center', count: 4, time: '3:45 PM' },
          { name: 'Gamblers Anonymous New Mexico', count: 2, time: '8:30 PM' }
        ],
        'escalated-emergency': [
          { name: 'Emergency Services (911)', count: 7, time: 'Various' }
        ]
      };
      
      setProvidersData(providers);
    } catch (err) {
      console.error('Error fetching providers data:', err);
      setProvidersData({});
    }
  };


  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCallsData(),
          fetchProvidersData()
        ]);
      } catch (error) {
        console.error('Error initializing dashboard data:', error);
      } finally {
      setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Re-process data when time filter changes
  useEffect(() => {
    if (callsData.length > 0) {
      processCallsData(callsData);
    }
  }, [timeFilter]);

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
    <div className="flex-1 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 md:px-8 py-4 md:py-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Albuquerque Harm Dashboard - Admin Portal</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="7">Last 7 Days (Daily)</option>
                <option value="30">Last 30 Days (Weekly)</option>
                <option value="365">Last 6 Months (Monthly)</option>
              </select>
          </div>
          <div className="text-right text-xs md:text-sm">
            <p className="text-muted-foreground">Last updated</p>
            <p className="font-medium text-foreground">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 md:px-8 py-6 md:py-8 bg-background overflow-y-auto overflow-x-hidden pb-32">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 lg:mb-12">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white p-5 md:p-6 rounded-lg border border-border shadow-sm relative overflow-hidden text-center md:text-left">
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
                  <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                  {/* Removed change/trend percentage per request */}
                </div>
              </div>
            ))}
          </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {/* Calls Over Time */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-foreground mb-6">Calls Over Time</h3>
            <div className="h-80 relative md:mt-0 lg:mt-24">
              {callsOverTime.length > 0 ? (
                 <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                   {/* Grid lines */}
                  {(() => {
                    const maxCalls = Math.max(...callsOverTime.map(p => p.calls), 1);
                    const gridLines = Math.min(8, maxCalls + 1);
                    return Array.from({ length: gridLines }, (_, i) => (
                     <line
                        key={i}
                       x1="40"
                        y1={20 + (i / (gridLines - 1)) * 160}
                       x2="380"
                        y2={20 + (i / (gridLines - 1)) * 160}
                       stroke="#E5E7EB"
                       strokeWidth="1"
                     />
                    ));
                  })()}
                   
                   {/* Area chart */}
                   <defs>
                     <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                       <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
                     </linearGradient>
                   </defs>
                   
                  {(() => {
                    const maxCalls = Math.max(...callsOverTime.map(p => p.calls), 1);
                    const stepWidth = callsOverTime.length > 1 ? 320 / (callsOverTime.length - 1) : 0;
                    
                    if (callsOverTime.length > 0) {
                      const pathData = callsOverTime.map((point, index) => 
                        `${index === 0 ? 'M' : 'L'} ${60 + index * stepWidth},${180 - (point.calls / maxCalls) * 160}`
                      ).join(' ');
                      
                      const areaPath = `${pathData} L ${60 + (callsOverTime.length - 1) * stepWidth},180 L 60,180 Z`;
                      
                      return (
                        <>
                          <path d={areaPath} fill="url(#areaGradient)" />
                          <path d={pathData} fill="none" stroke="#06B6D4" strokeWidth="2" />
                        </>
                      );
                    }
                    return null;
                  })()}
                   
                  {/* Invisible hover areas for each data point */}
                  {callsOverTime.map((point, index) => {
                    const maxCalls = Math.max(...callsOverTime.map(p => p.calls), 1);
                    const stepWidth = callsOverTime.length > 1 ? 320 / (callsOverTime.length - 1) : 0;
                    const x = 60 + index * stepWidth;
                    
                    return (
                    <rect
                      key={`hover-${index}`}
                        x={x - 25}
                      y="20"
                      width="50"
                      height="160"
                      fill="transparent"
                      onMouseEnter={() => {
                          setHoveredPoint({ ...point, index, x, y: 180 - (point.calls / maxCalls) * 160 });
                        setHoveredSegment(null); // Clear other hover states
                        setHoveredBar(null);
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    />
                    );
                  })}
                   
                   {/* Data points */}
                  {callsOverTime.map((point, index) => {
                    const maxCalls = Math.max(...callsOverTime.map(p => p.calls), 1);
                    const stepWidth = callsOverTime.length > 1 ? 320 / (callsOverTime.length - 1) : 0;
                    const x = 60 + index * stepWidth;
                    const y = 180 - (point.calls / maxCalls) * 160;
                    
                    return (
                     <circle
                       key={index}
                        cx={x}
                        cy={y}
                       r="3"
                       fill="#06B6D4"
                     />
                    );
                  })}
                   
                   {/* X-axis labels */}
                  {callsOverTime.map((point, index) => {
                    const stepWidth = callsOverTime.length > 1 ? 320 / (callsOverTime.length - 1) : 0;
                    const x = 60 + index * stepWidth;
                    
                    // For yearly view, show every other label to avoid overlap
                    const shouldShowLabel = timeFilter === '365' ? index % 2 === 0 : true;
                    
                    return (
                     <text
                       key={index}
                        x={x}
                       y="195"
                       textAnchor="middle"
                       className="text-xs fill-gray-500"
                        style={{ 
                          fontSize: timeFilter === '365' ? '10px' : '12px',
                          display: shouldShowLabel ? 'block' : 'none'
                        }}
                     >
                       {point.date}
                     </text>
                    );
                  })}
                   
                   {/* Y-axis labels */}
                  {(() => {
                    const maxCalls = Math.max(...callsOverTime.map(p => p.calls), 1);
                    const gridLines = Math.min(8, maxCalls + 1);
                    return Array.from({ length: gridLines }, (_, i) => {
                      const value = Math.round((i / (gridLines - 1)) * maxCalls);
                      const y = 185 - (i / (gridLines - 1)) * 160;
                      
                      return (
                     <text
                          key={i}
                       x="35"
                          y={y}
                       textAnchor="end"
                       className="text-xs fill-gray-500"
                     >
                       {value}
                     </text>
                      );
                    });
                  })()}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                 </svg>
                    <p className="mt-2 text-sm">No data available for selected time period</p>
                  </div>
                </div>
              )}
                 
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
                  <div className="text-sm text-cyan-600">Calls: {hoveredPoint.calls}</div>
                </div>
              )}
            </div>
          </div>

          {/* Routing by Niche */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow relative">
            <h3 className="text-xl font-semibold text-foreground mb-6">Routing by Niche</h3>
            <div className="flex items-center justify-center h-96">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {routingData.map((segment, index) => {
                      const total = routingData.reduce((sum, item) => sum + item.value, 0);
                      const percentage = total > 0 ? (segment.value / total) * 100 : 0;
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
                            setHoveredSegment({ ...segment, index, percentage: percentage.toFixed(1) });
                            setHoveredPoint(null); // Clear other hover states
                            setHoveredBar(null);
                          }}
                          onMouseLeave={() => setHoveredSegment(null)}
                          className="cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Tooltip for donut chart - positioned outside the chart */}
                  {hoveredSegment && (
                    <div 
                      className="absolute bg-white border border-gray-200 rounded-lg shadow-xl p-3 pointer-events-none z-20"
                      style={{
                        left: '110%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        minWidth: '140px',
                        maxWidth: '180px'
                      }}
                    >
                      <div className="text-sm font-semibold text-gray-900 mb-1">{hoveredSegment.name}</div>
                      <div className="text-sm text-blue-600 font-medium">Calls: {hoveredSegment.value}</div>
                      <div className="text-xs text-gray-500">Percentage: {hoveredSegment.percentage}%</div>
                      
                      {/* Arrow pointing to the chart */}
                      <div 
                        className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-200"
                      ></div>
                      <div 
                        className="absolute left-0 top-1/2 transform -translate-x-0.5 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white"
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Legend with provider counts */}
              <div className="mt-4 space-y-2">
                {routingData.map((item, index) => {
                  const categoryKey = item.name.toLowerCase().replace(/\s+/g, '-').replace('substance-abuse', 'substance-abuse').replace('mental-health', 'mental-health').replace('domestic-violence', 'domestic-violence').replace('youth-crisis', 'youth-crisis').replace('elder-care', 'elder-concern').replace('escalated-to-emergency', 'escalated-emergency');
                  const providers = providersData[categoryKey] || [];
                  
                  return (
                    <div key={index} className="flex items-center justify-between group">
                      <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                      <div className="text-sm text-muted-foreground">
                        {item.value} calls
                      </div>
              </div>
                  );
                })}
              </div>
          </div>
          </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Outcomes Breakdown */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-foreground mb-6">Outcomes Breakdown</h3>
            <div className="h-80 relative">
              {(() => {
                // Calculate outcomes from real data - only 3 columns
                const outcomesData = [
                  { 
                    name: 'Redirected', 
                    value: callsData.filter(call => 
                      call.phone_number && call.phone_number.trim() !== ''
                    ).length,
                    color: '#3B82F6',
                    icon: '📞'
                  },
                  { 
                    name: 'Booked', 
                    value: callsData.filter(call => 
                      getShortProviderName(call.provider_name, call).toLowerCase().includes('homeless')
                    ).length,
                    color: '#10B981',
                    icon: '✅'
                  },
                  { 
                    name: 'Escalated', 
                    value: callsData.filter(call => 
                      getShortProviderName(call.provider_name, call).toLowerCase().includes('escalated') || 
                      getShortProviderName(call.provider_name, call).toLowerCase().includes('emergency')
                    ).length,
                    color: '#EF4444',
                    icon: '🚨'
                  }
                ];

                const maxValue = Math.max(...outcomesData.map(o => o.value), 1);
                
                return (
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  {[0, 3, 6, 9, 12].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={180 - (y / 12) * 160}
                      x2="380"
                      y2={180 - (y / 12) * 160}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 3, 6, 9, 12].map((value) => (
                    <text
                      key={value}
                      x="35"
                      y={185 - (value / 12) * 160}
                      textAnchor="end"
                      className="text-xs fill-gray-500"
                    >
                      {value}
                    </text>
                  ))}
                  
                  {/* Bars - 3 columns with proper spacing */}
                  {outcomesData.map((outcome, index) => {
                    // Fix: Use actual value instead of maxValue for proper scaling
                    const barHeight = (outcome.value / 12) * 160; // Scale to max 12 on Y-axis
                    const barWidth = 50;
                    const barSpacing = 100; // More space for 3 bars
                    const startX = 80 + index * barSpacing;
                    
                    return (
                      <g key={index}>
                        {/* Invisible hover area - make it larger for better interaction */}
                        <rect
                          x={startX - 10}
                          y="20"
                          width={barWidth + 20}
                          height="160"
                          fill="transparent"
                          onMouseEnter={() => {
                            setHoveredBar({ ...outcome, index, x: startX + barWidth/2, y: 180 - barHeight });
                            setHoveredPoint(null);
                            setHoveredSegment(null);
                          }}
                          onMouseLeave={() => setHoveredBar(null)}
                          className="cursor-pointer"
                        />
                        
                        {/* Bar with rounded top */}
                        <rect
                          x={startX}
                          y={180 - barHeight}
                          width={barWidth}
                          height={barHeight}
                          fill="#20C997"
                          rx="4"
                          ry="4"
                        />
                        
                        {/* X-axis labels */}
                        <text
                          x={startX + barWidth/2}
                          y="195"
                          textAnchor="middle"
                          className="text-xs fill-gray-600 font-medium"
                        >
                          {outcome.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                );
              })()}
                
              {/* Clean tooltip for bar chart */}
              {hoveredBar && (
                <div 
                  className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-20"
                  style={{
                    left: `${(hoveredBar.x / 400) * 100}%`,
                    top: '20%',
                    transform: 'translateX(-50%)',
                    minWidth: '100px',
                    maxWidth: '150px'
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">{hoveredBar.name}</div>
                  <div className="text-sm text-gray-600">Value: {hoveredBar.value}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sentiment - 2x2 donut grid (beautiful, unique) */}
          <div className="bg-white p-8 rounded-xl border border-border shadow-lg hover:shadow-xl transition-shadow mb-28">
            <h3 className="text-xl font-semibold text-foreground mb-6">Sentiment</h3>
            {(() => {
              const sentiments = [
                { key: 'Positive', color: '#10B981' },
                { key: 'Negative', color: '#EF4444' },
                { key: 'Neutral',  color: '#3B82F6' },
                { key: 'Unknown', color: '#9CA3AF' }
              ];
              const counts = sentiments.map(s => ({
                ...s,
                value: callsData.filter(call => (call.user_sentiment || 'Unknown') === s.key).length
              }));
              const total = Math.max(counts.reduce((sum, c) => sum + c.value, 0), 1);
              const size = 120;
              const radius = 46;
              const circumference = 2 * Math.PI * radius;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {counts.map((c, i) => {
                    const pct = c.value / total;
                    const dash = circumference * pct;
                    const gap = circumference - dash;
                    return (
                      <div key={c.key} className="relative flex items-center gap-4">
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
                          <g transform={`translate(${size/2}, ${size/2})`}>
                            {/* Track */}
                            <circle r={radius} fill="none" stroke="#E5E7EB" strokeWidth="10" />
                            {/* Progress */}
                            <circle
                              r={radius}
                              fill="none"
                              stroke={c.color}
                              strokeWidth="10"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeLinecap="round"
                              transform="rotate(-90)"
                              onMouseEnter={(e) => setHoveredSentiment({ ...c, x: e.currentTarget.getBoundingClientRect().left + size/2, y: e.currentTarget.getBoundingClientRect().top + size/2, pct: Math.round(pct*100) })}
                              onMouseLeave={() => setHoveredSentiment(null)}
                            />
                            {/* Center value */}
                            <text textAnchor="middle" dy="6" className="text-base fill-gray-900 font-semibold">{c.value}</text>
                          </g>
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{c.key}</div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Tooltip (absolute to viewport via client coords) */}
                  {hoveredSentiment && (
                    <div
                      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs"
                      style={{ left: hoveredSentiment.x, top: hoveredSentiment.y - 50, transform: 'translate(-50%, -100%)' }}
                    >
                      <div className="font-semibold text-gray-900">{hoveredSentiment.key}</div>
                      <div className="text-gray-600">{hoveredSentiment.value} calls</div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        <div className="h-16 md:h-24" />
      </main>
    </div>
  );
};

export default Dashboard;
