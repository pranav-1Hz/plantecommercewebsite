import React, { useContext } from 'react';
import styled from 'styled-components';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';
import Button from '../../components/atoms/Button/Button';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledTh = styled.th`
  background: ${({ theme }) => theme.primaryColor};
  color: white;
  padding: 1.5rem;
  text-align: left;
  font-size: 1.4rem;
`;

const StyledTd = styled.td`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.fontColorText};

  &:last-child {
    text-align: right;
  }
`;

const StyledImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 1rem;
  font-size: 0.88rem;
  font-family: inherit;
  font-weight: ${({ theme }) => theme.bold};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.12s;
  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const EditBtn = styled(ActionBtn)`
  background: hsla(152, 94%, 33%, 0.12);
  color: ${({ theme }) => theme.fontColorPrimary};
  &:hover {
    background: hsla(152, 94%, 33%, 0.22);
  }
`;

const DeleteBtn = styled(ActionBtn)`
  background: hsla(0, 80%, 50%, 0.1);
  color: #c62828;
  &:hover {
    background: hsla(0, 80%, 50%, 0.18);
  }
`;

const PlantManagement = () => {
  const { plants, removePlant } = useContext(CartContext);

  return (
    <AdminTemplate>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Heading main>Manage Plants</Heading>
      </div>

      <StyledTable>
        <thead>
          <tr>
            <StyledTh>Image</StyledTh>
            <StyledTh>Name</StyledTh>
            <StyledTh>Type</StyledTh>
            <StyledTh>Price</StyledTh>
            <StyledTh>Actions</StyledTh>
          </tr>
        </thead>
        <tbody>
          {plants.map(plant => (
            <tr key={plant.id || plant.plantSlug}>
              <StyledTd>
                <StyledImage src={plant.plantImage} alt={plant.plantTitle} />
              </StyledTd>
              <StyledTd>
                <strong>{plant.plantTitle}</strong>
              </StyledTd>
              <StyledTd>{plant.plantType}</StyledTd>
              <StyledTd>${plant.plantPrice}</StyledTd>
              <StyledTd>
                <EditBtn>✏️ Edit</EditBtn>
                <DeleteBtn
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this plant?')) {
                      removePlant(plant.id);
                    }
                  }}
                >
                  🗑️ Delete
                </DeleteBtn>
              </StyledTd>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </AdminTemplate>
  );
};

export default PlantManagement;
