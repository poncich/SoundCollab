import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import './styles/global.css';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import HomePage from './pages/HomePage/HomePage';
import StudioPage from './pages/StudioPage/StudioPage';
import FeedPage from './pages/FeedPage/FeedPage';
import MessagesPage from './pages/MessagesPage/MessagesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage/SubscriptionPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #121212 100%);
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            
            {/* Резервные маршруты */}
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="chat" element={<Navigate to="/messages" replace />} />
            <Route path="sub" element={<Navigate to="/subscription" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
