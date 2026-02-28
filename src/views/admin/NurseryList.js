import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';
import Button from '../../components/atoms/Button/Button';
import Input from '../../components/atoms/Input/Input';
import { NurseryContext } from '../../context/NurseryContext';

const API_BASE = 'http://localhost:5000/api';

const StyledWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const StyledCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StyledCardImage = styled.div`
  height: 200px;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
`;

const StyledCardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const StyledCardTitle = styled.h3`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.fontColorHeading};
  margin-bottom: 0.5rem;
`;

const StyledInfo = styled.p`
  color: ${({ theme }) => theme.fontColorText};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
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

const StyledActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StyledForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
  display: grid;
  gap: 1.5rem;
  max-width: 600px;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledLabel = styled.label`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.fontColorHeading};
`;

const StyledInput = styled(Input)`
  width: 100%;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'approved' ? '#e6f4ea' : status === 'pending' ? '#fef7e0' : '#fce8e6'};
  color: ${({ status }) =>
    status === 'approved' ? '#1e7e34' : status === 'pending' ? '#b08800' : '#c62828'};
`;

const EMPTY_FORM = { name: '', location: '', contact: '', image: '' };

const NurseryList = () => {
  const { nurseries, addNursery, removeNursery, editNursery } = useContext(NurseryContext);
  const [showForm, setShowForm] = useState(false);
  const [editingNursery, setEditingNursery] = useState(null); // nursery object being edited
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setEditingNursery(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = nursery => {
    setEditingNursery(nursery);
    setFormData({
      name: nursery.name || '',
      location: nursery.location || '',
      contact: nursery.contact || '',
      image: nursery.image || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNursery(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    if (editingNursery) {
      // Update existing nursery
      const updated = {
        ...editingNursery,
        name: formData.name,
        location: formData.location,
        contact: formData.contact,
        image: formData.image || editingNursery.image,
      };
      editNursery(updated); // update local state immediately

      // Persist to backend
      try {
        await fetch(`${API_BASE}/nurseries/${editingNursery.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.error('Failed to update nursery on server:', err);
      }
    } else {
      // Add new nursery
      addNursery({
        ...formData,
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1416879741262-eb65b2069cb7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OXx8Z2FyZGVufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      });
    }

    setFormData(EMPTY_FORM);
    setEditingNursery(null);
    setShowForm(false);
  };

  return (
    <AdminTemplate>
      <StyledWrapper>
        <StyledHeader>
          <Heading main>Nursery Providers</Heading>
          <Button onClick={showForm ? handleCancel : openAddForm}>
            {showForm ? 'Cancel' : 'Add New Nursery'}
          </Button>
        </StyledHeader>

        {showForm && (
          <StyledForm onSubmit={handleSubmit}>
            <Heading>
              {editingNursery ? `✏️ Edit "${editingNursery.name}"` : 'Add New Nursery'}
            </Heading>
            <StyledFormGroup>
              <StyledLabel>Nursery Name</StyledLabel>
              <StyledInput
                name="name"
                placeholder="e.g. Green Valley"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <StyledLabel>Location</StyledLabel>
              <StyledInput
                name="location"
                placeholder="City, State"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <StyledLabel>Contact Email/Phone</StyledLabel>
              <StyledInput
                name="contact"
                placeholder="contact@example.com"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <StyledLabel>Image URL</StyledLabel>
              <StyledInput
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleInputChange}
              />
            </StyledFormGroup>
            <FormActions>
              <Button type="submit">{editingNursery ? 'Save Changes' : 'Create Nursery'}</Button>
              <Button
                type="button"
                style={{ background: '#6c757d', color: 'white', border: 'none' }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </FormActions>
          </StyledForm>
        )}

        <StyledGrid>
          {nurseries.map(nursery => (
            <StyledCard key={nursery.id}>
              <StyledCardImage image={nursery.image} />
              <StyledCardContent>
                <StyledCardTitle>{nursery.name}</StyledCardTitle>
                <StyledInfo>📍 {nursery.location}</StyledInfo>
                <StyledInfo>📧 {nursery.contact}</StyledInfo>
                <StatusBadge status={nursery.status || 'pending'}>
                  {nursery.status || 'pending'}
                </StatusBadge>
                <StyledActions>
                  <EditBtn onClick={() => openEditForm(nursery)}>✏️ Edit</EditBtn>
                  <DeleteBtn
                    onClick={() => {
                      if (window.confirm(`Delete "${nursery.name}"?`)) {
                        removeNursery(nursery.id);
                      }
                    }}
                  >
                    🗑️ Delete
                  </DeleteBtn>
                </StyledActions>
              </StyledCardContent>
            </StyledCard>
          ))}
          {nurseries.length === 0 && (
            <p style={{ color: '#888', gridColumn: '1/-1' }}>No nurseries found.</p>
          )}
        </StyledGrid>
      </StyledWrapper>
    </AdminTemplate>
  );
};

export default NurseryList;
