import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Loading from './components/UI/Loading';
import './styles/global.css';
import './styles/animations.css';

// Lazy loading для оптимизации
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const StudioPage = lazy(() => import('./pages/Dashboard/StudioPage'));
const FeedPage = lazy(() => import('./pages/Dashboard/FeedPage'));
const MessagesPage = lazy(() => import('./pages/Dashboard/MessagesPage'));
const ProfilePage = lazy(() => import('./pages/Dashboard/ProfilePage'));
const SubscriptionPage = lazy(() => import('./pages/Dashboard/SubscriptionPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const GlobalStyle = createGlobalStyle`
  /* Дополнительные глобальные стили */
  body {
    &::-webkit-scrollbar {
      width: 12px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--bg-secondary);
    }
    
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 6px;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const LoadingFallback = () => (
  <LoadingOverlay>
    <Loading />
  </LoadingOverlay>
);

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Dashboard Routes (Protected) */}
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<Navigate to="studio" replace />} />
              <Route path="studio" element={<StudioPage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
            </Route>
            
            {/* Redirects */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/signin" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<Navigate to="/register" replace />} />
            <Route path="/chat" element={<Navigate to="/dashboard/messages" replace />} />
            <Route path="/music" element={<Navigate to="/dashboard/feed" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppContainer>
    </Router>
  );
}

export default App;
