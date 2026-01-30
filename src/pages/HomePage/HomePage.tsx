import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '👥',
      title: 'Умные коллаборации',
      description: 'Находите идеальных партнеров по стилю, навыкам и местоположению',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    {
      icon: '🤖',
      title: 'AI-Ассистент',
      description: 'Генерируйте мелодии, аранжировки и тексты с помощью нейросетей',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    },
    {
      icon: '🎥',
      title: 'Прямые стримы',
      description: 'Создавайте музыку в реальном времени с нулевой задержкой',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    },
    {
      icon: '📊',
      title: 'Аналитика успеха',
      description: 'Отслеживайте статистику и понимайте свою аудиторию',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    },
    {
      icon: '💰',
      title: 'Монетизация',
      description: 'Получайте доход от музыки через умные контракты',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    },
    {
      icon: '🔒',
      title: 'Безопасность прав',
      description: 'Автоматическая регистрация и блокчейн-подтверждение',
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Создайте профиль',
      description: 'Расскажите о своих навыках, загрузите лучшие работы',
    },
    {
      number: '02',
      title: 'Найдите партнеров',
      description: 'Используйте умный поиск или доверьтесь алгоритму',
    },
    {
      number: '03',
      title: 'Создайте проект',
      description: 'Откройте виртуальную студию и начните запись',
    },
    {
      number: '04',
      title: 'Поделитесь с миром',
      description: 'Опубликуйте трек и получите обратную связь',
    },
  ];

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground />
        <HeroContent className="container">
          <HeroBadge>🔥 Новая платформа</HeroBadge>
          <HeroTitle>
            Создавай <span className="text-gradient">музыку</span>. Объединяй{' '}
            <span className="text-gradient">таланты</span>. Меняй{' '}
            <span className="text-gradient">индустрию</span>.
          </HeroTitle>
          <HeroDescription>
            SoundCollab — это революционная платформа для музыкальных коллабораций. 
            Объединяйтесь с музыкантами со всего мира, создавайте уникальные треки 
            с помощью AI и делитесь своим творчеством с миром.
          </HeroDescription>
          <HeroActions>
            <Button
              variant="primary"
              size="lg"
              icon="🚀"
              onClick={() => navigate('/login')}
            >
              Начать бесплатно
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon="▶️"
              onClick={() => {
                // Видео-демо
              }}
            >
              Смотреть демо
            </Button>
          </HeroActions>
          
          <StatsGrid>
            <StatItem>
              <StatNumber>50,000+</StatNumber>
              <StatLabel>Музыкантов</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>15,000+</StatNumber>
              <StatLabel>Треков</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>5,000+</StatNumber>
              <StatLabel>Коллабораций</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Онлайн студия</StatLabel>
            </StatItem>
          </StatsGrid>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Почему выбирают SoundCollab?</SectionTitle>
          <SectionDescription>
            Мы создали идеальную экосистему для музыкантов, продюсеров и творческих личностей
          </SectionDescription>
        </SectionHeader>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} hoverable>
              <FeatureIcon style={{ background: feature.gradient }}>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* Steps Section */}
      <Section dark>
        <SectionHeader>
          <SectionTitle>Как начать творить?</SectionTitle>
          <SectionDescription>
            4 простых шага к вашей первой музыкальной коллаборации
          </SectionDescription>
        </SectionHeader>
        <StepsContainer>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsContainer>
      </Section>

      {/* CTA Section */}
      <CTASection>
        <CTAContent className="container">
          <CTATitle>Готовы изменить мир музыки?</CTATitle>
          <CTADescription>
            Присоединяйтесь к 50,000+ музыкантов, которые уже создают будущее звука
          </CTADescription>
          <CTAActions>
            <Button
              variant="primary"
              size="xl"
              icon="🎵"
              onClick={() => navigate('/login')}
            >
              Присоединиться бесплатно
            </Button>
            <Button
              variant="ghost"
              size="xl"
              onClick={() => navigate('/subscription')}
            >
              Смотреть тарифы →
            </Button>
          </CTAActions>
          <CTAFooter>
            <span>🎯 14 дней бесплатно</span>
            <span>💳 Без кредитной карты</span>
            <span>🔓 Отмена в любой момент</span>
          </CTAFooter>
        </CTAContent>
      </CTASection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 8rem 0 6rem;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  z-index: -1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const HeroBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-full);
  color: #fca5a5;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatsGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  max-width: 800px;
  margin: 0 auto;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: var(--border-color);
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const Section = styled.section<{ dark?: boolean }>`
  padding: 6rem 0;
  background: ${props => props.dark ? 'var(--bg-tertiary)' : 'transparent'};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FeatureCard = styled(Card)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid var(--border-color);
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const StepCard = styled(Card)`
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
  }
`;

const StepNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
  }
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 3rem;
`;

const CTAActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAFooter = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export default HomePage;
