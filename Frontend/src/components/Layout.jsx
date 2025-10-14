import React, { useState } from 'react';
import Navigation from './Navigation';
import Dashboard from '../pages/dashboard';
import Provider from '../pages/Provider';
import Calls from '../pages/calls';

const Layout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'providers':
        return <Provider />;
      case 'calls':
        return <Calls />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1">
        {renderPage()}
      </div>
    </div>
  );
};

export default Layout;
