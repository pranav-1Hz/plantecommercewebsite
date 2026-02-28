import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import StyledHeading from '../components/atoms/Heading/Heading';
import Text from '../components/atoms/Text/Text';

const API_BASE = 'http://localhost:5000/api';

/* ─── Layout ─────────────────────────────────────────────── */
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 2rem 6rem;
  background-color: ${({ theme }) => theme.secondaryColor};
`;

const Card = styled.div`
  width: 100%;
  max-width: 650px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 3rem 2.5rem;
  margin-top: 2.5rem;
`;

/* ─── Form elements ───────────────────────────────────────── */
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 2rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.regular};
  color: ${({ theme }) => theme.fontColorHeading};
  margin-bottom: 0.3rem;
  display: block;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 11px 16px;
  font-size: 1.1rem;
  font-family: inherit;
  background-color: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 11px 16px;
  font-size: 1.1rem;
  font-family: inherit;
  background-color: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 4px;
  resize: vertical;
  min-height: 140px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const RatingRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RatingButton = styled.button`
  padding: 0.45rem 0.9rem;
  font-size: 1.1rem;
  font-family: inherit;
  border-radius: 4px;
  border: 2px solid
    ${({ selected, theme }) =>
    selected ? theme.fontColorPrimary : 'transparent'};
  background-color: ${({ selected, theme }) =>
    selected ? theme.primaryColor : theme.secondaryColor};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.fontColorPrimary};
  color: #fff;
  border: none;
  padding: 0.75rem 2.5rem;
  font-size: 1.2rem;
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
  font-size: 1rem;
  background: #fce8e6;
  padding: 0.75rem 1rem;
  border-radius: 4px;
`;

const SuccessCard = styled.div`text-align: center; padding: 3rem 2rem;`;
const SuccessEmoji = styled.div`font-size: 4rem; margin-bottom: 1rem;`;
const SuccessMsg = styled.p`
  color: ${({ theme }) => theme.fontColorPrimary};
  font-size: 1.3rem;
  font-weight: ${({ theme }) => theme.regular};
`;
const BackLink = styled.a`
  display: inline-block;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.fontColorPrimary};
  font-size: 1.1rem;
  text-decoration: underline;
  cursor: pointer;
`;

/* ─── Component ───────────────────────────────────────────── */
const RATINGS = [1, 2, 3, 4, 5];

const Feedback = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    rating: null,
    category: 'General',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { setError('Please select a star rating.'); return; }
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
    <PageWrapper>
      <Header />
      <Main>
        <StyledHeading main>Share Your Feedback</StyledHeading>
        <Text main style={{ textAlign: 'center', maxWidth: '500px' }}>
          We love hearing from our plant community. Tell us how we can improve
          your experience!
        </Text>

        <Card>
          {submitted ? (
            <SuccessCard>
              <SuccessEmoji>🌿</SuccessEmoji>
              <StyledHeading main>Thank you!</StyledHeading>
              <SuccessMsg>
                Your feedback helps us grow. We truly appreciate you taking the
                time to share your thoughts.
              </SuccessMsg>
              <BackLink href="/">← Back to Home</BackLink>
            </SuccessCard>
          ) : (
            <StyledForm onSubmit={handleSubmit}>
              {error && <ErrorMsg>{error}</ErrorMsg>}

              <div>
                <Label htmlFor="fb-name">Your Name</Label>
                <StyledInput
                  id="fb-name"
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fb-email">Email Address</Label>
                <StyledInput
                  id="fb-email"
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Overall Rating</Label>
                <RatingRow>
                  {RATINGS.map((star) => (
                    <RatingButton
                      key={star}
                      type="button"
                      selected={form.rating === star}
                      onClick={() => setForm({ ...form, rating: star })}
                    >
                      {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                    </RatingButton>
                  ))}
                </RatingRow>
              </div>

              <div>
                <Label htmlFor="fb-category">Category</Label>
                <StyledInput
                  as="select"
                  id="fb-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>General</option>
                  <option>Product Quality</option>
                  <option>Shipping &amp; Delivery</option>
                  <option>Customer Service</option>
                  <option>Website Experience</option>
                </StyledInput>
              </div>

              <div>
                <Label htmlFor="fb-message">Your Feedback</Label>
                <StyledTextarea
                  id="fb-message"
                  name="message"
                  placeholder="Tell us what you think..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Feedback'}
              </SubmitButton>
            </StyledForm>
          )}
        </Card>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default Feedback;
