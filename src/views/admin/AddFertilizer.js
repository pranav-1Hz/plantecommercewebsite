import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';
import Button from '../../components/atoms/Button/Button';
import Input from '../../components/atoms/Input/Input';
import { NurseryContext } from '../../context/NurseryContext';
import { CartContext } from '../../context/CartContext';

const StyledWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const StyledForm = styled.form`
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledLabel = styled.label`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${({ theme }) => theme.fontColorHeading};
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: 1rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1.4rem;
  min-height: 100px;
  resize: vertical;
  background: ${({ theme }) => theme.grey100};
`;

const AddFertilizer = () => {
  const { nurseries } = useContext(NurseryContext);
  const { user, addFertilizer } = useContext(CartContext);

  const myNursery = nurseries.find(n => n.contact === user?.email || n.email === user?.email);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    weight: '',
    description: '',
    usage: '',
    image: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newFertilizer = {
      ...formData,
      id: Date.now().toString(),
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(formData.price),
      nurseryId: myNursery ? myNursery.id : null,
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    };

    if (addFertilizer) {
      addFertilizer(newFertilizer);
      setSuccess(true);
      setFormData({
        name: '',
        price: '',
        weight: '',
        description: '',
        usage: '',
        image: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('Error: addFertilizer function not available.');
    }
  };

  if (!myNursery || myNursery.status !== 'approved') {
    return (
      <AdminTemplate>
        <StyledWrapper style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Heading main>🔒 Access Restricted</Heading>
          <div
            style={{
              padding: '2rem',
              background: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '10px',
              color: '#856404',
              marginTop: '2rem',
            }}
          >
            <h3>Account Pending Approval</h3>
            <p style={{ marginTop: '1rem' }}>
              Your nursery account must be approved before you can add fertilizers.
            </p>
            <Button
              secondary
              style={{ marginTop: '2rem' }}
              onClick={() => {
                window.location.href = '/nursery';
              }}
            >
              Back to Dashboard
            </Button>
          </div>
        </StyledWrapper>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <StyledWrapper>
        <Heading main style={{ marginBottom: '2rem' }}>
          Add New Fertilizer
        </Heading>

        {success && (
          <div
            style={{
              padding: '1rem',
              background: '#d4edda',
              color: '#155724',
              borderRadius: '5px',
              marginBottom: '1rem',
            }}
          >
            Fertilizer added successfully! 🪴
          </div>
        )}

        <StyledForm onSubmit={handleSubmit}>
          <StyledFormGroup>
            <StyledLabel>Fertilizer Name</StyledLabel>
            <StyledInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Organic Power Bloom"
              required
            />
          </StyledFormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <StyledFormGroup>
              <StyledLabel>Price ($)</StyledLabel>
              <StyledInput
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="15.00"
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel>Weight/Volume</StyledLabel>
              <StyledInput
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 500ml or 1kg"
                required
              />
            </StyledFormGroup>
          </div>

          <StyledFormGroup>
            <StyledLabel>Description</StyledLabel>
            <StyledTextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What makes this fertilizer special?"
              required
            />
          </StyledFormGroup>

          <StyledFormGroup>
            <StyledLabel>Usage Instructions</StyledLabel>
            <StyledTextArea
              name="usage"
              value={formData.usage}
              onChange={handleChange}
              placeholder="How should customers use this?"
              required
            />
          </StyledFormGroup>

          <StyledFormGroup>
            <StyledLabel>Upload Image</StyledLabel>
            <StyledInput
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                padding: '1rem',
                background: '#f5f5f5',
                border: '2px dashed #ccc',
                cursor: 'pointer',
              }}
            />
            {formData.image && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
                />
              </div>
            )}
          </StyledFormGroup>

          <Button type="submit" style={{ marginTop: '1rem' }}>
            Publish Fertilizer
          </Button>
        </StyledForm>
      </StyledWrapper>
    </AdminTemplate>
  );
};

export default AddFertilizer;
