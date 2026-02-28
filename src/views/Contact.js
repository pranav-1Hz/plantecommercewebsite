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
  max-width: 640px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 3rem 2.5rem;
  margin-top: 2.5rem;
`;

/* ─── Info strip ──────────────────────────────────────────── */
const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`;

const InfoIcon = styled.span`
  font-size: 1.8rem;
`;
const InfoLabel = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.fontColorText};
  margin: 0;
  font-weight: ${({ theme }) => theme.regular};
`;
const InfoValue = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.fontColorHeading};
  margin: 0;
  font-weight: ${({ theme }) => theme.regular};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.secondaryColor};
  margin: 0 0 1.5rem;
`;

/* ─── Form elements ───────────────────────────────────────── */
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: #c62828;
  font-size: 1rem;
  background: #fce8e6;
  padding: 0.75rem 1rem;
  border-radius: 4px;
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;
const SuccessEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
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
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
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
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Header />
      <Main>
        <StyledHeading main>Contact Us</StyledHeading>
        <Text main style={{ textAlign: 'center', maxWidth: '500px' }}>
          We&apos;d love to hear from you. Send us a message and we will get back to you as soon as
          possible.
        </Text>

        <Card>
          {submitted ? (
            <SuccessCard>
              <SuccessEmoji>🌿</SuccessEmoji>
              <StyledHeading main>Message Sent!</StyledHeading>
              <SuccessMsg>
                Thank you for reaching out. We&apos;ll get back to you shortly.
              </SuccessMsg>
              <BackLink href="/">← Back to Home</BackLink>
            </SuccessCard>
          ) : (
            <>
              <InfoRow>
                <InfoItem>
                  <InfoIcon>📧</InfoIcon>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>hello@plantshop.com</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoIcon>📞</InfoIcon>
                  <InfoLabel>Phone</InfoLabel>
                  <InfoValue>+1 (555) 123-4567</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoIcon>📍</InfoIcon>
                  <InfoLabel>Location</InfoLabel>
                  <InfoValue>New York, USA</InfoValue>
                </InfoItem>
              </InfoRow>

              <Divider />

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <StyledForm onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="ct-name">Your Name</Label>
                  <StyledInput
                    id="ct-name"
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ct-email">Email Address</Label>
                  <StyledInput
                    id="ct-email"
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ct-subject">Subject</Label>
                  <StyledInput
                    id="ct-subject"
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="ct-message">Message</Label>
                  <StyledTextarea
                    id="ct-message"
                    name="message"
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message'}
                </SubmitButton>
              </StyledForm>
            </>
          )}
        </Card>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default Contact;
