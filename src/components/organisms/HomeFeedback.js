import React, { useState } from 'react';
import styled from 'styled-components';
import StyledHeading from '../atoms/Heading/Heading';
import Text from '../atoms/Text/Text';

const API_BASE = 'http://localhost:5000/api';

const StyledSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme.secondaryColor};
  text-align: center;
  margin-top: 5rem;
`;

const ContentWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 2.5rem;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 520px;
  flex-wrap: wrap;
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 160px;
  padding: 11px 16px;
  font-size: 1.05rem;
  font-family: inherit;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: ${({ theme }) => theme.fontColorPrimary}; }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  max-width: 520px;
  padding: 11px 16px;
  font-size: 1.05rem;
  font-family: inherit;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 4px;
  resize: vertical;
  min-height: 110px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: ${({ theme }) => theme.fontColorPrimary}; }
`;

const RatingRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const RatingBtn = styled.button`
  padding: 0.35rem 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 4px;
  border: 2px solid
    ${({ selected, theme }) => selected ? theme.fontColorPrimary : 'transparent'};
  background: ${({ selected, theme }) => selected ? theme.primaryColor : '#fff'};
  cursor: pointer;
  transition: all 0.18s;
  &:hover { border-color: ${({ theme }) => theme.fontColorPrimary}; }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.fontColorPrimary};
  color: #fff;
  border: none;
  padding: 0.7rem 2.5rem;
  font-size: 1.15rem;
  font-family: inherit;
  font-weight: ${({ theme }) => theme.regular};
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
  color: #c62828;
  background: #fce8e6;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  font-size: 0.95rem;
`;

const SuccessMsg = styled.p`
  color: ${({ theme }) => theme.fontColorPrimary};
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.regular};
  margin-top: 1.5rem;
`;

const RATINGS = [1, 2, 3, 4, 5];

const HomeFeedback = () => {
    const [form, setForm] = useState({ name: '', email: '', rating: null, category: 'General', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating) { setError('Please choose a star rating.'); return; }
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Submission failed');
            setSubmitted(true);
        } catch (err) {
            setError(
                err.message === 'Failed to fetch'
                    ? 'Cannot reach the server. Please make sure the backend is running.'
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledSection id="feedback">
            <ContentWrapper>
                <StyledHeading main>Share Your Feedback</StyledHeading>
                <Text main style={{ textAlign: 'center' }}>
                    Loved a plant? Had a great experience? Let us know — your voice shapes
                    our shop! 🌿
                </Text>

                {submitted ? (
                    <SuccessMsg>🌟 Thank you! Your feedback has been saved.</SuccessMsg>
                ) : (
                    <StyledForm onSubmit={handleSubmit}>
                        {error && <ErrorMsg>{error}</ErrorMsg>}

                        <Row>
                            <StyledInput
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <StyledInput
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </Row>

                        <RatingRow>
                            {RATINGS.map((star) => (
                                <RatingBtn
                                    key={star}
                                    type="button"
                                    selected={form.rating === star}
                                    onClick={() => setForm({ ...form, rating: star })}
                                >
                                    {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                                </RatingBtn>
                            ))}
                        </RatingRow>

                        <StyledTextarea
                            name="message"
                            placeholder="Tell us what you think…"
                            value={form.message}
                            onChange={handleChange}
                            required
                        />

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? 'Submitting…' : 'Submit Feedback'}
                        </SubmitButton>
                    </StyledForm>
                )}
            </ContentWrapper>
        </StyledSection>
    );
};

export default HomeFeedback;
