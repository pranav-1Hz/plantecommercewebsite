import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminTemplate from '../../templates/AdminTemplate';
import Heading from '../../components/atoms/Heading/Heading';

const API_BASE = 'http://localhost:5000/api';

/* ─── Styles ──────────────────────────────────────────────── */
const Wrapper = styled.div`max-width: 1100px; width: 100%;`;

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
  span.val { font-size: 1.8rem; font-weight: 700; color: #222; }
  span.icon { font-size: 1.6rem; }
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

const SubjectBadge = styled.span`
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  background: #e3f2fd;
  color: #1565c0;
`;

const MessageCell = styled.td`
  max-width: 300px;
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
  td { text-align: center; color: #aaa; padding: 3rem; font-size: 1.1rem; }
`;

const ErrorMsg = styled.p`
  color: #c62828;
  background: #fce8e6;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

/* ─── Component ───────────────────────────────────────────── */
const ContactList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/contact`);
            if (!res.ok) throw new Error('Failed to load messages');
            const data = await res.json();
            setMessages(data);
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

    useEffect(() => { fetchMessages(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await fetch(`${API_BASE}/contact/${id}`, { method: 'DELETE' });
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    return (
        <AdminTemplate>
            <Wrapper>
                <PageHeader>
                    <Heading main>📩 Contact Messages</Heading>
                </PageHeader>

                <StatsRow>
                    <StatPill>
                        <span className="icon">📩</span>
                        <div>
                            <span className="val">{messages.length}</span>
                            <div>Total Messages</div>
                        </div>
                    </StatPill>
                    <StatPill>
                        <span className="icon">📅</span>
                        <div>
                            <span className="val">
                                {messages.filter(m => {
                                    const d = new Date(m.createdAt);
                                    const now = new Date();
                                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                }).length}
                            </span>
                            <div>This Month</div>
                        </div>
                    </StatPill>
                </StatsRow>

                {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}

                <TableWrapper>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <EmptyRow><td colSpan="7">Loading messages…</td></EmptyRow>
                            ) : messages.length === 0 ? (
                                <EmptyRow><td colSpan="7">📭 No contact messages yet</td></EmptyRow>
                            ) : (
                                messages.map((m, idx) => (
                                    <tr key={m.id}>
                                        <td style={{ color: '#aaa' }}>{idx + 1}</td>
                                        <td><strong>{m.name}</strong></td>
                                        <td style={{ color: '#666' }}>{m.email}</td>
                                        <td><SubjectBadge>{m.subject || '(No subject)'}</SubjectBadge></td>
                                        <MessageCell>{m.message}</MessageCell>
                                        <td style={{ color: '#999', whiteSpace: 'nowrap' }}>
                                            {new Date(m.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <DeleteBtn onClick={() => handleDelete(m.id)}>🗑️ Delete</DeleteBtn>
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

export default ContactList;
