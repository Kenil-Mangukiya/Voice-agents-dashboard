import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Provider from './pages/Provider';
import Calls from './pages/Calls';
import Login from './pages/Login';

function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('http://localhost:3007/api/users/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and update state
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated (check localStorage or session)
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Navigation onLogout={handleLogout} />
      </div>
      {/* Mobile Sidebar Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileNavOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <Navigation onClose={() => setIsMobileNavOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}
      <div className="flex-1">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            aria-label="Open navigation"
            className="p-2 rounded-lg border border-border text-foreground"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <span className="text-sm font-semibold">Albuquerque Harm Dashboard</span>
          <span className="w-5"/>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/providers" element={<Provider />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
