import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';
import Text from '../../components/atoms/Text/Text';
import Button from '../../components/atoms/Button/Button';
import { CartContext } from '../../context/CartContext';
import { NurseryContext } from '../../context/NurseryContext';

const StyledDashboard = styled.div`
  max-width: 1200px;
`;

const StyledHeader = styled.div`
  margin-bottom: 3rem;
  border-bottom: 2px solid ${({ theme }) => theme.primaryColor};
  padding-bottom: 1rem;
`;

const StyledStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StyledStatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StyledStatValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primaryColor};
  margin-bottom: 0.5rem;
`;

const StyledSection = styled.section`
  margin-bottom: 4rem;
`;

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
`;

const StyledTd = styled.td`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const StyledStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  background: ${({ status }) =>
    status === 'approved' ? '#d4edda' : status === 'pending' ? '#fff3cd' : '#f8d7da'};
  color: ${({ status }) =>
    status === 'approved' ? '#155724' : status === 'pending' ? '#856404' : '#721c24'};
`;

const StyledRejectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  background: #f8d7da;
  border-radius: 10px;
  padding: 3rem;
  margin: 2rem 0;
`;

const StyledRejectionTitle = styled.h1`
  color: #721c24;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;
const StyledRejectionText = styled.p`
  color: #721c24;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;
const StyledRejectionButton = styled(Button)`
  background: #721c24;
  &:hover {
    background: #5a1620;
  }
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

/* ─── Full Edit Modal ─────────────────────────────────────── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 2rem 1rem;
  overflow-y: auto;
`;

const Modal = styled.div`
  background: white;
  border-radius: 14px;
  padding: 2.5rem;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.25);
  margin: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.fontColorHeading};
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 1.8rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.secondaryColor};
  color: ${({ theme }) => theme.fontColorHeading};
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.fontColorText};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledInput = styled.input`
  padding: 9px 13px;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 6px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select`
  padding: 9px 13px;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  box-sizing: border-box;
  color: ${({ theme }) => theme.fontColorHeading};
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const StyledTextarea = styled.textarea`
  padding: 9px 13px;
  font-size: 1rem;
  font-family: inherit;
  background: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 6px;
  outline: none;
  width: 100%;
  min-height: 90px;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 0.8rem;
  display: block;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const SaveBtn = styled.button`
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.primaryColor};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    opacity: 0.88;
  }
`;

const CancelBtn = styled.button`
  padding: 0.75rem 2rem;
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  &:hover {
    border-color: #aaa;
  }
`;

/* ─── Component ───────────────────────────────────────────── */
const NurseryDashboard = () => {
  const { user, plants, removePlant, addPlant } = useContext(CartContext);
  const { nurseries } = useContext(NurseryContext);

  const [editingPlant, setEditingPlant] = useState(null);
  const [editForm, setEditForm] = useState({
    plantTitle: '',
    plantPrice: '',
    plantDescription: '',
    plantImage: '',
  });

  const myNursery = nurseries.find(n => n.contact === user?.email || n.email === user?.email);

  // useEffect must be called unconditionally before any early returns
  useEffect(() => {
    if (!myNursery) return;
    try {
      const stored = localStorage.getItem('localPlants');
      if (!stored) return;
      const localPlants = JSON.parse(stored);
      let changed = false;
      const fixed = localPlants.map(p => {
        if (!p.nurseryId || (p.nurseryId !== myNursery.id && p.nurseryId <= 5)) {
          changed = true;
          return { ...p, nurseryId: myNursery.id };
        }
        return p;
      });
      if (changed) {
        localStorage.setItem('localPlants', JSON.stringify(fixed));
        window.location.reload();
      }
    } catch (e) {
      console.error('Migration error:', e);
    }
  }, [myNursery]);

  if (!myNursery && nurseries.length > 0) {
    return (
      <AdminTemplate>
        <StyledDashboard>
          <Heading>Loading Nursery Data...</Heading>
        </StyledDashboard>
      </AdminTemplate>
    );
  }

  if (myNursery && myNursery.status === 'rejected') {
    return (
      <AdminTemplate>
        <StyledRejectionContainer>
          <StyledRejectionTitle>Application Rejected</StyledRejectionTitle>
          <StyledRejectionText>
            Unfortunately, your nursery application has been rejected. Please contact support for
            more information.
          </StyledRejectionText>
          <StyledRejectionButton
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Return Home
          </StyledRejectionButton>
        </StyledRejectionContainer>
      </AdminTemplate>
    );
  }

  const myPlants = plants.filter(p => myNursery && String(p.nurseryId) === String(myNursery.id));

  const openEdit = plant => {
    setEditingPlant(plant);
    setEditForm({
      plantTitle: plant.plantTitle || '',
      plantPrice: plant.plantPrice || '',
      plantType: plant.plantType || 'indoor',
      plantDescription: plant.plantDescription || '',
      plantImage: typeof plant.plantImage === 'string' ? plant.plantImage : '',
      size: plant.size || '',
      sunlight: plant.sunlight || '',
      water: plant.water || '',
      soil: plant.soil || '',
      temperature: plant.temperature || '',
      humidity: plant.humidity || '',
      fertilizer: plant.fertilizer || '',
      nutrients: plant.nutrients || '',
      origin: plant.origin || '',
      petSafe: plant.petSafe || '',
      commonIssues: plant.commonIssues || '',
    });
  };

  const handleEditChange = e => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageEdit = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditForm(prev => ({ ...prev, plantImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = e => {
    e.preventDefault();
    if (!editForm.plantTitle || !editForm.plantPrice) return;
    try {
      const stored = localStorage.getItem('localPlants');
      if (stored) {
        const all = JSON.parse(stored);
        const updated = all.map(p =>
          p.id === editingPlant.id || p.plantSlug === editingPlant.plantSlug
            ? {
                ...p,
                ...editForm,
                plantPrice: Number(editForm.plantPrice),
                plantSlug: editForm.plantTitle.toLowerCase().replace(/\s+/g, '-'),
              }
            : p,
        );
        localStorage.setItem('localPlants', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Edit save error:', err);
    }
    setEditingPlant(null);
    window.location.reload();
  };

  return (
    <AdminTemplate>
      <StyledDashboard>
        {/* Edit Modal */}
        {editingPlant && (
          <Overlay
            onClick={e => {
              if (e.target === e.currentTarget) setEditingPlant(null);
            }}
          >
            <Modal>
              <ModalTitle>✏️ Edit Plant</ModalTitle>
              <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Editing: <strong>{editingPlant.plantTitle}</strong>
              </p>
              <form onSubmit={handleEditSave}>
                {/* ── Basic Info ── */}
                <SectionTitle>🌱 Basic Info</SectionTitle>
                <FormGroup>
                  <Label htmlFor="ed-title">Plant Name *</Label>
                  <StyledInput
                    id="ed-title"
                    name="plantTitle"
                    value={editForm.plantTitle}
                    onChange={handleEditChange}
                    placeholder="e.g. Monstera Deliciosa"
                    required
                  />
                </FormGroup>
                <Grid2 style={{ marginTop: '0.8rem' }}>
                  <FormGroup>
                    <Label htmlFor="ed-price">Price ($) *</Label>
                    <StyledInput
                      id="ed-price"
                      name="plantPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.plantPrice}
                      onChange={handleEditChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="ed-type">Type</Label>
                    <StyledSelect
                      id="ed-type"
                      name="plantType"
                      value={editForm.plantType}
                      onChange={handleEditChange}
                    >
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="succulent">Succulent</option>
                    </StyledSelect>
                  </FormGroup>
                </Grid2>
                <FormGroup style={{ marginTop: '0.8rem' }}>
                  <Label htmlFor="ed-desc">Description</Label>
                  <StyledTextarea
                    id="ed-desc"
                    name="plantDescription"
                    value={editForm.plantDescription}
                    onChange={handleEditChange}
                    placeholder="Describe this plant…"
                  />
                </FormGroup>

                {/* ── Specifications ── */}
                <SectionTitle>📋 Specifications</SectionTitle>
                <Grid2>
                  <FormGroup>
                    <Label>Mature Size</Label>
                    <StyledInput
                      name="size"
                      value={editForm.size}
                      onChange={handleEditChange}
                      placeholder="e.g. 12-24 inches"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Sunlight</Label>
                    <StyledInput
                      name="sunlight"
                      value={editForm.sunlight}
                      onChange={handleEditChange}
                      placeholder="e.g. Bright indirect"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Water Needs</Label>
                    <StyledInput
                      name="water"
                      value={editForm.water}
                      onChange={handleEditChange}
                      placeholder="e.g. When top soil dry"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Soil Type</Label>
                    <StyledInput
                      name="soil"
                      value={editForm.soil}
                      onChange={handleEditChange}
                      placeholder="e.g. Well draining"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Temperature</Label>
                    <StyledInput
                      name="temperature"
                      value={editForm.temperature}
                      onChange={handleEditChange}
                      placeholder="e.g. 18-24°C"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Humidity</Label>
                    <StyledInput
                      name="humidity"
                      value={editForm.humidity}
                      onChange={handleEditChange}
                      placeholder="e.g. 40-60%"
                    />
                  </FormGroup>
                </Grid2>

                {/* ── Nutrients & Care ── */}
                <SectionTitle>🌿 Nutrients &amp; Care</SectionTitle>
                <FormGroup>
                  <Label>Fertilizer Schedule</Label>
                  <StyledInput
                    name="fertilizer"
                    value={editForm.fertilizer}
                    onChange={handleEditChange}
                    placeholder="e.g. Every 2-4 weeks in summer"
                  />
                </FormGroup>
                <FormGroup style={{ marginTop: '0.8rem' }}>
                  <Label>Primary Nutrients (comma separated)</Label>
                  <StyledInput
                    name="nutrients"
                    value={editForm.nutrients}
                    onChange={handleEditChange}
                    placeholder="e.g. Nitrogen, Phosphorus"
                  />
                </FormGroup>

                {/* ── More Details ── */}
                <SectionTitle>ℹ️ More Details</SectionTitle>
                <Grid2>
                  <FormGroup>
                    <Label>Origin</Label>
                    <StyledInput
                      name="origin"
                      value={editForm.origin}
                      onChange={handleEditChange}
                      placeholder="e.g. Tropical regions"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Pet Safe?</Label>
                    <StyledSelect
                      name="petSafe"
                      value={editForm.petSafe}
                      onChange={handleEditChange}
                    >
                      <option value="">Select…</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </StyledSelect>
                  </FormGroup>
                </Grid2>
                <FormGroup style={{ marginTop: '0.8rem' }}>
                  <Label>Common Issues</Label>
                  <StyledInput
                    name="commonIssues"
                    value={editForm.commonIssues}
                    onChange={handleEditChange}
                    placeholder="e.g. Yellow leaves = overwatering"
                  />
                </FormGroup>

                {/* ── Image ── */}
                <SectionTitle>📷 Plant Image</SectionTitle>
                <FormGroup>
                  <Label>Upload new image</Label>
                  <StyledInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageEdit}
                    style={{
                      padding: '0.6rem',
                      background: '#f5f5f5',
                      border: '2px dashed #ccc',
                      cursor: 'pointer',
                    }}
                  />
                  {editForm.plantImage && <ImagePreview src={editForm.plantImage} alt="Preview" />}
                </FormGroup>

                <ModalActions>
                  <SaveBtn type="submit">💾 Save Changes</SaveBtn>
                  <CancelBtn type="button" onClick={() => setEditingPlant(null)}>
                    Cancel
                  </CancelBtn>
                </ModalActions>
              </form>
            </Modal>
          </Overlay>
        )}

        <StyledHeader>
          <Heading main>🏡 {(myNursery && myNursery.name) || 'My Nursery'} Dashboard</Heading>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '1rem' }}>
            <Text>Status:</Text>
            <StyledStatus status={(myNursery && myNursery.status) || 'pending'}>
              {(myNursery && myNursery.status && myNursery.status.toUpperCase()) || 'PENDING'}
            </StyledStatus>
          </div>
        </StyledHeader>

        <StyledStatsGrid>
          <StyledStatCard>
            <StyledStatValue>{myPlants.length}</StyledStatValue>
            <Text>My Plants</Text>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatValue>$1,250</StyledStatValue>
            <Text>Total Sales</Text>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatValue>4.8</StyledStatValue>
            <Text>Rating</Text>
          </StyledStatCard>
        </StyledStatsGrid>

        <StyledSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <Heading>My Plants</Heading>
            <Link to="/nursery/add-plant" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '1rem 2rem',
                  background: '#304c40',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                + Add New Plant
              </button>
            </Link>
          </div>

          <StyledTable>
            <thead>
              <tr>
                <StyledTh>Plant Name</StyledTh>
                <StyledTh>Price</StyledTh>
                <StyledTh>Views</StyledTh>
                <StyledTh>Stock Status</StyledTh>
                <StyledTh>Actions</StyledTh>
              </tr>
            </thead>
            <tbody>
              {[...myPlants]
                .reverse()
                .slice(0, 5)
                .map(plant => (
                  <tr key={plant.id || plant.plantSlug}>
                    <StyledTd>
                      <strong>{plant.plantTitle}</strong>
                    </StyledTd>
                    <StyledTd>${plant.plantPrice}</StyledTd>
                    <StyledTd>{Math.floor(Math.random() * 100) + 10}</StyledTd>
                    <StyledTd>
                      <span style={{ color: 'green' }}>In Stock</span>
                    </StyledTd>
                    <StyledTd>
                      <EditBtn onClick={() => openEdit(plant)} style={{ marginRight: '0.5rem' }}>
                        ✏️ Edit
                      </EditBtn>
                      <DeleteBtn
                        onClick={() => {
                          if (window.confirm('Delete this plant?')) removePlant(plant.id);
                        }}
                      >
                        🗑️ Delete
                      </DeleteBtn>
                    </StyledTd>
                  </tr>
                ))}
              {myPlants.length === 0 && (
                <tr>
                  <StyledTd colSpan="5" style={{ textAlign: 'center' }}>
                    No plants added yet. Start adding your collection!
                  </StyledTd>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </StyledSection>

        {myNursery && myNursery.status === 'pending' && (
          <div
            style={{
              padding: '2rem',
              background: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '10px',
              color: '#856404',
            }}
          >
            <h3>⚠️ Account Pending Approval</h3>
            <p style={{ marginTop: '1rem' }}>
              Your nursery account is under review. Plants won&apos;t appear in the public shop
              until approved.
            </p>
          </div>
        )}
      </StyledDashboard>
    </AdminTemplate>
  );
};

export default NurseryDashboard;
