import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AdminSidebar from '../components/organisms/AdminSidebar';

const StyledAdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.backgroundColor};

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 3rem;

  @media only screen and (max-width: 768px) {
    margin-left: 0;
    padding: 2rem 1rem;
  }
`;

const AdminTemplate = ({ children }) => {
  return (
    <StyledAdminLayout>
      <AdminSidebar />
      <StyledContent>{children}</StyledContent>
    </StyledAdminLayout>
  );
};

AdminTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminTemplate;
