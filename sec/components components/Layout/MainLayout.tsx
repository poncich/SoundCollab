import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #121212 100%);
  color: white;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.aside`
  width: 260px;
  background: rgba(16, 18, 24, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.$active ? 'rgba(102, 126, 234, 0.15)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'rgba(102, 126, 234, 0.3)' : 'transparent'};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    transform: translateX(4px);
  }
`;

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const NavLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

const UserSection = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserStatus = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
`;

const navigationItems = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/studio', label: 'Студия', icon: '🎵' },
  { path: '/feed', label: 'Лента', icon: '📱' },
  { path: '/messages', label: 'Чат', icon: '💬' },
  { path: '/profile', label: 'Профиль', icon: '👤' },
  { path: '/subscription', label: 'Подписки', icon: '⭐' },
];

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>
          <LogoIcon>🎹</LogoIcon>
          <LogoText>SoundCollab</LogoText>
        </Logo>
        
        <NavList>
          {navigationItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          ))}
        </NavList>
        
        <UserSection>
          <UserProfile>
            <UserAvatar>U</UserAvatar>
            <UserInfo>
              <UserName>Имя Пользователя</UserName>
              <UserStatus>Online • Pro</UserStatus>
            </UserInfo>
          </UserProfile>
        </UserSection>
      </Sidebar>
      
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;
