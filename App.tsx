import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { CorporateApplication } from './pages/CorporateApplication';
import { EventApplication } from './pages/EventApplication';
import { AIConcierge } from './components/AIConcierge';
import { User, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: '123',
      name: role === UserRole.ADMIN ? 'JHL Admin' : (role === UserRole.COMPANY_ADMIN ? 'Sarah Jenkins' : 'Jane Doe'),
      email: 'user@example.com',
      role: role,
      companyName: role === UserRole.COMPANY_ADMIN ? 'Aura Creative' : undefined
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Home />} /> {/* Reuse Home for demo */}
          <Route path="/corporate-application" element={<CorporateApplication />} />
          <Route path="/event-application" element={<EventApplication />} />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/auth" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user?.role === UserRole.ADMIN ? <Admin /> : <Navigate to="/auth" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Global AI Concierge */}
        <AIConcierge />
      </Layout>
    </Router>
  );
}

export default App;
