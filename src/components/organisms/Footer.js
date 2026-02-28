import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.fontColorPrimary};
  padding: 2.5rem 3rem;
  text-align: center;
  margin-top: 5rem;
  color: white;
  width: 100%;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover {
    color: #fff;
  }
`;

const FooterAnchor = styled.a`
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const StyledText = styled.p`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.light};
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
`;

const Footer = () => (
  <StyledFooter>
    <NavRow>
      <FooterLink to="/">Home</FooterLink>
      <FooterAnchor href="/contact">Contact</FooterAnchor>
      <FooterLink to="/feedback">Feedback</FooterLink>
    </NavRow>
    <StyledText>
      &copy; {new Date().getFullYear()} Plants &amp; Home. All rights reserved.
    </StyledText>
  </StyledFooter>
);

export default Footer;
