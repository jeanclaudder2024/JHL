import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { WelcomePage } from './pages/WelcomePage';
import { Admin } from './pages/Admin';
import { CorporateApplication } from './pages/CorporateApplication';
import { EventApplication } from './pages/EventApplication';
import { MealDetail } from './pages/MealDetail';
import { AIConcierge } from './components/AIConcierge';
import { LoadingScreen } from './components/LoadingScreen';
import { PageTransition } from './components/PageTransition';
import { User, UserRole } from './types';
import { authApi } from './services/api';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    if (authApi.isLoggedIn()) {
      authApi.getMe().then((userData) => {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          companyName: userData.company?.name
        });
      }).catch(() => {
        authApi.logout();
      });
    }
  }, []);

  const handleLogin = (role: UserRole, userData?: any) => {
    if (userData) {
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        companyName: userData.company?.name || userData.companyName
      });
    } else {
      setUser({
        id: '123',
        name: role === UserRole.ADMIN ? 'JHL Admin' : (role === UserRole.COMPANY_ADMIN ? 'Sarah Jenkins' : 'Jane Doe'),
        email: 'user@example.com',
        role: role,
        companyName: role === UserRole.COMPANY_ADMIN ? 'Aura Creative' : undefined
      });
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} minDuration={3000} />
      )}

      <Router>
        <Layout user={user} onLogout={handleLogout}>
          <PageTransition>
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
                  user ? (
                    user.role === UserRole.GUEST ? <WelcomePage userName={user.name} /> : <Dashboard user={user} />
                  ) : <Navigate to="/auth" />
                }
              />
              <Route
                path="/welcome"
                element={
                  user ? <WelcomePage userName={user.name} /> : <Navigate to="/auth" />
                }
              />
              <Route
                path="/admin"
                element={
                  user?.role === UserRole.ADMIN ? <Admin /> : <Navigate to="/auth" />
                }
              />
              <Route path="/meal/:id" element={<MealDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </PageTransition>

          {/* Global AI Concierge */}
          <AIConcierge />
        </Layout>
      </Router>
    </>
  );
}

export default App;
