import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  text-align: center;
  padding: 2rem;
`;

const NotFoundIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 2rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const NotFoundDescription = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 500px;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <NotFoundIcon>🎵</NotFoundIcon>
      <NotFoundTitle>Страница не найдена</NotFoundTitle>
      <NotFoundDescription>
        Возможно, страница, которую вы ищете, была удалена, 
        перемещена или временно недоступна.
      </NotFoundDescription>
      
      <ActionButtons>
        <ActionButton primary onClick={() => navigate('/')}>
          <span>🏠</span>
          <span>На главную</span>
        </ActionButton>
        <ActionButton onClick={() => navigate('/studio')}>
          <span>🎵</span>
          <span>В студию</span>
        </ActionButton>
        <ActionButton onClick={() => window.history.back()}>
          <span>↩️</span>
          <span>Назад</span>
        </ActionButton>
      </ActionButtons>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
