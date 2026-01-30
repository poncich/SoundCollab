import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'filled' | 'outline';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  borderRadius = 'lg',
  className,
  onClick,
}) => {
  return (
    <StyledCard
      variant={variant}
      hoverable={hoverable}
      padding={padding}
      borderRadius={borderRadius}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};

const StyledCard = styled.div<{
  variant: string;
  hoverable: boolean;
  padding: string;
  borderRadius: string;
}>`
  background: ${props => {
    switch (props.variant) {
      case 'default': return 'rgba(255, 255, 255, 0.03)';
      case 'elevated': return 'rgba(255, 255, 255, 0.05)';
      case 'filled': return 'rgba(255, 255, 255, 0.08)';
      case 'outline': return 'transparent';
      default: return 'rgba(255, 255, 255, 0.03)';
    }
  }};
  
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'outline': return 'var(--border-color)';
      default: return 'transparent';
    }
  }};
  
  border-radius: ${props => {
    switch (props.borderRadius) {
      case 'sm': return 'var(--radius-sm)';
      case 'md': return 'var(--radius-md)';
      case 'lg': return 'var(--radius-lg)';
      case 'xl': return 'var(--radius-xl)';
      default: return 'var(--radius-lg)';
    }
  }};
  
  padding: ${props => {
    switch (props.padding) {
      case 'none': return '0';
      case 'sm': return 'var(--space-sm)';
      case 'md': return 'var(--space-md)';
      case 'lg': return 'var(--space-lg)';
      case 'xl': return 'var(--space-xl)';
      default: return 'var(--space-md)';
    }
  }};
  
  transition: all var(--transition-normal);
  backdrop-filter: ${props => props.variant === 'elevated' ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.variant === 'elevated' ? 'var(--shadow-md)' : 'none'};
  
  ${props => props.hoverable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--border-active);
      box-shadow: var(--shadow-lg);
    }
  `}
`;

export const CardHeader = styled.div`
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export const CardContent = styled.div`
  padding: var(--space-md) 0;
`;

export const CardFooter = styled.div`
  padding-top: var(--space-md);
  margin-top: var(--space-md);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default Card;
