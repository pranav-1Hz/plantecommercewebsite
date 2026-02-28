import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Text from '../atoms/Text/Text';
import HeaderIcons from '../molecules/HeaderIcons';

const StyledHeader = styled.header`
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 2rem;
  margin: 0 auto;

  @media only screen and (min-width: 1300px) {
    padding: 4rem 4rem;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.fontColorText};
  font-size: 1.05rem;
  font-weight: ${({ theme }) => theme.regular};
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  white-space: nowrap;
  transition: background 0.18s, color 0.18s;

  &:hover {
    background: ${({ theme }) => theme.secondaryColor};
    color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const NavDot = styled.span`
  color: #ccc;
  font-size: 1rem;
  user-select: none;
`;

const Header = () => (
  <StyledHeader>
    <Text logo as="h1">
      <LogoLink to="/">Plants &amp; Home</LogoLink>
    </Text>

    <RightSide>
      <NavBar>
        <NavLink to="/">Home</NavLink>
        <NavDot>•</NavDot>
        <NavLink to="/plants">All Plants</NavLink>
        <NavDot>•</NavDot>
        <NavLink to="/feedback">Feedback</NavLink>
        <NavDot>•</NavDot>
        <NavLink to="/contact">Contact</NavLink>
      </NavBar>
      <HeaderIcons />
    </RightSide>
  </StyledHeader>
);

export default Header;
