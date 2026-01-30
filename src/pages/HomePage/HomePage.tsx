import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 20px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const QuickAccess = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const QuickAccessButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: '🎵',
      title: 'Мощная студия',
      description: 'Полноценный DAW в браузере с профессиональными инструментами для создания музыки.'
    },
    {
      icon: '👥',
      title: 'Совместная работа',
      description: 'Работайте над проектами в реальном времени с другими музыкантами.'
    },
    {
      icon: '🤖',
      title: 'AI Ассистент',
      description: 'Искусственный интеллект помогает в создании, аранжировке и мастеринге.'
    },
    {
      icon: '📱',
      title: 'Социальная сеть',
      description: 'Делитесь музыкой, находите коллег и вдохновляйтесь работами других.'
    }
  ];
  
  const quickAccess = [
    { label: 'Быстрый старт', icon: '🚀', path: '/studio' },
    { label: 'Популярные треки', icon: '🔥', path: '/feed?filter=popular' },
    { label: 'Найти коллаборацию', icon: '👥', path: '/messages' },
    { label: 'Изучить инструменты', icon: '🎹', path: '/studio?tutorial=true' },
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Создавайте музыку вместе</HeroTitle>
        <HeroSubtitle>
          Первая платформа для совместного создания музыки в реальном времени 
          с AI-ассистентом и профессиональными инструментами.
        </HeroSubtitle>
        <CTAButton onClick={() => navigate('/studio')}>
          🎵 Начать создавать
        </CTAButton>
      </HeroSection>
      
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
      
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Быстрый доступ</h2>
        <QuickAccess>
          {quickAccess.map((item, index) => (
            <QuickAccessButton 
              key={index} 
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </QuickAccessButton>
          ))}
        </QuickAccess>
      </div>
    </HomeContainer>
  );
};

export default HomePage;
