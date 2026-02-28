import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AdminTemplate from '../templates/AdminTemplate';
import Heading from '../components/atoms/Heading/Heading';
import Text from '../components/atoms/Text/Text';
import Button from '../components/atoms/Button/Button';
import { NurseryContext } from '../context/NurseryContext';
import { CartContext } from '../context/CartContext';

const API_BASE = 'http://localhost:5000/api';

const StyledDashboard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StyledStatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;
  &:hover { transform: translateY(-5px); }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color || '#f0f0f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
`;

const StatInfo = styled.div`display: flex; flex-direction: column;`;
const StatValue = styled.h3`font-size: 2.2rem; margin: 0; color: #333;`;
const StatLabel = styled.span`color: #777; font-size: 0.9rem;`;

const StyledSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ViewAllLink = styled(Link)`
  font-size: 1rem;
  color: ${({ theme }) => theme.fontColorPrimary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  th {
    text-align: left;
    padding: 1rem;
    color: #555;
    border-bottom: 2px solid #eee;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    font-size: 0.95rem;
    vertical-align: top;
  }
  tr:last-child td { border-bottom: none; }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props =>
    props.status === 'approved' ? '#e6f4ea' :
      props.status === 'pending' ? '#fef7e0' : '#fce8e6'};
  color: ${props =>
    props.status === 'approved' ? '#1e7e34' :
      props.status === 'pending' ? '#b08800' : '#c62828'};
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1.1rem;
  font-size: 0.88rem;
  font-family: inherit;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.12s;
  &:hover { opacity: 0.85; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const ApproveBtn = styled(ActionBtn)`
  background: hsla(152, 94%, 33%, 0.12);
  color: #1e7e34;
  &:hover { background: hsla(152, 94%, 33%, 0.22); }
`;

const RejectBtn = styled(ActionBtn)`
  background: hsla(45, 100%, 51%, 0.12);
  color: #b08800;
  &:hover { background: hsla(45, 100%, 51%, 0.22); }
`;

const DeleteBtn = styled(ActionBtn)`
  background: hsla(0, 80%, 50%, 0.1);
  color: #c62828;
  &:hover { background: hsla(0, 80%, 50%, 0.18); }
`;

const FeedbackBadge = styled.span`
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  background: #e8f5e9;
  color: #2e7d32;
`;

const Stars = styled.span`
  color: #f5b31c;
  font-size: 1rem;
`;

const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

const Admin = () => {
  const { nurseries, approveNursery, rejectNursery, removeNursery } = useContext(NurseryContext);
  const { plants } = useContext(CartContext);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/feedback`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setFeedbacks(Array.isArray(data) ? data : []))
      .catch(() => { });
  }, []);

  const pendingCount = nurseries.filter(n => n.status === 'pending').length;
  const approvedCount = nurseries.filter(n => n.status === 'approved').length;
  const recentFeedback = feedbacks.slice(0, 5);

  return (
    <AdminTemplate>
      <StyledDashboard>
        <StyledHeader>
          <div>
            <Heading>Admin Dashboard</Heading>
            <Text>Welcome back, Administrator</Text>
          </div>
          <Button secondary as={Link} to="/">View Site</Button>
        </StyledHeader>

        {/* Stat cards */}
        <StyledGrid>
          <StyledStatCard>
            <StatIcon color="#e3f2fd">🏪</StatIcon>
            <StatInfo>
              <StatValue>{nurseries.length}</StatValue>
              <StatLabel>Total Nurseries</StatLabel>
            </StatInfo>
          </StyledStatCard>
          <StyledStatCard>
            <StatIcon color="#fff3cd">⚠️</StatIcon>
            <StatInfo>
              <StatValue>{pendingCount}</StatValue>
              <StatLabel>Pending Requests</StatLabel>
            </StatInfo>
          </StyledStatCard>
          <StyledStatCard>
            <StatIcon color="#e8f5e9">✅</StatIcon>
            <StatInfo>
              <StatValue>{approvedCount}</StatValue>
              <StatLabel>Active Nurseries</StatLabel>
            </StatInfo>
          </StyledStatCard>
          <StyledStatCard>
            <StatIcon color="#fff8e1">💬</StatIcon>
            <StatInfo>
              <StatValue>{feedbacks.length}</StatValue>
              <StatLabel>Total Feedback</StatLabel>
            </StatInfo>
          </StyledStatCard>
        </StyledGrid>

        {/* Nursery Applications */}
        <StyledSection>
          <Heading small>Recent Nursery Applications</Heading>
          <StyledTable>
            <thead>
              <tr>
                <th>Nursery Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Plants Added</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nurseries.map(nursery => (
                <tr key={nursery.id}>
                  <td><strong>{nursery.name}</strong></td>
                  <td>{nursery.location || 'N/A'}</td>
                  <td>{nursery.contact || 'N/A'}</td>
                  <td>
                    <strong>
                      {plants ? plants.filter(p => String(p.nurseryId) === String(nursery.id)).length : 0}
                    </strong>
                  </td>
                  <td><StatusBadge status={nursery.status || 'pending'}>{nursery.status || 'pending'}</StatusBadge></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {nursery.status === 'pending' && (
                        <>
                          <ApproveBtn onClick={() => approveNursery(nursery.id)}>
                            ✅ Approve
                          </ApproveBtn>
                          <RejectBtn onClick={() => rejectNursery(nursery.id)}>
                            ✖ Reject
                          </RejectBtn>
                        </>
                      )}
                      <DeleteBtn onClick={() => {
                        if (window.confirm('Delete this nursery?')) removeNursery(nursery.id);
                      }}>
                        🗑️ Delete
                      </DeleteBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {nurseries.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>No nurseries found</td></tr>
              )}
            </tbody>
          </StyledTable>
        </StyledSection>

        {/* Recent Feedback */}
        <StyledSection>
          <SectionHeader>
            <Heading small>Recent Feedback</Heading>
            <ViewAllLink to="/admin/feedback">View All →</ViewAllLink>
          </SectionHeader>
          <StyledTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Category</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong><br /><span style={{ color: '#999', fontSize: '0.85rem' }}>{f.email}</span></td>
                  <td><Stars>{renderStars(f.rating)}</Stars></td>
                  <td><FeedbackBadge>{f.category}</FeedbackBadge></td>
                  <td style={{ maxWidth: 260, color: '#555' }}>{f.message}</td>
                  <td style={{ color: '#999', whiteSpace: 'nowrap' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentFeedback.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>No feedback yet</td></tr>
              )}
            </tbody>
          </StyledTable>
        </StyledSection>
      </StyledDashboard>
    </AdminTemplate>
  );
};

export default Admin;
