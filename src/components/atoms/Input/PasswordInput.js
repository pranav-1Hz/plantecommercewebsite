import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import Input from './Input';

const ToggleButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${({ theme }) => theme.fontColorText};
  z-index: 2;
  
  &:hover {
    color: ${({ theme }) => theme.fontColorHeading};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PasswordInput = forwardRef((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Input
                {...props}
                ref={ref}
                type={showPassword ? 'text' : 'password'}
                style={{ ...props.style, paddingRight: '40px' }}
            />
            <ToggleButton type="button" onClick={toggleVisibility} aria-label="Toggle password visibility">
                {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                )}
            </ToggleButton>
        </>
    );
});

export default PasswordInput;
