import React, { useState } from 'react';
import styled from 'styled-components';

const SubscriptionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const PlanCard = styled.div<{ featured?: boolean }>`
  background: ${props => props.featured 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))' 
    : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.featured 
    ? 'rgba(102, 126, 234, 0.3)' 
    : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PlanName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: white;
`;

const PlanPeriod = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

const PlanDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)'};
`;

const FeatureIcon = styled.span<{ disabled?: boolean }>`
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.3)' : '#10b981'};
`;

const SubscribeButton = styled.button<{ featured?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: ${props => props.featured 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.featured 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.featured 
      ? '0 10px 30px rgba(102, 126, 234, 0.4)' 
      : '0 5px 20px rgba(0, 0, 0, 0.3)'};
  }
`;

const CurrentPlanBadge = styled.div`
  width: 100%;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  color: #10b981;
  font-weight: 600;
  text-align: center;
`;

const FAQSection = styled.div`
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const FAQTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const FAQItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
`;

const FAQQuestion = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FAQAnswer = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const ComparisonTable = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 2rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const TableHeaderCell = styled.div<{ center?: boolean }>`
  font-weight: 600;
  color: white;
  text-align: ${props => props.center ? 'center' : 'left'};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div<{ center?: boolean }>`
  color: rgba(255, 255, 255, 0.9);
  text-align: ${props => props.center ? 'center' : 'left'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckIcon = styled.span`
  color: #10b981;
  font-weight: bold;
`;

const CrossIcon = styled.span`
  color: #ef4444;
  font-weight: bold;
`;

const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<string | null>('free');
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0₽',
      period: 'навсегда',
      description: 'Базовые функции для начинающих',
      featured: false,
      features: [
        { text: '3 активных проекта', included: true },
        { text: '5 дорожек на проект', included: true },
        { text: 'Базовые эффекты', included: true },
        { text: 'Экспорт в MP3 128kbps', included: true },
        { text: 'Публикация на платформе', included: true },
        { text: 'Коллаборации до 2 человек', included: false },
        { text: 'AI инструменты', included: false },
        { text: 'Расширенные эффекты', included: false },
        { text: 'Приоритетная поддержка', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '999₽',
      period: 'в месяц',
      description: 'Для серьезных музыкантов и продюсеров',
      featured: true,
      features: [
        { text: 'Неограниченное количество проектов', included: true },
        { text: '32 дорожки на проект', included: true },
        { text: 'Все базовые и расширенные эффекты', included: true },
        { text: 'Экспорт в WAV и MP3 320kbps', included: true },
        { text: 'AI ассистент для создания', included: true },
        { text: 'Коллаборации до 5 человек', included: true },
        { text: 'Расширенная аналитика', included: true },
        { text: 'Приватные проекты', included: true },
        { text: 'Приоритетная поддержка', included: true },
      ]
    },
    {
      id: 'team',
      name: 'Team',
      price: '2,999₽',
      period: 'в месяц',
      description: 'Для студий и команд',
      featured: false,
      features: [
        { text: 'Все функции Pro', included: true },
        { text: 'До 10 участников в команде', included: true },
        { text: 'Управление доступом для участников', included: true },
        { text: 'Общие библиотеки сэмплов', included: true },
        { text: 'Расширенная коллаборация', included: true },
        { text: 'Брендирование проектов', included: true },
        { text: 'API доступ для интеграций', included: true },
        { text: 'Персональный менеджер', included: true },
        { text: 'Индивидуальное обучение', included: true },
      ]
    }
  ];
  
  const faqs = [
    {
      question: 'Можно ли отменить подписку в любой момент?',
      answer: 'Да, вы можете отменить подписку в любое время. После отмены вы сохраните доступ к функциям Pro до конца оплаченного периода.'
    },
    {
      question: 'Что происходит с проектами при отмене подписки?',
      answer: 'Все ваши проекты сохраняются. Проекты, использующие функции Pro, будут переведены в режим только для чтения до возобновления подписки.'
    },
    {
      question: 'Есть ли бесплатный пробный период?',
      answer: 'Да, мы предлагаем 14-дневный пробный период для плана Pro. Вам не нужно вводить данные карты, чтобы начать пробный период.'
    },
    {
      question: 'Можно ли изменить план подписки?',
      answer: 'Да, вы можете перейти на другой план в любое время. Разница в стоимости будет учтена при следующем платеже.'
    }
  ];
  
  const comparisonFeatures = [
    { name: 'Количество проектов', free: '3', pro: 'Неограничено', team: 'Неограничено' },
    { name: 'Дорожек на проект', free: '5', pro: '32', team: '64' },
    { name: 'Коллаборации', free: '2 человека', pro: '5 человек', team: '10 человек' },
    { name: 'Экспорт качества', free: 'MP3 128kbps', pro: 'WAV/MP3 320kbps', team: 'WAV/MP3 320kbps' },
    { name: 'AI инструменты', free: 'Нет', pro: 'Да', team: 'Да + расширенные' },
    { name: 'Приоритетная поддержка', free: 'Нет', pro: 'Да', team: 'Да + менеджер' },
  ];

  const handleSubscribe = (planId: string) => {
    setCurrentPlan(planId);
    console.log(`Subscribed to ${planId} plan`);
    // Здесь будет логика оформления подписки
  };

  return (
    <SubscriptionContainer>
      <Header>
        <Title>Выберите свой план</Title>
        <Subtitle>
          Получите доступ к продвинутым инструментам для создания музыки, 
          коллаборациям и AI-ассистенту. Отмена в любой момент.
        </Subtitle>
      </Header>
      
      <PlansGrid>
        {plans.map((plan) => (
          <PlanCard key={plan.id} featured={plan.featured}>
            {plan.featured && <FeaturedBadge>ПОПУЛЯРНЫЙ</FeaturedBadge>}
            
            <PlanHeader>
              <PlanName>{plan.name}</PlanName>
              <PlanPrice>{plan.price}</PlanPrice>
              <PlanPeriod>{plan.period}</PlanPeriod>
            </PlanHeader>
            
            <PlanDescription>{plan.description}</PlanDescription>
            
            <FeaturesList>
              {plan.features.map((feature, index) => (
                <FeatureItem key={index} disabled={!feature.included}>
                  <FeatureIcon disabled={!feature.included}>
                    {feature.included ? '✓' : '✗'}
                  </FeatureIcon>
                  <span>{feature.text}</span>
                </FeatureItem>
              ))}
            </FeaturesList>
            
            {currentPlan === plan.id ? (
              <CurrentPlanBadge>
                ✅ Текущий план
              </CurrentPlanBadge>
            ) : (
              <SubscribeButton 
                featured={plan.featured}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.id === 'free' ? 'Начать бесплатно' : 'Выбрать план'}
              </SubscribeButton>
            )}
          </PlanCard>
        ))}
      </PlansGrid>
      
      <ComparisonTable>
        <TableHeader>
          <TableHeaderCell>Функция</TableHeaderCell>
          <TableHeaderCell center>Free</TableHeaderCell>
          <TableHeaderCell center>Pro</TableHeaderCell>
          <TableHeaderCell center>Team</TableHeaderCell>
        </TableHeader>
        
        {comparisonFeatures.map((feature, index) => (
          <TableRow key={index}>
            <TableCell>{feature.name}</TableCell>
            <TableCell center>{feature.free}</TableCell>
            <TableCell center>{feature.pro}</TableCell>
            <TableCell center>{feature.team}</TableCell>
          </TableRow>
        ))}
      </ComparisonTable>
      
      <FAQSection>
        <FAQTitle>Частые вопросы</FAQTitle>
        <FAQGrid>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion>
                <span>❓</span>
                {faq.question}
              </FAQQuestion>
              <FAQAnswer>{faq.answer}</FAQAnswer>
            </FAQItem>
          ))}
        </FAQGrid>
      </FAQSection>
    </SubscriptionContainer>
  );
};

export default SubscriptionPage;
