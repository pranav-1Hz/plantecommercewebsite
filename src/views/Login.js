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
  justify-content: space-around;
  flex-direction: column;
  @media only screen and (min-width: 1000px) {
    margin-bottom: 0rem;
    min-height: auto;
  }
`;

const StyledForm = styled.form`
  width: 50%;
  padding: 3rem 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  text-align: left;
`;

const inputStyles = css`
  position: relative;
  padding: 1.2rem 0.5rem;
  :last-of-type {
    margin: 1.5rem 0 1rem 0;
  }

  ::placeholder {
    color: transparent;
  }

  :not(:placeholder-shown) ~ label,
  :focus ~ label {
    transform: translate(0, -50%);
    cursor: pointer;
  }

  :focus ~ ::placeholder {
    color: inherit;
  }

  :focus {
    outline: 0;
  }
`;

const StyledInput = styled(Input)`${inputStyles}`;
const StyledPasswordInput = styled(PasswordInput)`${inputStyles}`;

const StyledHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25rem;
`;
const StyledHeading = styled(Heading)`
  text-transform: uppercase;
  font-size: 4rem;
  margin-bottom: 2rem;
`;
const StyledButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 2rem;
`;
const StyledButton = styled(Button)`
  width: 10rem;
  margin: 2rem 2rem 0 0;
`;

// The older inputStyles block is removed entirely here.

const StyledFooter = styled.footer`
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const StyledTextWrapper = styled.div`
  margin-top: 2rem;
  width: 25rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAuthor = styled.a`
  text-decoration: none;
  margin: 0 0 0 0.2rem;
  color: inherit;
`;

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
`; /* Prevent label from blocking input clicks */

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const routerHistory = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newAccount, setNewAccount] = useState(false);

  // Forgot Password States
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Request OTP, 2: Submit OTP
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [displayedOtp, setDisplayedOtp] = useState(''); // OTP shown on screen (dev mode)

  const handleNewAccount = e => {
    e.preventDefault();
    setNewAccount(!newAccount);
    setForgotPassword(false);
  };

  const handleForgotPasswordToggle = e => {
    e.preventDefault();
    setForgotPassword(!forgotPassword);
    setResetStep(1);
    setDisplayedOtp('');
  };

  const handleSignin = () => {
    fire.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userEmail = userCredential.user.email;
        if (userEmail.includes('admin')) {
          routerHistory.push('/admin');
        } else {
          routerHistory.push('/nursery');
        }
      })
      .catch(error => alert(`Sign in failed: ${error.message} `));
  };

  const handleSignup = () => {
    fire.auth().createUserWithEmailAndPassword(email, password, fullName, phoneNumber)
      .then((userCredential) => {
        alert("Account created successfully!");
        setNewAccount(false); // Switch to login view or redirect directly
        // Optional: auto-login
        // routerHistory.push('/nursery'); 
      })
      .catch(error => alert(`Sign up failed: ${error.message} `));
  };

  const handleRequestOtp = () => {
    if (!email) return alert("Please enter email first");
    fire.auth().requestPasswordReset(email)
      .then((data) => {
        // Dev mode: OTP is returned in the API response and shown on screen
        if (data.otp) {
          setDisplayedOtp(data.otp);
          setOtp(data.otp); // Auto-fill the OTP field
        }
        setResetStep(2);
      })
      .catch(err => alert(err.message));
  };

  const handleConfirmReset = () => {
    fire.auth().confirmPasswordReset(email, otp, newPassword)
      .then(() => {
        alert("Password reset successful! Please login.");
        setForgotPassword(false);
        setResetStep(1);
      })
      .catch(err => alert(err.message));
  };

  return (
    <StyledWrapper>
      <PlantHalfPage isLoginPage={true} />
      <StyledFormWrapper>
        <StyledForm onSubmit={handleSubmit(
          forgotPassword
            ? (resetStep === 1 ? handleRequestOtp : handleConfirmReset)
            : (newAccount ? handleSignup : handleSignin)
        )}>
          <StyledHeadingWrapper>
            <StyledHeading>
              {forgotPassword ? 'Reset Password' : (newAccount ? 'Sign up' : 'Sign in')}
            </StyledHeading>
          </StyledHeadingWrapper>

          {forgotPassword ? (
            // --- FORGOT PASSWORD FORM ---
            <>
              <StyledInputLabelWrapper>
                <StyledInput
                  name="resetEmail"
                  placeholder="Enter Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  ref={register({ required: true })}
                />
                <StyledLabel>Email Address</StyledLabel>
              </StyledInputLabelWrapper>

              {resetStep === 2 && (
                <>
                  {displayedOtp && (
                    <div style={{
                      background: '#f0fff4',
                      border: '2px solid #38a169',
                      borderRadius: '8px',
                      padding: '1rem',
                      margin: '1rem 0',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 0.5rem 0' }}>🔐 Your OTP Code (Dev Mode)</p>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '0.5rem', color: '#276749', margin: 0 }}>{displayedOtp}</p>
                    </div>
                  )}

                  <StyledInputLabelWrapper>
                    <StyledInput
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      ref={register({ required: true })}
                    />
                    <StyledLabel>OTP Code</StyledLabel>
                  </StyledInputLabelWrapper>

                  <StyledInputLabelWrapper>
                    <StyledPasswordInput
                      name="newPassword"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      ref={register({ required: true, minLength: 6 })}
                    />
                    <StyledLabel>New Password</StyledLabel>
                  </StyledInputLabelWrapper>
                </>
              )}

              <StyledButtonsWrapper>
                <StyledButton type="submit" secondary>
                  {resetStep === 1 ? 'Send OTP' : 'Reset Password'}
                </StyledButton>
              </StyledButtonsWrapper>

              <Button simple style={{ marginTop: '1rem' }} onClick={handleForgotPasswordToggle}>
                Back to Login
              </Button>
            </>
          ) : (
            // --- LOGIN / SIGNUP FORM ---
            <>
              <StyledInputLabelWrapper>
                <StyledInput
                  name="email"
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value)}
                  ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
                <StyledLabel>Email</StyledLabel>
              </StyledInputLabelWrapper>
              {errors.email && <Text errorMessage>Valid email is required</Text>}

              <StyledInputLabelWrapper>
                <StyledPasswordInput
                  name="password"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  ref={register({ required: true, minLength: 6 })}
                />
                <StyledLabel>Password</StyledLabel>
              </StyledInputLabelWrapper>
              {errors.password && <Text errorMessage>Password (min 6 chars) required</Text>}

              {newAccount && (
                <>
                  <StyledInputLabelWrapper>
                    <StyledInput
                      name="fullName"
                      placeholder="Full Name"
                      onChange={e => setFullName(e.target.value)}
                      ref={register({ required: newAccount })}
                    />
                    <StyledLabel>Full Name</StyledLabel>
                  </StyledInputLabelWrapper>

                  <StyledInputLabelWrapper>
                    <StyledInput
                      name="phoneNumber"
                      placeholder="Phone Number"
                      onChange={e => setPhoneNumber(e.target.value)}
                      ref={register({ required: newAccount })}
                    />
                    <StyledLabel>Phone Number</StyledLabel>
                  </StyledInputLabelWrapper>
                </>
              )}

              {!newAccount && (
                <div style={{ width: '100%', textAlign: 'right', marginTop: '0.5rem' }}>
                  <Button simple onClick={handleForgotPasswordToggle} style={{ fontSize: '0.9rem' }}>
                    Forgot Password?
                  </Button>
                </div>
              )}

              <StyledButtonsWrapper>
                <StyledButton type="submit" secondary>
                  {newAccount ? 'Sign up' : 'Sign in'}
                </StyledButton>
              </StyledButtonsWrapper>

              <StyledTextWrapper>
                <Text>{newAccount ? 'Have account?' : "Haven't got account?"}</Text>
                <Button onClick={handleNewAccount} active>
                  {newAccount ? 'Sign in' : 'Sign up'}
                </Button>
              </StyledTextWrapper>

              <div style={{ marginTop: '3rem', width: '100%', borderTop: '1px solid #eee', paddingTop: '2rem', display: 'flex', justifyContent: 'space-around' }}>
                <Button simple style={{ fontSize: '1rem', color: '#555' }} onClick={() => routerHistory.push('/nursery-login')}>
                  Nursery Partner Login
                </Button>
                <Button simple style={{ fontSize: '1rem', color: '#555' }} onClick={() => routerHistory.push('/admin-login')}>
                  🛡️ Admin Login
                </Button>
              </div>
            </>
          )}
        </StyledForm>
        <StyledFooter>
          <Text as="span">Made with <span role="img" aria-label="Heart icon">💚</span> by <StyledAuthor href="#">PRANAV</StyledAuthor></Text>
        </StyledFooter>
      </StyledFormWrapper>
    </StyledWrapper>
  );
};

export default Login;
