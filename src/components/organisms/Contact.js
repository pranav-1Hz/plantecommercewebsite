import React, { useState } from 'react';
import styled from 'styled-components';
import StyledHeading from '../atoms/Heading/Heading';
import Text from '../atoms/Text/Text';

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
  gap: 1.2rem;
  margin-top: 2.5rem;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  max-width: 480px;
  padding: 12px 20px;
  font-size: 1.1rem;
  font-family: inherit;
  background-color: #fff;
  border: 2px solid transparent;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  max-width: 480px;
  padding: 12px 20px;
  font-size: 1.1rem;
  font-family: inherit;
  background-color: #fff;
  border: 2px solid transparent;
  border-radius: 4px;
  resize: vertical;
  min-height: 130px;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const SubmitButton = styled.button`
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
`;

const SuccessMsg = styled.p`
  color: ${({ theme }) => theme.fontColorPrimary};
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.regular};
  margin-top: 1.5rem;
`;

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <StyledSection id="contact">
      <ContentWrapper>
        <StyledHeading main>Contact Us</StyledHeading>
        <Text main style={{ textAlign: 'center' }}>
          Have a question or just want to say hi? Fill in the form below and
          we&apos;ll get back to you as soon as possible.
        </Text>
        {submitted ? (
          <SuccessMsg>🌿 Thank you! Your message has been sent.</SuccessMsg>
        ) : (
          <StyledForm onSubmit={handleSubmit}>
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
            <StyledTextarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
            />
            <SubmitButton type="submit">Send Message</SubmitButton>
          </StyledForm>
        )}
      </ContentWrapper>
    </StyledSection>
  );
};

export default Contact;
