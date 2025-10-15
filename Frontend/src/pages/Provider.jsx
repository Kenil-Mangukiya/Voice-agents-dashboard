import React, { useState, useEffect, useRef } from 'react';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'https://dashboard.aiyug.us/api';

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

// Helper function to shorten call IDs like call_12*****31
const formatCallIdShort = (callId) => {
  if (!callId || typeof callId !== 'string') return 'N/A';
  const underscoreIndex = callId.indexOf('_');
  const prefix = underscoreIndex !== -1 ? callId.slice(0, underscoreIndex + 1) : '';
  const rest = underscoreIndex !== -1 ? callId.slice(underscoreIndex + 1) : callId;
  if (rest.length <= 6) return callId; // already short
  return `${prefix}${rest.slice(0, 2)}*****${rest.slice(-2)}`;
};

// Helper function to get category color (same as Calls.jsx)
const getCategoryColor = (providerName, callData = null) => {
  const shortName = getShortProviderName(providerName, callData).toLowerCase();

  if (shortName.includes('mental')) return 'text-blue-600 bg-blue-50 border border-blue-200';
  if (shortName.includes('domestic') || shortName.includes('violence')) return 'text-pink-600 bg-pink-50 border border-pink-200';
  if (shortName.includes('substance')) return 'text-cyan-600 bg-cyan-50 border border-cyan-200';
  if (shortName.includes('homeless')) return 'text-orange-600 bg-orange-50 border border-orange-200';
  if (shortName.includes('elder')) return 'text-purple-600 bg-purple-50 border border-purple-200';
  if (shortName.includes('youth')) return 'text-green-600 bg-green-50 border border-green-200';
  if (shortName.includes('lgbtq') || shortName.includes('identity')) return 'text-teal-600 bg-teal-50 border border-teal-200';
  if (shortName.includes('gambling')) return 'text-red-600 bg-red-50 border border-red-200';
  if (shortName.includes('escalated') || shortName.includes('emergency')) return 'text-red-600 bg-red-50 border border-red-200';

  return 'text-gray-600 bg-gray-50 border border-gray-200';
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
  }
  else if (lowerName.includes('youth crisis') || lowerName.includes('teen') || lowerName.includes('child')) {
    return 'Youth';
  }
   else if (lowerName.includes('homeless') || lowerName.includes('housing') || lowerName.includes('shelter') || lowerName.includes('rescue') || lowerName.includes('mission')) {
    return 'Homelessness';
  } else if (lowerName.includes('elder') || lowerName.includes('senior')) {
    return 'Elder Care';
  }  else if (lowerName.includes('gambling') || lowerName.includes('financial')) {
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
  const [currentView, setCurrentView] = useState('categories'); // 'categories', 'specific-providers', or 'provider-details'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('7 Days');
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [callsLoading, setCallsLoading] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [categoryCallCounts, setCategoryCallCounts] = useState({});
  const [providerCallCounts, setProviderCallCounts] = useState({});
  const [tableHeight, setTableHeight] = useState(600); // Default height for call history table
  const [countsLoading, setCountsLoading] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const tableRef = useRef(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Provider phone numbers from storeCalls.js organized by category
  const providerPhoneNumbers = {
    'mental-health': {
      name: 'Mental Health',
      description: 'Crisis intervention and mental health support services',
      icon: '🧠',
      color: 'purple',
      phones: [
        '+19889882222', '+18556627474', '+15052773013', '+15052560288', '+15052722800'
      ]
    },
    'substance-abuse': {
      name: 'Substance Use / Addiction',
      description: 'Detox, treatment, and recovery support services',
      icon: '💊',
      color: 'blue',
      phones: [
        '+15058418978', '+15054681555', '+15052661900', '+15059078311'
      ]
    },
    'domestic-violence': {
      name: 'Domestic Violence',
      description: 'Safe shelter and support for victims of domestic violence',
      icon: '❤️',
      color: 'pink',
      phones: [
        '+18007997233', '+15052474219', '+18007733645', '+15052483165',
        '+15058439123', '+15052468972'
      ]
    },
    'youth-crisis': {
      name: 'Youth Crisis',
      description: 'Emergency support and intervention for youth in crisis',
      icon: '👦',
      color: 'green',
      phones: [
        '+15052609912', '+18553337233', '+15055919444'
      ]
    },
    'lgbtq-identity': {
      name: 'LGBTQ+ Identity',
      description: 'Support services for LGBTQ+ identity and related crises',
      icon: '🏳️‍🌈',
      color: 'teal',
      phones: [
        '+18664887386', '+15052009086'
      ]
    },
    'elder-concern': {
      name: 'Elder Concern',
      description: 'Support services and care for elderly individuals',
      icon: '👴',
      color: 'indigo',
      phones: [
        '+18666543219', '+15058086325'
      ]
    },
    'homelessness': {
      name: 'Homelessness',
      description: 'Emergency shelter, meals, and housing assistance',
      icon: '🏠',
      color: 'orange',
      phones: [
        '+15053495340', '+15058426491', '+15057244604', '+15053498861'
      ]
    },
    'gambling': {
      name: 'Gambling',
      description: 'Treatment and support for gambling addiction recovery',
      icon: '🎲',
      color: 'red',
      phones: [
        '+18335454357'
      ]
    },
    'escalated-emergency': {
      name: 'Escalated to Emergency',
      description: 'Calls escalated to emergency services (911)',
      icon: '🚨',
      color: 'red',
      phones: []
    }
  };

  // Provider data mapping from JSON
  const providerData = {
    "+19889882222": {
      "issue": "Crisis & Suicide",
      "provider_name": "988 Suicide & Crisis Lifeline"
    },
    "+18556627474": {
      "issue": "Crisis & Suicide",
      "provider_name": "988 Suicide & Crisis Lifeline"
    },
    "+15052773013": {
      "issue": "Crisis & Suicide",
      "provider_name": "NM Crisis and Access Line (NMCAL)"
    },
    "+15052560288": {
      "issue": "Crisis & Suicide",
      "provider_name": "AGORA Crisis Center (UNM)"
    },
    "+15052722800": {
      "issue": "Crisis & Suicide",
      "provider_name": "NM Crisis and Access Line (NMCAL)"
    },
    "+15058418978": {
      "issue": "Substance Use & Alcohol",
      "provider_name": "Bernalillo County CARE Campus Detox (MATS)"
    },
    "+15054681555": {
      "issue": "Substance Use & Alcohol",
      "provider_name": "Turquoise Lodge Hospital"
    },
    "+15052661900": {
      "issue": "Substance Use & Alcohol",
      "provider_name": "Alcoholics Anonymous (AA) – Albuquerque Central"
    },
    "+15059078311": {
      "issue": "Substance Use & Alcohol",
      "provider_name": "Alcoholics Anonymous (AA) – Albuquerque Central"
    },
    "+15052474219": {
      "issue": "Domestic Violence",
      "provider_name": "S.A.F.E. House (DV Hotline & Shelter)"
    },
    "+18007733645": {
      "issue": "Domestic Violence",
      "provider_name": "National Domestic Violence Hotline"
    },
    "+18007997233": {
      "issue": "Domestic Violence",
      "provider_name": "National Domestic Violence Hotline"
    },
    "+15052483165": {
      "issue": "Domestic Violence",
      "provider_name": "Domestic Violence Resource Center (DVRC)"
    },
    "+15058439123": {
      "issue": "Domestic Violence",
      "provider_name": "S.A.F.E. House (DV Hotline & Shelter)"
    },
    "+15052468972": {
      "issue": "Domestic Violence",
      "provider_name": "Domestic Violence Resource Center (DVRC)"
    },
    "+15052609912": {
      "issue": "Youth Crisis / Runaway / Family Issues",
      "provider_name": "New Day Youth Shelter"
    },
    "+18553337233": {
      "issue": "Youth Crisis / Runaway / Family Issues",
      "provider_name": "New Day Youth Shelter"
    },
    "+15055919444": {
      "issue": "Youth Crisis / Runaway / Family Issues",
      "provider_name": "New Day Youth Shelter"
    },
    "+18664887386": {
      "issue": "LGBTQ+ Identity / Distress",
      "provider_name": "Transgender Resource Center of NM (TGRCNM)"
    },
    "+15052009086": {
      "issue": "LGBTQ+ Identity / Distress",
      "provider_name": "Transgender Resource Center of NM (TGRCNM)"
    },
    "+18666543219": {
      "issue": "Elder Concern / Isolation / Neglect",
      "provider_name": "Aging & Disability Resource Center (ADRC)"
    },
    "+15058086325": {
      "issue": "Elder Concern / Isolation / Neglect",
      "provider_name": "Aging & Disability Resource Center (ADRC)"
    },
    "+15053495340": {
      "issue": "Food / Housing / Money / Basic Needs",
      "provider_name": "Roadrunner Food Bank"
    },
    "+15058426491": {
      "issue": "Food / Housing / Money / Basic Needs",
      "provider_name": "Storehouse New Mexico"
    },
    "+15057244604": {
      "issue": "Food / Housing / Money / Basic Needs",
      "provider_name": "The Rock at Noonday"
    },
    "+15053498861": {
      "issue": "Food / Housing / Money / Basic Needs",
      "provider_name": "Storehouse New Mexico"
    },
    "+18335454357": {
      "issue": "Gambling / Financial Ruin",
      "provider_name": "Gambling Addiction Help"
    }
  };

  const serviceCategories = Object.entries(providerPhoneNumbers).map(([id, data]) => {
    const uniqueProviders = new Set();
    data.phones.forEach(phone => {
      if (providerData[phone]) {
        uniqueProviders.add(providerData[phone].provider_name);
      }
    });
  
    return {
      id,
      name: data.name,
      description: data.description,
      providers: uniqueProviders.size, // ✅ count of unique providers
      callsRouted: 0,
      icon: data.icon,
      color: data.color
    };
  });
  

  // Helper function to format phone numbers beautifully
  const formatPhoneNumberBeautiful = (phone) => {
    if (!phone) return 'N/A';
    // Format as (XXX) XXX-XXXX
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  // Helper function to copy phone number to clipboard
  const copyToClipboard = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setToastMessage('Number copied to clipboard');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
    }
  };

  // Function to fetch call counts for categories and providers
  const fetchCallCounts = async () => {
    try {
      setCountsLoading(true);
      console.log('🔍 Starting fetchCallCounts...');
      
      const categoryProviderMap = {
        'mental-health': 'mental',
        'domestic-violence': 'domestic',
        'substance-abuse': 'substance',
        'homelessness': 'homeless',
        'youth-crisis': 'youth',
        'lgbtq-identity': 'lgbtq',
        'elder-concern': 'elder',
        'gambling': 'gambling',
        'escalated-emergency': 'emergency'
      };

      // Fetch category call counts
      const categoryCounts = {};
      for (const [categoryId, providerKey] of Object.entries(categoryProviderMap)) {
        try {
          const params = new URLSearchParams({ 
            page: '1',
            limit: '1',
            provider: providerKey 
          });
          
          console.log(`🔍 Fetching calls for ${categoryId} (${providerKey}): ${API_BASE_URL}/calls?${params}`);
          
          const response = await fetch(`${API_BASE_URL}/calls?${params}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`📊 Response for ${categoryId}:`, data);
            
            if (data.success) {
              const count = data.data.pagination?.totalItems || 0;
              categoryCounts[categoryId] = count;
              console.log(`✅ ${categoryId}: ${count} calls`);
            } else {
              console.error(`❌ API error for ${categoryId}:`, data.message);
              categoryCounts[categoryId] = 0;
            }
          } else {
            console.error(`❌ HTTP error for ${categoryId}:`, response.status);
            categoryCounts[categoryId] = 0;
          }
        } catch (err) {
          console.error(`❌ Error fetching ${categoryId}:`, err);
          categoryCounts[categoryId] = 0;
        }
      }
      
      console.log('📊 Final category counts:', categoryCounts);
      setCategoryCallCounts(categoryCounts);

      // Fetch provider call counts (same logic but store in different state)
      const providerCounts = {};
      for (const [categoryId, providerKey] of Object.entries(categoryProviderMap)) {
        providerCounts[providerKey] = categoryCounts[categoryId] || 0;
      }
      
      console.log('📊 Final provider counts:', providerCounts);
      setProviderCallCounts(providerCounts);

    } catch (err) {
      console.error('❌ Error in fetchCallCounts:', err);
    } finally {
      setCountsLoading(false);
    }
  };

  const fetchCategoryCallCounts = async () => {
    try {
      setCountsLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '1',
        days: timeFilter === 'Today' || timeFilter === '24 Hours' ? '1' : timeFilter.replace(' Days','')
      });
  
      const response = await fetch(`${API_BASE_URL}/calls?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
  
      if (data.success) {
        const countsByCategory = {};
        const countsByProvider = {};
  
        // Use counts returned from backend
        const countsPerNiche = data.data.countsPerNiche || {};
        const countsPerProvider = data.data.countsPerProvider || {};
  
        Object.entries(countsPerNiche).forEach(([niche, count]) => {
          // Map backend niche names to frontend category IDs
          switch(niche) {
            case 'Mental Health / Suicide / Emotional Distress': countsByCategory['mental-health'] = count; break;
            case 'Substance Use / Alcohol / Addiction': countsByCategory['substance-abuse'] = count; break;
            case 'Domestic Violence / Abuse / Unsafe Relationship': countsByCategory['domestic-violence'] = count; break;
            case 'Youth Crisis / Runaway / Family Issues': countsByCategory['youth-crisis'] = count; break;
            case 'LGBTQ+ Identity / Distress': countsByCategory['lgbtq-identity'] = count; break;
            case 'Elder Concern / Isolation / Neglect': countsByCategory['elder-concern'] = count; break;
            case 'Food / Housing / Money / Basic Needs': countsByCategory['homelessness'] = count; break;
            case 'Gambling / Financial Ruin': countsByCategory['gambling'] = count; break;
            case 'Emergency': countsByCategory['escalated-emergency'] = count; break;
            default: break;
          }
        });
  
        Object.entries(countsPerProvider).forEach(([providerName, count]) => {
          countsByProvider[providerName] = count;
        });
  
        setCategoryCallCounts(countsByCategory);
        setProviderCallCounts(countsByProvider);
      }
    } catch (err) {
      console.error('Error fetching category call counts:', err);
    } finally {
      setCountsLoading(false);
    }
  };
  

  // Fetch call counts for specific providers
  const fetchProviderCallCounts = async (providers) => {
    try {
      setCountsLoading(true);
      const counts = {};
      
      console.log('Fetching call counts for providers:', providers);
      
      for (const provider of providers) {
        try {
          let totalCalls = 0;
          
          console.log(`Processing provider: ${provider.name}`);
          
          // Search specifically by provider_name field to get accurate counts
          const params = new URLSearchParams({
            page: '1',
            limit: '1',
            search: provider.name
          });
          
          console.log(`Searching for provider name: ${provider.name} with URL: ${API_BASE_URL}/calls?${params}`);
          
          const response = await fetch(`${API_BASE_URL}/calls?${params}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Response for provider name ${provider.name}:`, data);
            if (data.success) {
              totalCalls = data.data.pagination?.totalItems || 0;
              console.log(`Provider name search found ${totalCalls} calls`);
            }
          }
          
          console.log(`Total calls for ${provider.name}: ${totalCalls}`);
          counts[provider.name] = totalCalls;
        } catch (err) {
          console.error(`Error fetching count for ${provider.name}:`, err);
          counts[provider.name] = 0;
        }
      }
      
      console.log('Final counts:', counts);
      setProviderCallCounts(prev => ({ ...prev, ...counts }));
    } catch (err) {
      console.error('Error fetching provider call counts:', err);
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
        'lgbtq-identity': 'lgbtq',
        'elder-concern': 'elder',
        'gambling': 'gambling',
        'escalated-emergency': 'emergency'
      };
      
      if (categoryProviderMap[categoryId]) {
        params.append('provider', categoryProviderMap[categoryId]);
      }

      // time filter mapping
      const daysMap = {
        'Today': '1',
        '24 Hours': '1',
        '7 Days': '7',
        '30 Days': '30'
      };
      const days = daysMap[timeFilter] || '7';
      params.append('days', days);
      
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

  // Helper function to get specific providers for a category
  const getSpecificProvidersForCategory = (categoryId) => {
    const categoryPhones = providerPhoneNumbers[categoryId]?.phones || [];
    const providersMap = new Map();
    
    categoryPhones.forEach(phone => {
      const providerInfo = providerData[phone];
      if (providerInfo) {
        const providerName = providerInfo.provider_name;
        if (!providersMap.has(providerName)) {
          providersMap.set(providerName, {
            name: providerName,
            issue: providerInfo.issue,
            phones: []
          });
        }
        providersMap.get(providerName).phones.push(phone);
      }
    });
    
    return Array.from(providersMap.values());
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('specific-providers');
    setLoading(true);
    
    // Get specific providers for this category and fetch their call counts
    const specificProviders = getSpecificProvidersForCategory(category.id);
    fetchProviderCallCounts(specificProviders);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setCurrentView('provider-details');
    setLoading(true);
    
    // Fetch calls for this category
    fetchCallsForCategory(selectedCategory.id);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setSelectedProvider(null);
    setSearchTerm('');
    setSelectedPhone(null);
  };

  const handleBackToProviders = () => {
    setCurrentView('specific-providers');
    setSelectedProvider(null);
    setSelectedPhone(null);
  };

  // Auto-scroll to table when a phone is selected
  useEffect(() => {
    if (selectedPhone && tableRef.current) {
      try {
        tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {}
    }
  }, [selectedPhone]);

  // Fetch call counts on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, fetching call counts...');
    fetchCategoryCallCounts();
  }, []);

  // Refresh call counts when returning to categories view
  useEffect(() => {
    if (currentView === 'categories') {
      console.log('🔄 Current view changed to categories, refreshing call counts...');
      fetchCategoryCallCounts();
    }
  }, [currentView]);

  // Color function for category cards (different from call history table)
  const getCategoryCardColor = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      orange: 'bg-orange-100 text-orange-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      teal: 'bg-teal-100 text-teal-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  // Background colors for provider cards per category
  const getCategoryCardBg = (color) => {
    const bgColors = {
      purple: 'bg-purple-50',
      pink: 'bg-pink-50',
      orange: 'bg-orange-50',
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      teal: 'bg-teal-50',
      indigo: 'bg-indigo-50',
      red: 'bg-red-50'
    };
    return bgColors[color] || 'bg-gray-50';
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
    if (shortName.includes('lgbtq') || shortName.includes('identity')) return 'text-teal-600 bg-teal-50 border border-teal-200';
    if (shortName.includes('gambling')) return 'text-red-600 bg-red-50 border border-red-200';
    if (shortName.includes('escalated') || shortName.includes('emergency')) return 'text-red-600 bg-red-50 border border-red-200';
    
    return 'text-gray-600 bg-gray-50 border border-gray-200';
  };

  const filteredProviders = selectedCategory && providerPhoneNumbers[selectedCategory.id] 
    ? providerPhoneNumbers[selectedCategory.id].phones.filter(phone =>
        phone.includes(searchTerm) || formatPhoneNumberBeautiful(phone).includes(searchTerm)
      )
    : [];

  // Get filtered specific providers for the intermediate view
  const filteredSpecificProviders = selectedCategory 
    ? getSpecificProvidersForCategory(selectedCategory.id).filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.issue.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get filtered phones for the selected provider
  const filteredProviderPhones = selectedProvider 
    ? selectedProvider.phones.filter(phone =>
        phone.includes(searchTerm) || formatPhoneNumberBeautiful(phone).includes(searchTerm)
      )
    : [];

  const isEscalatedCategory = selectedCategory?.id === 'escalated-emergency';

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
    <div className="flex-1 flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground">Service Providers</h1>
          {/* Copy toast */}
          {showToast && (
            <div className="fixed top-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
              {toastMessage}
            </div>
          )}
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
      <main className="flex-1 bg-gray-50 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-4 md:py-6 pb-40">
        {currentView === 'categories' ? (
          <>
            {/* Categories View */}
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Service Provider Network</h2>
                  <p className="text-muted-foreground">Browse providers by service category to route calls effectively</p>
                </div>
                <button
                  onClick={fetchCategoryCallCounts}
                  disabled={countsLoading}
                  className="self-start md:self-auto flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className={`w-4 h-4 mr-2 ${countsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {countsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

{/* Category cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-16">
  {serviceCategories.map(category => (
    <div
      key={category.id}
      onClick={() => handleCategoryClick(category)}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative w-full"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${getCategoryCardColor(category.color)}`}>
        {category.icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{category.description}</p>

      <div className="flex items-center space-x-4 pt-4 border-t border-gray-100 mt-4">
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold text-gray-900">{category.providers}</span>
          <span className="text-xs text-gray-500">Providers</span>
        </div>
        <div className="h-8 w-px bg-gray-300"></div>
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
    </div>
  ))}
</div>

            <div className="h-16 md:h-20" />
          </>
        ) : currentView === 'specific-providers' ? (
          <>
            {/* Specific Providers View */}
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
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{selectedCategory.name} Providers</h2>
                  <p className="text-muted-foreground">{filteredSpecificProviders.length} providers available</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex w-max ${getCategoryCardColor(selectedCategory.color)}`}>
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

            {/* Specific Providers Grid */}
            {filteredSpecificProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {filteredSpecificProviders.map((provider, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 transform ${getCategoryCardBg(selectedCategory.color)} hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] cursor-pointer w-full`}
                    onClick={() => handleProviderClick(provider)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{provider.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{provider.issue}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                          <div className="flex flex-col items-start">
                            <span className="text-xl font-bold text-gray-900">{provider.phones.length}</span>
                            <span className="text-xs text-gray-500">Phone Number</span>
                          </div>
                          <div className="h-8 w-px bg-gray-300"></div>
                          <div className="flex flex-col items-start">
                            <span className="text-xl font-bold text-teal-500">
                              {countsLoading ? (
                                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                providerCallCounts[provider.name] || 0
                              )}
                            </span>
                            <span className="text-xs text-gray-500">Calls Routed</span>
                          </div>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No providers match your search criteria.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Provider Details View */}
            <div className="mb-6">
              <button
                onClick={handleBackToProviders}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {selectedCategory.name} providers
              </button>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{selectedProvider.name} Phone Numbers</h2>
                  <p className="text-muted-foreground">Showing recent call history only</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex w-max ${getCategoryCardColor(selectedCategory.color)}`}>
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
                    placeholder="Search by phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Phone Numbers Grid - visible for all except Escalated to Emergency */}
            {!isEscalatedCategory && (
              filteredProviderPhones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {filteredProviderPhones.map((phone, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 transform ${getCategoryCardBg(selectedCategory.color)} hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] cursor-pointer w-full`}
                      onClick={() => setSelectedPhone(phone)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/70 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="text-2xl font-bold text-gray-900 font-mono tracking-wide">{formatPhoneNumberBeautiful(phone)}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(phone)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white/70 rounded-lg transition-colors"
                          title="Copy phone number"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No phone numbers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No phone numbers match your search criteria.
                  </p>
                </div>
              )
            )}

            {/* Call History Table */}
            <div ref={tableRef} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-foreground">Call History ({selectedPhone ? calls.filter(c => c.phone_number && c.phone_number.trim() === selectedPhone).length : calls.filter(c => selectedProvider && selectedProvider.phones.includes(c.phone_number)).length})</h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              {selectedPhone && (
                <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-start justify-between hidden md:flex">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm-2 8a1 1 0 102 0v-4a1 1 0 10-2 0v4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-blue-800">Showing calls redirected to {formatPhoneNumberBeautiful(selectedPhone)}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPhone(null)} className="text-sm font-medium text-blue-700 hover:text-blue-900">Clear Filter</button>
                </div>
              )}
              {/* Desktop table */}
              <div className="overflow-x-auto hidden md:block">
                {callsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading calls...</span>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-32">Time</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-32">Caller ID</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-32">Niche</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-64">Routed Provider</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">Sentiment</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">Call Success</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-20">Duration</th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-32">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {calls
                        .filter(call => {
                          if (selectedPhone) {
                            return call.phone_number && call.phone_number.trim() === selectedPhone;
                          }
                          if (selectedProvider) {
                            return selectedProvider.phones.includes(call.phone_number);
                          }
                          return true;
                        })
                        .map((call) => (
                        <tr key={call.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-1 py-5 text-sm text-muted-foreground text-center w-32">
                            {formatDateTime(call.createdAt)}
                          </td>
                          <td className="px-2 py-5 text-sm text-left w-32">
                            <div className="text-foreground font-medium ml-1">
                              {formatCallIdShort(call.call_id)}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center w-32">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(call.niche || call.provider_name, call)}`}>
                                {call.niche || getShortProviderName(call.provider_name, call)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-sm text-foreground text-center w-64">
                            <div className="break-words max-w-64">
                              {call.provider_name || 'Unknown Provider'}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center w-24">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                call.user_sentiment === 'Positive' ? 'text-white bg-green-500' :
                                call.user_sentiment === 'Neutral' ? 'text-white bg-blue-500' :
                                call.user_sentiment === 'Negative' ? 'text-white bg-red-500' :
                                'text-gray-600 bg-gray-200'
                              }`}>
                                {call.user_sentiment || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center w-24">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                call.call_successful === true ? 'text-green-600 bg-green-50 border border-green-200' :
                                call.call_successful === false ? 'text-red-600 bg-red-50 border border-red-200' :
                                'text-gray-600 bg-gray-50 border border-gray-200'
                              }`}>
                                {call.call_successful === true ? 'Success' :
                                 call.call_successful === false ? 'Failed' : 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-sm text-muted-foreground font-mono text-center w-20">
                            {formatDuration(call.duration_ms)}
                          </td>
                          <td className="px-4 py-5 text-center w-32">
                            <div className="flex justify-center">
                              <button
                                onClick={() => setSelectedCall(call)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!callsLoading && calls.filter(call => {
                  if (selectedPhone) {
                    return call.phone_number && call.phone_number.trim() === selectedPhone;
                  }
                  if (selectedProvider) {
                    return selectedProvider.phones.includes(call.phone_number);
                  }
                  return true;
                }).length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-foreground">No calls found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No calls match the selected filter.
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile stacked cards (match Calls.jsx style) */}
              <div className="md:hidden px-4 pb-32">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="text-lg font-semibold text-gray-900">Call History ({selectedPhone ? calls.filter(c => c.phone_number && c.phone_number.trim() === selectedPhone).length : calls.filter(c => selectedProvider && selectedProvider.phones.includes(c.phone_number)).length})</div>
                  <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
                </div>
                {selectedPhone && (
                  <div className="mt-1 mb-2 px-4 py-3 bg-blue-50 border-t border-b border-blue-200 flex items-start justify-between">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm-2 8a1 1 0 102 0v-4a1 1 0 10-2 0v4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-blue-800">Showing calls redirected to {formatPhoneNumberBeautiful(selectedPhone)}</div>
                    </div>
                    <button onClick={() => setSelectedPhone(null)} className="text-sm font-medium text-blue-700 hover:text-blue-900">Clear Filter</button>
                  </div>
                )}
                <div className="divide-y divide-gray-200 text-[15px]">
                {callsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  calls
                    .filter(call => {
                      if (selectedPhone) {
                        return call.phone_number && call.phone_number.trim() === selectedPhone;
                      }
                      if (selectedProvider) {
                        return selectedProvider.phones.includes(call.phone_number);
                      }
                      return true;
                    })
                    .map((call) => (
                      <div key={call.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">{formatDateTime(call.createdAt)}</div>
                          <div className="text-xs text-gray-500 font-mono">{formatDuration(call.duration_ms)}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">
                          {formatPhoneNumber(call.phone_number || call.from_number)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getProviderCategoryColor(call.provider_name, call)}`}>
                            {getShortProviderName(call.provider_name, call)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            call.user_sentiment === 'Positive' ? 'text-white bg-green-500' :
                            call.user_sentiment === 'Neutral' ? 'text-white bg-blue-500' :
                            call.user_sentiment === 'Negative' ? 'text-white bg-red-500' :
                            'text-gray-600 bg-gray-200'
                          }`}>
                            {call.user_sentiment || 'N/A'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            call.call_successful === true ? 'text-green-600 bg-green-50 border border-green-200' :
                            call.call_successful === false ? 'text-red-600 bg-red-50 border border-red-200' :
                            'text-gray-600 bg-gray-50 border border-gray-200'
                          }`}>
                            {call.call_successful === true ? 'Success' : call.call_successful === false ? 'Failed' : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => setSelectedCall(call)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                )}
                </div>
              </div>

              {/* Bottom spacer to prevent last section cut off on mobile */}
              <div className="h-16 md:h-0" />
              
              {/* Table uses main page scroll; no internal resizer */}
            </div>
          </>
        )}
      </main>
      {/* Global bottom spacer to prevent last section cut on mobile browsers */}
      <div className="h-24 md:h-0" />

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
            <div className="p-6 pb-56 space-y-6" style={{ paddingBottom: 'calc(14rem + env(safe-area-inset-bottom, 0px))' }}>
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
                <div className="mb-24">
                  <label className="text-sm font-medium text-gray-600">Recording</label>
                  <div className="mt-2">
                    <AudioPlayer audioUrl={selectedCall.recording_url} callId={selectedCall.call_id} />
                  </div>
                </div>
              )}

              <div className="h-24 md:h-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Provider;
