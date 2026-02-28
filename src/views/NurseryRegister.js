import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { fire } from '../firebase/Firebase';
import Input from '../components/atoms/Input/Input';
import PasswordInput from '../components/atoms/Input/PasswordInput';
import Heading from '../components/atoms/Heading/Heading';
import Button from '../components/atoms/Button/Button';
import PlantHalfPage from '../components/molecules/PlantHalfPage';
import Text from '../components/atoms/Text/Text';

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    overflow: hidden !important;
    height: 100vh;
  }
`;

const StyledFormWrapper = styled.div`
  min-height: 80vh;
  margin-top: 8rem;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media only screen and (min-width: 1000px) {
    margin-bottom: 0rem;
    min-height: auto;
  }
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 450px;
  padding: 3rem 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  text-align: left;
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
  margin-bottom: 1.5rem;

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

const StyledHeading = styled(Heading)`
  text-transform: uppercase;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const NurseryRegister = () => {
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const [success, setSuccess] = useState(false);

    const onSubmit = (data) => {
        fire.auth().registerNursery({
            email: data.contactEmail,
            password: data.password,
            storeName: data.nurseryName,
            location: data.location,
            phoneNumber: '000-000-0000' // Placeholder
        })
            .then(() => {
                setSuccess(true);
                setTimeout(() => {
                    history.push('/nursery-login');
                }, 3000);
            })
            .catch(err => {
                console.error(err);
                alert(`Registration failed: ${err.message}`);
            });
    };

    return (
        <StyledWrapper>
            <PlantHalfPage isLoginPage={true} />
            <StyledFormWrapper>
                {success ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <Heading>🎉 Application Submitted!</Heading>
                        <Text style={{ marginTop: '1rem' }}>
                            Your nursery account has been created!
                            Redirecting to login...
                        </Text>
                    </div>
                ) : (
                    <StyledForm onSubmit={handleSubmit(onSubmit)}>
                        <StyledHeading>Register Nursery</StyledHeading>

                        <StyledInputLabelWrapper>
                            <StyledInput
                                name="nurseryName"
                                placeholder="Nursery Name"
                                ref={register({ required: true })}
                            />
                            <StyledLabel>Nursery Name</StyledLabel>
                        </StyledInputLabelWrapper>
                        {errors.nurseryName && <Text errorMessage>Name is required</Text>}

                        <StyledInputLabelWrapper>
                            <StyledInput
                                name="location"
                                placeholder="Location (City, State)"
                                ref={register({ required: true })}
                            />
                            <StyledLabel>Location (City, State)</StyledLabel>
                        </StyledInputLabelWrapper>
                        {errors.location && <Text errorMessage>Location is required</Text>}

                        <StyledInputLabelWrapper>
                            <StyledInput
                                name="contactEmail"
                                placeholder="Contact Email"
                                ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                            />
                            <StyledLabel>Contact Email</StyledLabel>
                        </StyledInputLabelWrapper>
                        {errors.contactEmail && <Text errorMessage>Valid email is required</Text>}

                        <StyledInputLabelWrapper>
                            <StyledPasswordInput
                                name="password"
                                placeholder="Password"
                                ref={register({ required: true, minLength: 6 })}
                            />
                            <StyledLabel>Password</StyledLabel>
                        </StyledInputLabelWrapper>
                        {errors.password && <Text errorMessage>Password (min 6 chars) is required</Text>}

                        <Button type="submit" secondary style={{ marginTop: '1rem', width: '100%' }}>
                            Submit Application
                        </Button>

                        <Button
                            simple
                            onClick={(e) => { e.preventDefault(); history.push('/'); }}
                            style={{ marginTop: '1rem' }}
                        >
                            Cancel
                        </Button>
                    </StyledForm>
                )}
            </StyledFormWrapper>
        </StyledWrapper>
    );
};

export default NurseryRegister;
