import React, { useState, useEffect } from 'react';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to format phone numbers
const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    // Format as 925******66
    const firstThree = digits.slice(0, 3);
    const lastTwo = digits.slice(-2);
    return `${firstThree}******${lastTwo}`;
  }
  return phone;
};

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

// Helper function to format duration
const formatDuration = (durationMs) => {
  if (!durationMs) return '0:00';
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper function to format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to format transcript
const formatTranscript = (transcript) => {
  if (!transcript) return [];
  
  // Split by lines and format each line
  const lines = transcript.split('\n').filter(line => line.trim());
  return lines.map(line => {
    if (line.startsWith('Agent:')) {
      return { speaker: 'Agent', message: line.replace('Agent:', '').trim() };
    } else if (line.startsWith('User:')) {
      return { speaker: 'Customer', message: line.replace('User:', '').trim() };
    } else {
      return { speaker: 'System', message: line.trim() };
    }
  });
};

// Audio Player Component
const AudioPlayer = ({ audioUrl, callId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      setAudio(audioElement);
      
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });
      
      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);
      });
      
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `call-recording-${callId}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm text-muted-foreground">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
      </div>
      
      {/* Sound Waves Animation */}
      <div className="h-8 flex items-center justify-center">
        {isPlaying && (
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-primary rounded-full animate-pulse"
                style={{
                  width: '4px',
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Calls = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [filter, setFilter] = useState('all'); // category/outcome/sentiment chips
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('7');
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  // Fetch calls from backend
  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        search: searchTerm,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (filter !== 'all') {
        if (['mental-health', 'domestic-violence', 'substance-abuse', 'homelessness', 'youth-crisis', 'elder-concern', 'gambling', 'escalated-emergency'].includes(filter)) {
          // Map filter names to backend provider names
          const providerMap = {
            'mental-health': 'mental',
            'domestic-violence': 'domestic',
            'substance-abuse': 'substance',
            'homelessness': 'homeless',
            'youth-crisis': 'youth',
            'elder-concern': 'elder',
            'gambling': 'gambling',
            'escalated-emergency': 'emergency'
          };
          params.append('provider', providerMap[filter]);
        } else if (['positive', 'neutral', 'negative'].includes(filter)) {
          params.append('sentiment', filter);
        } else if (['true', 'false'].includes(filter)) {
          params.append('call_successful', filter);
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/calls?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCalls(data.data.calls);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch calls');
      }
    } catch (err) {
      console.error('Error fetching calls:', err);
      setError(err.message);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [pagination.currentPage, searchTerm, filter]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      } else {
        fetchCalls();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'in-progress': return 'text-warning bg-warning/10';
      case 'pending': return 'text-muted-foreground bg-muted/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-sentiment-positive bg-sentiment-positive/10';
      case 'negative': return 'text-sentiment-negative bg-sentiment-negative/10';
      case 'neutral': return 'text-sentiment-neutral bg-sentiment-neutral/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getCategoryColor = (providerName, callData = null) => {
    const shortName = getShortProviderName(providerName, callData).toLowerCase();
    
    if (shortName.includes('mental')) return 'text-blue-600 bg-blue-50 border border-blue-200';
    if (shortName.includes('domestic') || shortName.includes('violence')) return 'text-pink-600 bg-pink-50 border border-pink-200';
    if (shortName.includes('substance')) return 'text-cyan-600 bg-cyan-50 border border-cyan-200';
    if (shortName.includes('homeless')) return 'text-orange-600 bg-orange-50 border border-orange-200';
    if (shortName.includes('elder')) return 'text-purple-600 bg-purple-50 border border-purple-200';
    if (shortName.includes('youth')) return 'text-green-600 bg-green-50 border border-green-200';
    if (shortName.includes('gambling')) return 'text-red-600 bg-red-50 border border-red-200';
    if (shortName.includes('escalated') || shortName.includes('emergency')) return 'text-red-600 bg-red-50 border border-red-200';
    
    return 'text-gray-600 bg-gray-50 border border-gray-200';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  // No need for client-side filtering since we're doing it on the backend
  const filteredCalls = calls;


  const exportCsv = (rows) => {
    const headers = ['Time','Caller ID','Niche','Routed Provider','Sentiment','Call Success','Duration'];
    const toCsv = rows.map(r => [
      formatDateTime(r.createdAt),
      '"' + formatPhoneNumber(r.phone_number || r.from_number) + '"',
      getShortProviderName(r.provider_name, r),
      getShortProviderName(r.provider_name, r),
      r.user_sentiment || 'N/A',
      r.call_successful === true ? 'Success' : r.call_successful === false ? 'Failed' : 'Unknown',
      formatDuration(r.duration_ms)
    ].join(',')); 
    const csv = [headers.join(','), ...toCsv].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calls_export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading calls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Call Overview</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="1">Today</option>
                  <option value="1">24 Hours</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-6 py-8">

        {/* Overview Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Call Overview</h2>
              <p className="text-muted-foreground mt-1">{filteredCalls.length} calls in selected time range</p>
            </div>
          </div>
          
          {/* Search and Export */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 mr-4">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                placeholder="Search by caller ID, provider, or transcript..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            <button onClick={() => exportCsv(filteredCalls)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2h-5l-2-2H9L7 4H4a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Export CSV
            </button>
            </div>
            
          {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === 'all' 
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
              <span>🏠</span>
              <span>All Niches</span>
              </button>
              <button
                onClick={() => setFilter('mental-health')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === 'mental-health' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
              <span>🧠</span>
              <span>Mental Health</span>
              </button>
              <button
                onClick={() => setFilter('domestic-violence')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === 'domestic-violence' 
                  ? 'bg-pink-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>❤️</span>
              <span>Domestic Violence</span>
            </button>
            <button
              onClick={() => setFilter('homelessness')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === 'homelessness' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>🏠</span>
              <span>Homelessness</span>
              </button>
              <button
                onClick={() => setFilter('substance-abuse')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === 'substance-abuse' 
                  ? 'bg-cyan-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>💊</span>
              <span>Substance Abuse</span>
            </button>
            <button
              onClick={() => setFilter('youth-crisis')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === 'youth-crisis' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>👦</span>
              <span>Youth Crisis</span>
            </button>
            <button
              onClick={() => setFilter('elder-concern')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === 'elder-concern' 
                  ? 'bg-indigo-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>👴</span>
              <span>Elder Concern</span>
            </button>
            <button
              onClick={() => setFilter('gambling')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === 'gambling' 
                  ? 'bg-red-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>🎲</span>
              <span>Gambling</span>
            </button>
            <button
              onClick={() => setFilter('escalated-emergency')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === 'escalated-emergency' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>🚨</span>
              <span>Escalated to Emergency</span>
            </button>
            <button
              onClick={() => setFilter('redirected')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'redirected' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Redirected
            </button>
            <button
              onClick={() => setFilter('booked')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'booked' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Booked
            </button>
            <button
              onClick={() => setFilter('escalated')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'escalated' 
                  ? 'bg-red-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Escalated
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'resolved' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => setFilter('abandoned')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'abandoned' 
                  ? 'bg-yellow-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Abandoned
            </button>
            <button
              onClick={() => setFilter('positive')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'positive' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Positive
              </button>
              <button
              onClick={() => setFilter('neutral')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'neutral' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Neutral
              </button>
            <button
              onClick={() => setFilter('negative')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'negative' 
                  ? 'bg-red-500 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Negative
              </button>
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Recent Calls ({filteredCalls.length})</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Time</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Caller ID</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider">Niche</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider">Routed Provider</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider">Sentiment</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider">Call Success</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-5 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateTime(call.createdAt)}
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-sm">
                      <div className="text-foreground font-medium">
                        {formatPhoneNumber(call.phone_number || call.from_number)}
                      </div>
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(call.provider_name, call)}`}>
                        {getShortProviderName(call.provider_name, call)}
                      </span>
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-sm text-foreground text-center">
                      {getShortProviderName(call.provider_name, call)}
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        call.user_sentiment === 'Positive' ? 'text-white bg-green-500' :
                        call.user_sentiment === 'Neutral' ? 'text-white bg-blue-500' :
                        call.user_sentiment === 'Negative' ? 'text-white bg-red-500' :
                        'text-gray-600 bg-gray-200'
                      }`}>
                        {call.user_sentiment || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        call.call_successful === true ? 'text-green-600 bg-green-50 border border-green-200' :
                        call.call_successful === false ? 'text-red-600 bg-red-50 border border-red-200' :
                        'text-gray-600 bg-gray-50 border border-gray-200'
                      }`}>
                        {call.call_successful === true ? 'Success' : 
                         call.call_successful === false ? 'Failed' : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-sm text-muted-foreground font-mono text-center">
                      {formatDuration(call.duration_ms)}
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap text-center">
                      <button 
                        onClick={() => setSelectedCall(call)} 
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCalls.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-foreground">No calls found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No calls match the selected filter.'}
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>

      {/* Call Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground">Call Details</h3>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Call Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Call ID</label>
                  <p className="text-foreground font-medium text-lg">{selectedCall.call_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-foreground font-medium text-lg">{selectedCall.phone_number || selectedCall.from_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Agent Name</label>
                  <p className="text-foreground text-lg">{selectedCall.agent_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Call Time</label>
                  <p className="text-foreground text-lg">{formatDateTime(selectedCall.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-foreground font-mono text-lg">{formatDuration(selectedCall.duration_ms)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Disconnection Reason</label>
                  <p className="text-foreground text-lg">{selectedCall.disconnection_reason || 'N/A'}</p>
                </div>
              </div>

              {/* Provider and Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Provider</label>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-4 py-2 -ml-2 rounded-full text-base font-medium ${getCategoryColor(selectedCall.provider_name, selectedCall)}`}>
                      {getShortProviderName(selectedCall.provider_name, selectedCall)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sentiment</label>
                  <div className="mt-2 -ml-2">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${
                      selectedCall.user_sentiment === 'Positive' ? 'text-white bg-green-500' :
                      selectedCall.user_sentiment === 'Neutral' ? 'text-white bg-blue-500' :
                      selectedCall.user_sentiment === 'Negative' ? 'text-white bg-red-500' :
                      'text-gray-600 bg-gray-200'
                    }`}>
                      {selectedCall.user_sentiment || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Summary */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Call Summary</label>
                <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-foreground leading-relaxed">{selectedCall.call_summary || 'No summary available'}</p>
                </div>
              </div>

              {/* Transcript */}
              {selectedCall.transcript && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transcript</label>
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border max-h-60 overflow-y-auto">
                    <div className="space-y-3">
                      {formatTranscript(selectedCall.transcript).map((line, index) => (
                        <div key={index} className="flex">
                          <span className={`font-semibold text-sm min-w-[80px] mr-3 ${
                            line.speaker === 'Agent' ? 'text-blue-600' :
                            line.speaker === 'Customer' ? 'text-green-600' :
                            'text-gray-600'
                          }`}>
                            {line.speaker}:
                          </span>
                          <span className="text-foreground text-sm leading-relaxed flex-1">
                            {line.message}
                          </span>
              </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recording */}
              {selectedCall.recording_url && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recording</label>
                  <div className="mt-2">
                    <AudioPlayer audioUrl={selectedCall.recording_url} callId={selectedCall.call_id} />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calls;
