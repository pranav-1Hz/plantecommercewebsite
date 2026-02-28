import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { NurseryContext } from '../../context/NurseryContext';

const StyledSidebar = styled.aside`
  width: 250px;
  min-height: 100vh;
  background: ${({ theme }) => theme.halfPlantColor};
  padding: 2rem 0;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 768px) {
    width: 100%;
    position: relative;
    min-height: auto;
  }
`;

const StyledLogo = styled.div`
  padding: 0 2rem 2rem 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.primaryColor};
  margin-bottom: 2rem;
`;

const StyledLogoText = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.fontColorHeading};
  font-weight: ${({ theme }) => theme.bold};
`;

const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledNavLink = styled(Link)`
  padding: 1.5rem 2rem;
  text-decoration: none;
  color: ${({ theme }) => theme.fontColorText};
  font-size: 1.4rem;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.primaryColor};
    color: white;
    border-left-color: ${({ theme }) => theme.fontColorHeading};
  }

  &.active {
    background: ${({ theme }) => theme.primaryColor};
    color: white;
    border-left-color: ${({ theme }) => theme.fontColorHeading};
    font-weight: ${({ theme }) => theme.bold};
  }
`;

const StyledIcon = styled.span`
  margin-right: 1rem;
  font-size: 1.6rem;
`;

const StyledRoleSwitcher = styled.div`
  padding: 2rem;
  border-top: 1px solid ${({ theme }) => theme.primaryColor};
  margin-top: auto;
`;

const StyledRoleButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ active, theme }) => (active ? theme.primaryColor : 'transparent')};
  color: ${({ active, theme }) => (active ? 'white' : theme.fontColorText)};
  border: 1px solid ${({ theme }) => theme.primaryColor};
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  font-weight: bold;

  &:hover {
    background: ${({ theme }) => theme.primaryColor};
    color: white;
  }
`;

const AdminSidebar = () => {
  // Simple check to see if we are in admin mode or nursery mode based on URL
  const isNurseryMode = window.location.pathname.includes('/nursery');
  const { nurseries, currentUserNurseryId } = useContext(NurseryContext);

  // Get current nursery status
  const myNursery = nurseries.find(n => n.id === currentUserNurseryId);
  const isRejected = myNursery && myNursery.status === 'rejected';

  return (
    <StyledSidebar>
      <StyledLogo>
        <StyledLogoText>{isNurseryMode ? '🏡 Nursery Panel' : '🌿 Admin Panel'}</StyledLogoText>
      </StyledLogo>
      <StyledNav>
        {!isNurseryMode ? (
          <>
            <StyledNavLink to="/admin">
              <StyledIcon>
                <span role="img" aria-label="dashboard">
                  📊
                </span>
              </StyledIcon>
              Dashboard
            </StyledNavLink>
            <StyledNavLink to="/admin/nurseries">
              <StyledIcon>
                <span role="img" aria-label="nurseries">
                  🏪
                </span>
              </StyledIcon>
              Nursery Approvals
            </StyledNavLink>
            <StyledNavLink to="/admin/plants">
              <StyledIcon>
                <span role="img" aria-label="plants">
                  🌱
                </span>
              </StyledIcon>
              Manage All Plants
            </StyledNavLink>
            <StyledNavLink to="/admin/feedback">
              <StyledIcon>
                <span role="img" aria-label="feedback">
                  💬
                </span>
              </StyledIcon>
              Feedback
            </StyledNavLink>
            <StyledNavLink to="/admin/contact">
              <StyledIcon>
                <span role="img" aria-label="contact">
                  📩
                </span>
              </StyledIcon>
              Contact Messages
            </StyledNavLink>
          </>
        ) : (
          <>
            {!isRejected && (
              <>
                <StyledNavLink to="/nursery">
                  <StyledIcon>
                    <span role="img" aria-label="dashboard">
                      📊
                    </span>
                  </StyledIcon>
                  My Dashboard
                </StyledNavLink>
                <StyledNavLink to="/nursery/add-plant">
                  <StyledIcon>
                    <span role="img" aria-label="add plant">
                      ➕
                    </span>
                  </StyledIcon>
                  Add My Plant
                </StyledNavLink>
              </>
            )}
          </>
        )}

        <StyledNavLink to="/">
          <StyledIcon>
            <span role="img" aria-label="home">
              🏠
            </span>
          </StyledIcon>
          Back to Shop
        </StyledNavLink>
      </StyledNav>
    </StyledSidebar>
  );
};

export default AdminSidebar;
