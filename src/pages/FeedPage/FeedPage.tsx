import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FeedContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const FeedTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.active 
    ? 'rgba(102, 126, 234, 0.15)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TrackCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const TrackImage = styled.div<{ color: string }>`
  height: 160px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const TrackContent = styled.div`
  padding: 1.5rem;
`;

const TrackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const TrackArtist = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const ArtistAvatar = styled.div`
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

const TrackStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TrackActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    transform: scale(1.1);
  }
`;

const PlayButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  margin-top: 0.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'popular', label: 'Популярные' },
    { id: 'new', label: 'Новые' },
    { id: 'collabs', label: 'Коллаборации' },
    { id: 'following', label: 'Подписки' },
  ];
  
  const tracks = [
    {
      id: 1,
      title: 'Midnight Drive',
      artist: 'Alex Producer',
      genre: 'Synthwave',
      color: '#667eea',
      plays: '12.5K',
      likes: '1.2K',
      comments: 45,
      duration: '3:45',
      editable: true,
    },
    {
      id: 2,
      title: 'Urban Dreams',
      artist: 'Sarah Beats',
      genre: 'Lo-Fi Hip Hop',
      color: '#764ba2',
      plays: '8.7K',
      likes: '890',
      comments: 32,
      duration: '2:30',
      editable: false,
    },
    {
      id: 3,
      title: 'Neon Lights',
      artist: 'DJ Pulse ft. Maya',
      genre: 'Future Bass',
      color: '#f093fb',
      plays: '24.3K',
      likes: '3.1K',
      comments: 128,
      duration: '4:15',
      editable: true,
    },
    {
      id: 4,
      title: 'Desert Storm',
      artist: 'Beat Collective',
      genre: 'Electronic',
      color: '#f5576c',
      plays: '5.2K',
      likes: '450',
      comments: 18,
      duration: '3:10',
      editable: false,
    },
    {
      id: 5,
      title: 'Ocean View',
      artist: 'Chill Masters',
      genre: 'Chillout',
      color: '#4facfe',
      plays: '15.8K',
      likes: '1.8K',
      comments: 67,
      duration: '5:20',
      editable: true,
    },
    {
      id: 6,
      title: 'Digital Love',
      artist: 'Synth Sisters',
      genre: 'Synthpop',
      color: '#43e97b',
      plays: '9.3K',
      likes: '980',
      comments: 41,
      duration: '3:55',
      editable: false,
    },
  ];

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>🎧 Лента музыки</FeedTitle>
        <Filters>
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </Filters>
      </FeedHeader>
      
      <TracksGrid>
        {tracks.map((track) => (
          <TrackCard key={track.id}>
            <TrackImage color={track.color}>
              {track.editable ? '🎹' : '🎵'}
            </TrackImage>
            
            <TrackContent>
              <TrackHeader>
                <TrackInfo>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackArtist>
                    <ArtistAvatar>
                      {track.artist.charAt(0)}
                    </ArtistAvatar>
                    <span>{track.artist}</span>
                    <span>•</span>
                    <span>{track.genre}</span>
                  </TrackArtist>
                </TrackInfo>
                
                <TrackActions>
                  <ActionButton title="Нравится">❤️</ActionButton>
                  <ActionButton title="Репост">🔄</ActionButton>
                  <ActionButton title="Еще">⋯</ActionButton>
                </TrackActions>
              </TrackHeader>
              
              <TrackStats>
                <StatItem>
                  <span>▶️</span>
                  <span>{track.plays}</span>
                </StatItem>
                <StatItem>
                  <span>❤️</span>
                  <span>{track.likes}</span>
                </StatItem>
                <StatItem>
                  <span>💬</span>
                  <span>{track.comments}</span>
                </StatItem>
                <StatItem>
                  <span>⏱️</span>
                  <span>{track.duration}</span>
                </StatItem>
              </TrackStats>
              
              <PlayButton onClick={() => console.log('Play track', track.id)}>
                <span>▶️</span>
                <span>Слушать</span>
              </PlayButton>
              
              {track.editable && (
                <EditButton onClick={() => navigate('/studio')}>
                  <span>✏️</span>
                  <span>Редактировать в студии</span>
                </EditButton>
              )}
            </TrackContent>
          </TrackCard>
        ))}
      </TracksGrid>
    </FeedContainer>
  );
};

export default FeedPage;
