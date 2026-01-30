import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      iconPosition={iconPosition}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      className={className}
    >
      {loading && (
        <LoadingSpinner>
          <div />
          <div />
          <div />
        </LoadingSpinner>
      )}
      
      {icon && !loading && iconPosition === 'left' && (
        <IconWrapper position="left">{icon}</IconWrapper>
      )}
      
      <span>{children}</span>
      
      {icon && !loading && iconPosition === 'right' && (
        <IconWrapper position="right">{icon}</IconWrapper>
      )}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: string;
  size: string;
  iconPosition: string;
  disabled: boolean;
  fullWidth: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space.sm};
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--transition-fast);
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  /* Variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          box-shadow: var(--shadow-md);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
        
      case 'secondary':
        return css`
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--border-hover);
          }
        `;
        
      case 'outline':
        return css`
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.03);
            border-color: var(--primary);
          }
        `;
        
      case 'ghost':
        return css`
          background: transparent;
          color: var(--text-primary);
          border: 1px solid transparent;
          
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.05);
          }
        `;
        
      case 'danger':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.2);
          }
        `;
        
      default:
        return '';
    }
  }}
  
  /* Sizes */
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 36px;
        `;
        
      case 'md':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          min-height: 44px;
        `;
        
      case 'lg':
        return css`
          padding: 1rem 2rem;
          font-size: 1rem;
          min-height: 52px;
        `;
        
      case 'xl':
        return css`
          padding: 1.25rem 2.5rem;
          font-size: 1.125rem;
          min-height: 60px;
        `;
        
      default:
        return '';
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  
  div {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    animation: wave 1s ease-in-out infinite;
  }
  
  div:nth-child(2) { animation-delay: 0.1s; }
  div:nth-child(3) { animation-delay: 0.2s; }
  
  @keyframes wave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.3); }
  }
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125em;
  order: ${props => props.position === 'left' ? -1 : 1};
`;

export default Button;
