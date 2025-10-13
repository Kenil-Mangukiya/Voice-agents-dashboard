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
      
      return () => {
        audioElement.pause();
        audioElement.removeEventListener('loadedmetadata', () => {});
        audioElement.removeEventListener('timeupdate', () => {});
        audioElement.removeEventListener('ended', () => {});
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `call-recording-${callId}.mp3`;
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
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
            <span>{Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}</span>
          </div>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
      
      {/* Sound Waves Animation */}
      <div className="h-8 flex items-center justify-center">
        {isPlaying && (
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-blue-600 rounded-full animate-pulse"
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

const Provider = () => {
  const [currentView, setCurrentView] = useState('categories'); // 'categories' or 'providers'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('7 Days');
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [callsLoading, setCallsLoading] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [categoryCallCounts, setCategoryCallCounts] = useState({});
  const [tableHeight, setTableHeight] = useState(600); // Default height for call history table
  const [countsLoading, setCountsLoading] = useState(false);

  // Mock data for service categories
  const serviceCategories = [
    {
      id: 'mental-health',
      name: 'Mental Health',
      description: 'Crisis intervention and mental health support services',
      providers: 3,
      callsRouted: 8,
      icon: '🧠',
      color: 'purple'
    },
    {
      id: 'domestic-violence',
      name: 'Domestic Violence',
      description: 'Safe shelter and support for victims of domestic violence',
      providers: 3,
      callsRouted: 7,
      icon: '❤️',
      color: 'pink'
    },
    {
      id: 'homelessness',
      name: 'Homelessness',
      description: 'Emergency shelter, meals, and housing assistance',
      providers: 5,
      callsRouted: 4,
      icon: '🏠',
      color: 'orange'
    },
    {
      id: 'substance-abuse',
      name: 'Substance Abuse',
      description: 'Detox, treatment, and recovery support services',
      providers: 4,
      callsRouted: 16,
      icon: '💊',
      color: 'blue'
    },
    {
      id: 'youth-crisis',
      name: 'Youth Crisis',
      description: 'Emergency support and intervention for youth in crisis',
      providers: 4,
      callsRouted: 12,
      icon: '👦',
      color: 'green'
    },
    {
      id: 'elder-concern',
      name: 'Elder Concern',
      description: 'Support services and care for elderly individuals',
      providers: 3,
      callsRouted: 9,
      icon: '👴',
      color: 'indigo'
    },
    {
      id: 'gambling',
      name: 'Gambling Addiction',
      description: 'Treatment and support for gambling addiction recovery',
      providers: 2,
      callsRouted: 6,
      icon: '🎲',
      color: 'red'
    },
    {
      id: 'escalated-emergency',
      name: 'Escalated to Emergency',
      description: 'Calls that were escalated to emergency services (911)',
      providers: 1,
      callsRouted: 0,
      icon: '🚨',
      color: 'red'
    }
  ];

  // Mock data for providers
  const providers = {
    'mental-health': [
      {
        id: 1,
        name: 'Albuquerque Crisis Center',
        description: '24-hour crisis intervention and mental health support services.',
        phone: '(505) 247-1121',
        hours: '24/7',
        address: '900 Gold Ave SW, Albuquerque, NM 87102',
        tags: ['24/7', 'crisis intervention', 'walk-in', 'phone support']
      },
      {
        id: 2,
        name: 'PB&J Family Services',
        description: 'Comprehensive behavioral health services for families and children.',
        phone: '(505) 766-9361',
        hours: 'M-F 8am-5pm',
        address: '625 Silver Ave SW, Albuquerque, NM 87102',
        tags: ['family therapy', 'youth services', 'intake required']
      },
      {
        id: 3,
        name: 'University of NM Psychiatric Center',
        description: 'Emergency psychiatric evaluation and inpatient treatment.',
        phone: '(505) 272-1313',
        hours: '24/7',
        address: '2211 Lomas Blvd NE, Albuquerque, NM 87106',
        tags: ['emergency', 'inpatient', 'psychiatric evaluation']
      }
    ],
    'domestic-violence': [
      {
        id: 4,
        name: 'Domestic Violence Resource Center',
        description: 'Comprehensive support services for domestic violence survivors.',
        phone: '(505) 248-3165',
        hours: '24/7',
        address: '400 Roma Ave NW, Albuquerque, NM 87102',
        tags: ['24/7', 'shelter', 'legal advocacy', 'counseling']
      },
      {
        id: 5,
        name: 'Safe House New Mexico',
        description: 'Emergency shelter and transitional housing for survivors.',
        phone: '(505) 247-4219',
        hours: '24/7',
        address: '123 Main St, Albuquerque, NM 87102',
        tags: ['emergency shelter', 'transitional housing', 'support groups']
      },
      {
        id: 6,
        name: 'Family Advocacy Center',
        description: 'Coordinated response for domestic violence cases.',
        phone: '(505) 243-2333',
        hours: 'M-F 8am-5pm',
        address: '456 Central Ave, Albuquerque, NM 87102',
        tags: ['legal support', 'case management', 'counseling']
      }
    ],
    'homelessness': [
      {
        id: 7,
        name: 'Albuquerque Rescue Mission',
        description: 'Emergency shelter, meals, and recovery programs.',
        phone: '(505) 346-4673',
        hours: '24/7',
        address: '525 2nd St SW, Albuquerque, NM 87102',
        tags: ['emergency shelter', 'meals', 'recovery programs']
      },
      {
        id: 8,
        name: 'Joy Junction',
        description: 'Family shelter and comprehensive support services.',
        phone: '(505) 877-6967',
        hours: '24/7',
        address: '4500 2nd St SW, Albuquerque, NM 87105',
        tags: ['family shelter', 'meals', 'case management']
      },
      {
        id: 9,
        name: 'Good Shepherd Center',
        description: 'Day shelter and resource center for homeless individuals.',
        phone: '(505) 243-2522',
        hours: 'M-F 7am-5pm',
        address: '218 Iron Ave SW, Albuquerque, NM 87102',
        tags: ['day shelter', 'resources', 'case management']
      },
      {
        id: 10,
        name: 'St. Martin\'s Hospitality Center',
        description: 'Comprehensive services for homeless and at-risk individuals.',
        phone: '(505) 243-2522',
        hours: 'M-F 8am-4pm',
        address: '1201 3rd St NW, Albuquerque, NM 87102',
        tags: ['case management', 'resources', 'counseling']
      },
      {
        id: 11,
        name: 'Albuquerque Health Care for the Homeless',
        description: 'Medical and behavioral health services for homeless individuals.',
        phone: '(505) 242-5000',
        hours: 'M-F 8am-5pm',
        address: '1217 1st St NW, Albuquerque, NM 87102',
        tags: ['medical care', 'behavioral health', 'case management']
      }
    ],
    'substance-abuse': [
      {
        id: 12,
        name: 'Albuquerque Treatment Services',
        description: 'Comprehensive addiction treatment and recovery programs.',
        phone: '(505) 266-2100',
        hours: '24/7',
        address: '500 Walter St NE, Albuquerque, NM 87102',
        tags: ['detox', 'inpatient', 'outpatient', 'counseling']
      },
      {
        id: 13,
        name: 'New Mexico Recovery Center',
        description: 'Evidence-based treatment for substance use disorders.',
        phone: '(505) 242-5000',
        hours: 'M-F 8am-8pm',
        address: '123 Recovery Way, Albuquerque, NM 87102',
        tags: ['outpatient', 'counseling', 'support groups']
      },
      {
        id: 14,
        name: 'Serenity House',
        description: 'Residential treatment and sober living programs.',
        phone: '(505) 243-2333',
        hours: '24/7',
        address: '789 Hope Ave, Albuquerque, NM 87102',
        tags: ['residential', 'sober living', 'aftercare']
      },
      {
        id: 15,
        name: 'Recovery Services of New Mexico',
        description: 'Outpatient treatment and recovery support services.',
        phone: '(505) 247-4219',
        hours: 'M-F 8am-6pm',
        address: '321 Wellness Blvd, Albuquerque, NM 87102',
        tags: ['outpatient', 'counseling', 'medication-assisted']
      }
    ],
    'youth-crisis': [
      {
        id: 16,
        name: 'Youth Crisis Center of Albuquerque',
        description: '24/7 crisis intervention and emergency shelter for youth ages 12-17.',
        phone: '(505) 247-1121',
        hours: '24/7',
        address: '900 Gold Ave SW, Albuquerque, NM 87102',
        tags: ['24/7', 'crisis intervention', 'emergency shelter', 'youth services']
      },
      {
        id: 17,
        name: 'New Mexico Youth Crisis Line',
        description: 'Confidential crisis counseling and support for youth and families.',
        phone: '(505) 247-1121',
        hours: '24/7',
        address: 'Crisis Line - No Physical Location',
        tags: ['crisis line', 'confidential', 'family support', 'counseling']
      },
      {
        id: 18,
        name: 'Youth Development Inc.',
        description: 'Comprehensive youth services including crisis intervention and case management.',
        phone: '(505) 766-9361',
        hours: 'M-F 8am-6pm',
        address: '625 Silver Ave SW, Albuquerque, NM 87102',
        tags: ['case management', 'youth development', 'counseling', 'support groups']
      },
      {
        id: 19,
        name: 'Teen Crisis Center',
        description: 'Specialized services for teenagers in crisis situations.',
        phone: '(505) 243-2333',
        hours: '24/7',
        address: '456 Central Ave, Albuquerque, NM 87102',
        tags: ['teen services', 'crisis intervention', 'peer support', 'family therapy']
      }
    ],
    'elder-concern': [
      {
        id: 20,
        name: 'Albuquerque Senior Services',
        description: 'Comprehensive support services for elderly individuals and their families.',
        phone: '(505) 248-3165',
        hours: 'M-F 8am-5pm',
        address: '400 Roma Ave NW, Albuquerque, NM 87102',
        tags: ['senior services', 'case management', 'transportation', 'meal programs']
      },
      {
        id: 21,
        name: 'Elder Abuse Prevention Center',
        description: 'Protection and support services for elderly individuals experiencing abuse.',
        phone: '(505) 247-4219',
        hours: '24/7',
        address: '123 Main St, Albuquerque, NM 87102',
        tags: ['elder abuse', 'protection services', 'legal advocacy', 'counseling']
      },
      {
        id: 22,
        name: 'Senior Care Network',
        description: 'Healthcare coordination and support services for elderly individuals.',
        phone: '(505) 243-2333',
        hours: 'M-F 8am-6pm',
        address: '789 Care Ave, Albuquerque, NM 87102',
        tags: ['healthcare coordination', 'medication management', 'home care', 'respite care']
      }
    ],
    'gambling': [
      {
        id: 23,
        name: 'New Mexico Gambling Addiction Center',
        description: 'Specialized treatment and recovery programs for gambling addiction.',
        phone: '(505) 266-2100',
        hours: 'M-F 8am-8pm',
        address: '500 Recovery St NE, Albuquerque, NM 87102',
        tags: ['gambling addiction', 'counseling', 'support groups', 'financial counseling']
      },
      {
        id: 24,
        name: 'Gamblers Anonymous New Mexico',
        description: 'Peer support groups and recovery programs for gambling addiction.',
        phone: '(505) 242-5000',
        hours: 'Various meeting times',
        address: '123 Hope Way, Albuquerque, NM 87102',
        tags: ['peer support', '12-step program', 'meetings', 'recovery support']
      }
    ],
    'escalated-emergency': [
      {
        id: 25,
        name: 'Emergency Services (911)',
        description: 'Calls that were escalated to emergency services due to immediate safety concerns.',
        phone: '911',
        hours: '24/7',
        address: 'Emergency Dispatch Center',
        tags: ['emergency', '911', 'immediate response', 'safety']
      }
    ]
  };

  // Fetch call counts for all categories
  const fetchCategoryCallCounts = async () => {
    try {
      setCountsLoading(true);
      const categoryProviderMap = {
        'mental-health': 'mental',
        'domestic-violence': 'domestic',
        'substance-abuse': 'substance',
        'homelessness': 'homeless',
        'youth-crisis': 'youth',
        'elder-concern': 'elder',
        'gambling': 'gambling',
        'escalated-emergency': 'emergency'
      };

      const counts = {};
      
      for (const [categoryId, providerKey] of Object.entries(categoryProviderMap)) {
        try {
          const params = new URLSearchParams({
            page: '1',
            limit: '1',
            provider: providerKey
          });
          
          const response = await fetch(`${API_BASE_URL}/calls?${params}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              counts[categoryId] = data.data.pagination?.totalItems || 0;
            }
          }
        } catch (err) {
          console.error(`Error fetching count for ${categoryId}:`, err);
          counts[categoryId] = 0;
        }
      }
      
      setCategoryCallCounts(counts);
    } catch (err) {
      console.error('Error fetching category call counts:', err);
    } finally {
      setCountsLoading(false);
    }
  };

  // Fetch calls for a specific category
  const fetchCallsForCategory = async (categoryId) => {
    try {
      setCallsLoading(true);
      
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      // Map category IDs to provider names for filtering
      const categoryProviderMap = {
        'mental-health': 'mental',
        'domestic-violence': 'domestic',
        'substance-abuse': 'substance',
        'homelessness': 'homeless',
        'youth-crisis': 'youth',
        'elder-concern': 'elder',
        'gambling': 'gambling',
        'escalated-emergency': 'emergency'
      };
      
      if (categoryProviderMap[categoryId]) {
        params.append('provider', categoryProviderMap[categoryId]);
      }
      
      const response = await fetch(`${API_BASE_URL}/calls?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCalls(data.data.calls || []);
      } else {
        throw new Error(data.message || 'Failed to fetch calls');
      }
    } catch (err) {
      console.error('Error fetching calls:', err);
      setCalls([]);
    } finally {
      setCallsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('providers');
    setLoading(true);
    
    // Fetch calls for this category
    fetchCallsForCategory(category.id);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setSearchTerm('');
  };

  // Fetch call counts on component mount
  useEffect(() => {
    fetchCategoryCallCounts();
  }, []);

  // Refresh call counts when returning to categories view
  useEffect(() => {
    if (currentView === 'categories') {
      fetchCategoryCallCounts();
    }
  }, [currentView]);

  const getCategoryColor = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      orange: 'bg-orange-100 text-orange-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  // Function to get category color for provider names (used in modal)
  const getProviderCategoryColor = (providerName, callData = null) => {
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

  const filteredProviders = selectedCategory && providers[selectedCategory.id] 
    ? providers[selectedCategory.id].filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground">Service Providers</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option>Today</option>
                <option>24 Hours</option>
                <option>7 Days</option>
                <option>30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {currentView === 'categories' ? (
          <>
            {/* Categories View */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Service Provider Network</h2>
                  <p className="text-muted-foreground">Browse providers by service category to route calls effectively</p>
                </div>
                <button
                  onClick={fetchCategoryCallCounts}
                  disabled={countsLoading}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className={`w-4 h-4 mr-2 ${countsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {countsLoading ? 'Refreshing...' : 'Refresh Counts'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${getCategoryColor(category.color)}`}>
                      {category.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    
                    {/* Statistics */}
                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-100 mt-4">
                      <div className="flex flex-col items-start">
                        <span className="text-xl font-bold text-gray-900">{category.providers}</span>
                        <span className="text-xs text-gray-500">Providers</span>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div> {/* Vertical separator */}
                      <div className="flex flex-col items-start">
                        <span className="text-xl font-bold text-teal-500">
                          {countsLoading ? (
                            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            categoryCallCounts[category.id] || 0
                          )}
                        </span>
                        <span className="text-xs text-gray-500">Calls Routed</span>
                      </div>
                    </div>

                    {/* Navigation Arrow */}
                    <svg className="absolute top-6 right-6 w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Providers View */}
            <div className="mb-6">
              <button
                onClick={handleBackToCategories}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all categories
              </button>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{selectedCategory.name} Providers</h2>
                  <p className="text-muted-foreground">{filteredProviders.length} providers available</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedCategory.color)}`}>
                  {selectedCategory.icon} {selectedCategory.name}
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Provider Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{provider.name}</h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{provider.description}</p>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 font-medium">{provider.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 font-medium">{provider.hours}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 font-medium">{provider.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {provider.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Call History Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Call History ({calls.length})</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: `${tableHeight}px` }}>
                {callsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading calls...</span>
                  </div>
                ) : (
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Caller ID</th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Niche</th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Routed Provider</th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Sentiment</th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Call Success</th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {calls.map((call) => (
                        <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-600">
                            {formatDateTime(call.createdAt)}
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-sm">
                            <div className="text-gray-900 font-medium">
                              {formatPhoneNumber(call.phone_number || call.from_number)}
                            </div>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('mental') ? 'text-blue-600 bg-blue-50 border border-blue-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('domestic') ? 'text-pink-600 bg-pink-50 border border-pink-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('substance') ? 'text-cyan-600 bg-cyan-50 border border-cyan-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('homeless') ? 'text-orange-600 bg-orange-50 border border-orange-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('elder') ? 'text-purple-600 bg-purple-50 border border-purple-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('youth') ? 'text-green-600 bg-green-50 border border-green-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('gambling') ? 'text-red-600 bg-red-50 border border-red-200' :
                              getShortProviderName(call.provider_name, call).toLowerCase().includes('escalated') || getShortProviderName(call.provider_name, call).toLowerCase().includes('emergency') ? 'text-red-600 bg-red-50 border border-red-200' :
                              'text-gray-600 bg-gray-50 border border-gray-200'
                            }`}>
                              {getShortProviderName(call.provider_name, call)}
                            </span>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-900 text-center">
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
                          <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-600 font-mono text-center">
                            {formatDuration(call.duration_ms)}
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap text-center">
                            <button 
                              onClick={() => setSelectedCall(call)} 
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
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
                )}
                {!callsLoading && calls.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No calls found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No calls have been routed to {selectedCategory?.name} providers yet.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Resize Handle */}
              <div 
                className="h-2 bg-gray-200 hover:bg-gray-300 cursor-ns-resize flex items-center justify-center group transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startY = e.clientY;
                  const startHeight = tableHeight;
                  
                  const handleMouseMove = (e) => {
                    const deltaY = e.clientY - startY;
                    const newHeight = Math.max(200, Math.min(800, startHeight + deltaY));
                    setTableHeight(newHeight);
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="w-8 h-1 bg-gray-400 rounded-full group-hover:bg-gray-500 transition-colors"></div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Call Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
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
                  <label className="text-sm font-medium text-gray-600">Call ID</label>
                  <p className="text-gray-900 font-medium text-lg">{selectedCall.call_id}</p>
                </div>
                <div className="ml-2">
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="text-gray-900 font-medium text-lg">{selectedCall.phone_number || selectedCall.from_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Agent Name</label>
                  <p className="text-gray-900 text-lg">{selectedCall.agent_name || 'N/A'}</p>
                </div>
                <div className="ml-2">
                  <label className="text-sm font-medium text-gray-600">Call Time</label>
                  <p className="text-gray-900 text-lg">{formatDateTime(selectedCall.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duration</label>
                  <p className="text-gray-900 font-mono text-lg">{formatDuration(selectedCall.duration_ms)}</p>
                </div>
                  <div className="ml-2">
                  <label className="text-sm font-medium text-gray-600">Disconnection Reason</label>
                  <p className="text-gray-900 text-lg">{selectedCall.disconnection_reason || 'N/A'}</p>
                </div>
              </div>

              {/* Provider and Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Provider</label>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-4 py-2 -ml-2 rounded-full text-base font-medium ${getProviderCategoryColor(selectedCall.provider_name, selectedCall)}`}>
                      {getShortProviderName(selectedCall.provider_name, selectedCall)}
                    </span>
                  </div>
                </div>
                <div className="ml-2">
                  <label className="text-sm font-medium text-gray-600">Sentiment</label>
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
                <label className="text-sm font-medium text-gray-600">Call Summary</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 leading-relaxed">{selectedCall.call_summary || 'No summary available'}</p>
                </div>
              </div>

              {/* Transcript */}
              {selectedCall.transcript && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Transcript</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
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
                          <span className="text-gray-900 text-sm leading-relaxed flex-1">
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
                  <label className="text-sm font-medium text-gray-600">Recording</label>
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

export default Provider;
