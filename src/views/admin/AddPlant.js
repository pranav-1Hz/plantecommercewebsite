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

const StyledSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1.4rem;
  background: ${({ theme }) => theme.grey100};
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

const AddPlant = () => {
    const { nurseries } = useContext(NurseryContext);
    const { user, addPlant } = useContext(CartContext);

    // Find the actual nursery object for the currently logged-in user
    const myNursery = nurseries.find(n => n.contact === user?.email || n.email === user?.email);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        plantTitle: '',
        plantPrice: '',
        plantType: 'indoor',
        plantDescription: '',
        plantImage: '',
        nurseryId: '',
        // Specifications
        size: '',
        sunlight: '',
        water: '',
        soil: '',
        temperature: '',
        humidity: '',
        // Nutrients & Care
        fertilizer: '',
        nutrients: '', // Store as string for now
        // More Details
        origin: '',
        petSafe: '',
        growthRate: '',
        commonIssues: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    plantImage: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create new plant object
        const newPlant = {
            ...formData,
            id: Date.now(),
            plantSlug: formData.plantTitle.toLowerCase().replace(/\s+/g, '-'),
            plantPrice: Number(formData.plantPrice),
            // Use the real nursery ID from the database
            nurseryId: myNursery ? myNursery.id : null,
            // Default image if none provided
            plantImage: formData.plantImage || 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cGxhbnRzfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        };

        if (addPlant) {
            addPlant(newPlant);
            setSuccess(true);
            setFormData({
                plantTitle: '',
                plantPrice: '',
                plantType: 'indoor',
                plantDescription: '',
                plantImage: '',
                nurseryId: '',
                size: '',
                sunlight: '',
                water: '',
                soil: '',
                temperature: '',
                humidity: '',
                fertilizer: '',
                nutrients: '',
                origin: '',
                petSafe: '',
                growthRate: '',
                commonIssues: '',
            });
            setTimeout(() => setSuccess(false), 3000);
        } else {
            alert("Error: addPlant function not available in CartContext. Please contact developer.");
        }
    };

    return (
        <AdminTemplate>
            <StyledWrapper>
                <Heading main style={{ marginBottom: '2rem' }}>Add New Plant</Heading>

                {success && (
                    <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '1rem' }}>
                        Plant added successfully! 🌱
                    </div>
                )}

                <StyledForm onSubmit={handleSubmit}>
                    <StyledFormGroup>
                        <StyledLabel>Plant Name</StyledLabel>
                        <StyledInput
                            name="plantTitle"
                            value={formData.plantTitle}
                            onChange={handleChange}
                            placeholder="e.g. Monstera Deliciosa"
                            required
                        />
                    </StyledFormGroup>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <StyledFormGroup>
                            <StyledLabel>Price ($)</StyledLabel>
                            <StyledInput
                                name="plantPrice"
                                type="number"
                                value={formData.plantPrice}
                                onChange={handleChange}
                                placeholder="25.00"
                                required
                            />
                        </StyledFormGroup>

                        <StyledFormGroup>
                            <StyledLabel>Type</StyledLabel>
                            <StyledSelect
                                name="plantType"
                                value={formData.plantType}
                                onChange={handleChange}
                            >
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                                <option value="succulent">Succulent</option>
                            </StyledSelect>
                        </StyledFormGroup>
                    </div>

                    <StyledFormGroup>
                        <StyledLabel>Nursery Provider</StyledLabel>
                        <Input
                            value={myNursery ? myNursery.name : 'Loading...'}
                            disabled
                            style={{ background: '#f5f5f5' }}
                        />
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <StyledLabel>Description</StyledLabel>
                        <StyledTextArea
                            name="plantDescription"
                            value={formData.plantDescription}
                            onChange={handleChange}
                            placeholder="Describe this beautiful plant..."
                            required
                        />
                    </StyledFormGroup>

                    <div style={{ marginTop: '2rem' }}>
                        <Heading style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>📋 Specifications</Heading>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <StyledFormGroup>
                                <StyledLabel>Mature Size</StyledLabel>
                                <StyledInput name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 12-24 inches" />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <StyledLabel>Sunlight</StyledLabel>
                                <StyledInput name="sunlight" value={formData.sunlight} onChange={handleChange} placeholder="e.g. Bright indirect" />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <StyledLabel>Water Needs</StyledLabel>
                                <StyledInput name="water" value={formData.water} onChange={handleChange} placeholder="e.g. When top soil dry" />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <StyledLabel>Soil Type</StyledLabel>
                                <StyledInput name="soil" value={formData.soil} onChange={handleChange} placeholder="e.g. Well draining" />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <StyledLabel>Temperature</StyledLabel>
                                <StyledInput name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g. 18-24°C" />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <StyledLabel>Humidity</StyledLabel>
                                <StyledInput name="humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g. 40-60%" />
                            </StyledFormGroup>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <Heading style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>🌿 Nutrients & Care</Heading>
                        <StyledFormGroup>
                            <StyledLabel>Fertilizer Schedule</StyledLabel>
                            <StyledInput name="fertilizer" value={formData.fertilizer} onChange={handleChange} placeholder="e.g. Every 2-4 weeks in summer" />
                        </StyledFormGroup>
                        <StyledFormGroup style={{ marginTop: '1rem' }}>
                            <StyledLabel>Primary Nutrients (comma separated)</StyledLabel>
                            <StyledInput name="nutrients" value={formData.nutrients} onChange={handleChange} placeholder="e.g. Nitrogen, Phosphorus" />
                        </StyledFormGroup>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <Heading style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>ℹ️ More Details</Heading>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <StyledFormGroup>
                                <StyledLabel>Origin</StyledLabel>
                                <StyledInput name="origin" value={formData.origin} onChange={handleChange} placeholder="e.g. Tropical regions" />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <StyledLabel>Pet Safe?</StyledLabel>
                                <StyledSelect name="petSafe" value={formData.petSafe} onChange={handleChange}>
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </StyledSelect>
                            </StyledFormGroup>
                        </div>
                        <StyledFormGroup style={{ marginTop: '1rem' }}>
                            <StyledLabel>Common Issues</StyledLabel>
                            <StyledInput name="commonIssues" value={formData.commonIssues} onChange={handleChange} placeholder="e.g. Yellow leaves = overwatering" />
                        </StyledFormGroup>
                    </div>

                    <StyledFormGroup style={{ marginTop: '2rem' }}>
                        <StyledLabel>Upload Plant Image</StyledLabel>
                        <StyledInput
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ padding: '1rem', background: '#f5f5f5', border: '2px dashed #ccc', cursor: 'pointer' }}
                        />
                        {formData.plantImage && (
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <img
                                    src={formData.plantImage}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        )}
                    </StyledFormGroup>

                    <Button type="submit" style={{ marginTop: '1rem' }}>Publish Plant</Button>
                </StyledForm>
            </StyledWrapper>
        </AdminTemplate>
    );
};

export default AddPlant;
