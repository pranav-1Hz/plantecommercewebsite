import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';

const API_BASE = 'http://localhost:5000/api';

/* ─── Styles ──────────────────────────────────────────────── */
const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const StatPill = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.2rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: #555;
  span.val {
    font-size: 1.8rem;
    font-weight: 700;
    color: #222;
  }
  span.icon {
    font-size: 1.6rem;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledSelect = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 1rem 1.2rem;
    color: #555;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #f0f0f0;
    background: #fafafa;
  }

  td {
    padding: 1rem 1.2rem;
    border-bottom: 1px solid #f5f5f5;
    font-size: 0.95rem;
    vertical-align: top;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafff8; }
`;

const Stars = styled.span`
  color: #f5b31c;
  font-size: 1.1rem;
  letter-spacing: 1px;
`;

const CategoryBadge = styled.span`
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  background: #e8f5e9;
  color: #2e7d32;
`;

const MessageCell = styled.td`
  max-width: 280px;
  color: #444;
  line-height: 1.5;
`;

const DeleteBtn = styled.button`
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
  background: hsla(0, 80%, 50%, 0.1);
  color: #c62828;
  transition: opacity 0.18s, transform 0.12s, background 0.2s;
  &:hover { 
    background: hsla(0, 80%, 50%, 0.18);
    opacity: 0.85; 
    transform: translateY(-1px); 
  }
  &:active { transform: translateY(0); }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    color: #aaa;
    padding: 3rem;
    font-size: 1.1rem;
  }
`;

const ErrorMsg = styled.p`
  color: #c62828;
  background: #fce8e6;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

/* ─── Helpers ─────────────────────────────────────────────── */
const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

const avgRating = (list) =>
  list.length ? (list.reduce((s, f) => s + f.rating, 0) / list.length).toFixed(1) : '—';

/* ─── Component ───────────────────────────────────────────── */
const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/feedback`);
      if (!res.ok) throw new Error('Failed to load feedback');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot reach the server. Make sure the backend is running.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback entry?')) return;
    try {
      await fetch(`${API_BASE}/feedback/${id}`, { method: 'DELETE' });
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Derived
  const categories = ['All', ...new Set(feedbacks.map((f) => f.category))];
  const filtered = feedbacks.filter((f) => {
    const catOk = categoryFilter === 'All' || f.category === categoryFilter;
    const ratOk = ratingFilter === 'All' || f.rating === Number(ratingFilter);
    return catOk && ratOk;
  });

  return (
    <AdminTemplate>
      <Wrapper>
        <PageHeader>
          <Heading main>💬 Feedback Responses</Heading>
        </PageHeader>

        {/* Stats */}
        <StatsRow>
          <StatPill>
            <span className="icon">💬</span>
            <div>
              <span className="val">{feedbacks.length}</span>
              <div>Total Responses</div>
            </div>
          </StatPill>
          <StatPill>
            <span className="icon">⭐</span>
            <div>
              <span className="val">{avgRating(feedbacks)}</span>
              <div>Avg Rating</div>
            </div>
          </StatPill>
          <StatPill>
            <span className="icon">🌟</span>
            <div>
              <span className="val">{feedbacks.filter((f) => f.rating === 5).length}</span>
              <div>5-Star Reviews</div>
            </div>
          </StatPill>
        </StatsRow>

        {/* Filters */}
        <FilterRow>
          <StyledSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </StyledSelect>
          <StyledSelect value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="All">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </StyledSelect>
        </FilterRow>

        {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Category</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <EmptyRow><td colSpan="8">Loading feedback…</td></EmptyRow>
              ) : filtered.length === 0 ? (
                <EmptyRow><td colSpan="8">🌱 No feedback found</td></EmptyRow>
              ) : (
                filtered.map((f, idx) => (
                  <tr key={f.id}>
                    <td style={{ color: '#aaa' }}>{idx + 1}</td>
                    <td><strong>{f.name}</strong></td>
                    <td style={{ color: '#666' }}>{f.email}</td>
                    <td><Stars>{renderStars(f.rating)}</Stars></td>
                    <td><CategoryBadge>{f.category}</CategoryBadge></td>
                    <MessageCell>{f.message}</MessageCell>
                    <td style={{ color: '#999', whiteSpace: 'nowrap' }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <DeleteBtn onClick={() => handleDelete(f.id)}>🗑️ Delete</DeleteBtn>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Wrapper>
    </AdminTemplate>
  );
};

export default FeedbackList;
