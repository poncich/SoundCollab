import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 600;
`;

const EditAvatarButton = styled.button`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
`;

const ProfileBio = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  max-width: 600px;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.primary 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 10px 30px rgba(102, 126, 234, 0.4)' 
      : '0 5px 20px rgba(0, 0, 0, 0.3)'};
  }
`;

const ProfileTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'transparent'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'transparent'};
  border-radius: 10px;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TrackCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const TrackImage = styled.div<{ color: string }>`
  height: 120px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const TrackContent = styled.div`
  padding: 1rem;
`;

const TrackTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const TrackInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Collaborators = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CollaboratorAvatar = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tracks');
  
  const tabs = [
    { id: 'tracks', label: 'Треки', count: 8 },
    { id: 'collabs', label: 'Коллаборации', count: 3 },
    { id: 'playlists', label: 'Плейлисты', count: 2 },
    { id: 'likes', label: 'Понравилось', count: 24 },
    { id: 'about', label: 'О себе' },
  ];
  
  const userStats = [
    { label: 'Треков', value: '8' },
    { label: 'Подписчиков', value: '1.2K' },
    { label: 'Подписок', value: '45' },
    { label: 'Прослушиваний', value: '24.5K' },
    { label: 'Коллабораций', value: '3' },
  ];
  
  const tracks = [
    { id: 1, title: 'Midnight Drive', color: '#667eea', plays: '12.5K', collabs: 2 },
    { id: 2, title: 'Ocean View', color: '#4facfe', plays: '15.8K', collabs: 1 },
    { id: 3, title: 'Neon Lights', color: '#f093fb', plays: '24.3K', collabs: 3 },
    { id: 4, title: 'Desert Storm', color: '#f5576c', plays: '5.2K', collabs: 0 },
    { id: 5, title: 'Digital Love', color: '#43e97b', plays: '9.3K', collabs: 1 },
    { id: 6, title: 'Urban Dreams', color: '#764ba2', plays: '8.7K', collabs: 2 },
  ];
  
  const collaborators = ['AP', 'SB', 'BC', 'SS'];

  const renderContent = () => {
    switch (activeTab) {
      case 'tracks':
        return (
          <ContentGrid>
            {tracks.map((track) => (
              <TrackCard key={track.id}>
                <TrackImage color={track.color}>🎵</TrackImage>
                <TrackContent>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackInfo>
                    <div>▶️ {track.plays}</div>
                    {track.collabs > 0 && (
                      <Collaborators>
                        <span>👥</span>
                        <span>{track.collabs}</span>
                      </Collaborators>
                    )}
                  </TrackInfo>
                </TrackContent>
              </TrackCard>
            ))}
          </ContentGrid>
        );
        
      case 'collabs':
        return (
          <ContentGrid>
            {tracks.filter(t => t.collabs > 0).map((track) => (
              <TrackCard key={track.id}>
                <TrackImage color={track.color}>👥</TrackImage>
                <TrackContent>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackInfo>
                    <div>Совместный проект</div>
                    <Collaborators>
                      {collaborators.slice(0, 3).map((collab, i) => (
                        <CollaboratorAvatar key={i}>{collab}</CollaboratorAvatar>
                      ))}
                      {collaborators.length > 3 && (
                        <span style={{ fontSize: '0.75rem' }}>+{collaborators.length - 3}</span>
                      )}
                    </Collaborators>
                  </TrackInfo>
                </TrackContent>
              </TrackCard>
            ))}
          </ContentGrid>
        );
        
      case 'about':
        return (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            padding: '2rem', 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>О себе</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem' 
            }}>
              <div>
                <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>Навыки</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Битмейкинг', 'Сведение', 'Синтез', 'Гитарные партии', 'Вокал'].map((skill) => (
                    <div key={skill} style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '20px',
                      fontSize: '0.875rem'
                    }}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>Оборудование</h3>
                <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <li>DAW: FL Studio, Ableton</li>
                  <li>Контроллер: MIDI Keyboard</li>
                  <li>Аудиоинтерфейс: Focusrite Scarlett</li>
                  <li>Микрофон: Rode NT1-A</li>
                </ul>
              </div>
              
              <div>
                <h3 style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>Контакты</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📧</span>
                    <span>email@example.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🌐</span>
                    <span>soundcloud.com/user</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎵</span>
                    <span>spotify.com/artist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Здесь пока ничего нет
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', maxWidth: '400px' }}>
              {activeTab === 'playlists' 
                ? 'Создайте свой первый плейлист, чтобы сохранять понравившиеся треки'
                : 'Здесь будут отображаться материалы выбранной категории'}
            </div>
            {activeTab === 'playlists' && (
              <ActionButton 
                primary 
                style={{ marginTop: '1.5rem' }}
                onClick={() => console.log('Create playlist')}
              >
                <span>➕</span>
                <span>Создать плейлист</span>
              </ActionButton>
            )}
          </EmptyState>
        );
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <Avatar>AP</Avatar>
          <EditAvatarButton>
            <span>✏️</span>
            <span>Изменить фото</span>
          </EditAvatarButton>
        </AvatarSection>
        
        <ProfileInfo>
          <ProfileName>Alex Producer</ProfileName>
          <ProfileBio>
            Битмейкер и саунд-дизайнер из Москвы. Создаю музыку в жанрах 
            synthwave, future bass и lo-fi. Люблю экспериментировать со звуками 
            и коллаборации с другими музыкантами.
          </ProfileBio>
          
          <ProfileStats>
            {userStats.map((stat, index) => (
              <StatItem key={index}>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </ProfileStats>
          
          <ProfileActions>
            <ActionButton primary onClick={() => navigate('/studio')}>
              <span>🎵</span>
              <span>Создать новый трек</span>
            </ActionButton>
            <ActionButton>
              <span>✏️</span>
              <span>Редактировать профиль</span>
            </ActionButton>
            <ActionButton>
              <span>🔗</span>
              <span>Поделиться</span>
            </ActionButton>
          </ProfileActions>
        </ProfileInfo>
      </ProfileHeader>
      
      <ProfileTabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{ 
                marginLeft: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.125rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            )}
          </Tab>
        ))}
      </ProfileTabs>
      
      {renderContent()}
    </ProfileContainer>
  );
};

export default ProfilePage;
