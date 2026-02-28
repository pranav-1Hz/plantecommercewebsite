import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import { useHistory, Redirect } from 'react-router-dom';
import { fire } from '../firebase/Firebase';
import Input from '../components/atoms/Input/Input';
import PasswordInput from '../components/atoms/Input/PasswordInput';
import Heading from '../components/atoms/Heading/Heading';
import Button from '../components/atoms/Button/Button';
import Text from '../components/atoms/Text/Text';
import PlantHalfPage from '../components/molecules/PlantHalfPage';
import { CartContext } from '../context/CartContext';

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    overflow: hidden !important;
    height: 100vh;
  }
`;

const StyledFormWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const inputStyles = css`
  position: relative;
  padding: 1.2rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 1.1rem;

  :last-of-type {
    margin: 1.5rem 0 1rem 0;
  }

  ::placeholder {
    color: transparent;
  }

  :not(:placeholder-shown) ~ label,
  :focus ~ label {
    transform: translate(0, -65%);
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryColor};
    cursor: pointer;
  }

  :focus ~ ::placeholder {
    color: #999;
  }

  :focus {
    outline: 0;
    border-color: ${({ theme }) => theme.primaryColor};
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(5, 163, 89, 0.1);
  }
`;

const StyledInput = styled(Input)`${inputStyles}`;
const StyledPasswordInput = styled(PasswordInput)`${inputStyles}`;

const StyledInputLabelWrapper = styled.div`
  display: flex;
  flex-flow: column-reverse;
  position: relative;
  width: 100%;
  margin-bottom: 2rem;

  input ~ label {
    line-height: 1;
    height: 4rem;
    transition: transform 0.25s, font-size 0.25s, color 0.25s ease-in-out;
    transform-origin: left top;
    transform: translate(15px, 20%);
    position: absolute;
    left: 0;
  }
`;

const StyledLabel = styled.label`
  letter-spacing: 1px;
  color: #777;
  font-size: 1rem;
  position: absolute;
  user-select: none;
  pointer-events: none;
`;

const NurseryLogin = () => {
  const { user } = useContext(CartContext);
  const { register, handleSubmit, errors } = useForm();
  const routerHistory = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = () => {
    fire.auth()
      .signInNursery(email, password)
      .then(() => {
        window.location.href = '/nursery';
      })
      .catch(error => {
        alert(`Login failed: ${error.message}`);
      });
  };

  if (user && user.role === 'nursery') return <Redirect to="/nursery" />;

  return (
    <StyledWrapper>
      <PlantHalfPage isLoginPage={true} />
      <StyledFormWrapper>
        <Heading>🏡 Nursery Partner</Heading>
        <Text>Manage your store and inventory</Text>

        <StyledForm onSubmit={handleSubmit(handleSignin)}>
          <StyledInputLabelWrapper>
            <StyledInput
              name="email"
              placeholder="Nursery Email"
              onChange={(e) => setEmail(e.target.value)}
              ref={register({ required: true })}
            />
            <StyledLabel>Nursery Email</StyledLabel>
          </StyledInputLabelWrapper>
          {errors.email && <Text errorMessage>Email is required</Text>}

          <StyledInputLabelWrapper>
            <StyledPasswordInput
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              ref={register({ required: true })}
            />
            <StyledLabel>Password</StyledLabel>
          </StyledInputLabelWrapper>
          {errors.password && <Text errorMessage>Password is required</Text>}

          <Button type="submit" secondary style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </Button>
        </StyledForm>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Button
            simple
            onClick={() => routerHistory.push('/nursery-register')}
            style={{ fontSize: '1.1rem', textDecoration: 'underline' }}
          >
            New here? Register your Nursery
          </Button>
          <Button simple onClick={() => routerHistory.push('/')}>
            Back to Shop
          </Button>
        </div>
      </StyledFormWrapper>
    </StyledWrapper>
  );
};

export default NurseryLogin;
