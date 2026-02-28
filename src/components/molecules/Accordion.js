import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledAccordionWrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.primaryColor};
`;

const StyledAccordionHeader = styled.button`
  width: 100%;
  padding: 1.5rem 1rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: ${({ theme }) => theme.bold};
  color: ${({ theme }) => theme.fontColorHeading};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.halfPlantColor};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primaryColor};
    outline-offset: 2px;
  }
`;

const StyledAccordionIcon = styled.span`
  font-size: 2rem;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const StyledAccordionContent = styled.div`
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${({ isOpen }) => (isOpen ? '1rem' : '0 1rem')};
`;

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledAccordionWrapper>
      <StyledAccordionHeader
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
      >
        {title}
        <StyledAccordionIcon isOpen={isOpen}>▼</StyledAccordionIcon>
      </StyledAccordionHeader>
      <StyledAccordionContent isOpen={isOpen}>{children}</StyledAccordionContent>
    </StyledAccordionWrapper>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

Accordion.defaultProps = {
  defaultOpen: false,
};

export default Accordion;
