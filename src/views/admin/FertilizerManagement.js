import React, { useContext } from 'react';
import styled from 'styled-components';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';
import { CartContext } from '../../context/CartContext';
import { NurseryContext } from '../../context/NurseryContext';

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

const DeleteBtn = styled(ActionBtn)`
  background: hsla(0, 80%, 50%, 0.1);
  color: #c62828;
  &:hover {
    background: hsla(0, 80%, 50%, 0.18);
  }
`;

const FertilizerManagement = () => {
  const { fertilizers, removeFertilizer } = useContext(CartContext);
  const { nurseries } = useContext(NurseryContext);

  return (
    <AdminTemplate>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Heading main>Manage Fertilizers</Heading>
      </div>

      <StyledTable>
        <thead>
          <tr>
            <StyledTh>Image</StyledTh>
            <StyledTh>Name</StyledTh>
            <StyledTh>Nursery</StyledTh>
            <StyledTh>Price</StyledTh>
            <StyledTh>Actions</StyledTh>
          </tr>
        </thead>
        <tbody>
          {fertilizers.map(f => {
            const nursery = nurseries.find(n => String(n.id) === String(f.nurseryId));
            return (
              <tr key={f.id}>
                <StyledTd>
                  <StyledImage
                    src={
                      f.image ||
                      'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
                    }
                    alt={f.name}
                  />
                </StyledTd>
                <StyledTd>
                  <strong>{f.name}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>{f.weight}</div>
                </StyledTd>
                <StyledTd>{nursery ? nursery.name : 'Unknown Nursery'}</StyledTd>
                <StyledTd>${f.price}</StyledTd>
                <StyledTd>
                  <DeleteBtn
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${f.name}"?`)) {
                        removeFertilizer(f.id);
                      }
                    }}
                  >
                    🗑️ Delete
                  </DeleteBtn>
                </StyledTd>
              </tr>
            );
          })}
          {fertilizers.length === 0 && (
            <tr>
              <td
                colSpan="5"
                style={{ textAlign: 'center', padding: '3rem', color: '#888', fontSize: '1.4rem' }}
              >
                No fertilizers found in system.
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>
    </AdminTemplate>
  );
};

export default FertilizerManagement;
