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

const StyledInput = styled(Input)`
  ${inputStyles}
`;
const StyledPasswordInput = styled(PasswordInput)`
  ${inputStyles}
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
`;

const AdminLogin = () => {
  const { register, handleSubmit, errors } = useForm();
  const routerHistory = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password States
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Request OTP, 2: Submit OTP
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [displayedOtp, setDisplayedOtp] = useState(''); // Fallback for debugging
  const [resendTimer, setResendTimer] = useState(0);

  const handleForgotPasswordToggle = e => {
    e.preventDefault();
    setForgotPassword(!forgotPassword);
    setResetStep(1);
  };

  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(t => t - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRequestOtp = () => {
    if (!email) return alert('Please enter your admin email first');
    fire
      .auth()
      .requestPasswordReset(email)
      .then(data => {
        if (data.otp) setDisplayedOtp(data.otp);
        setResetStep(2);
        setResendTimer(60);
      })
      .catch(err => alert(err.message));
  };

  const handleConfirmReset = () => {
    if (!otp || !newPassword) return alert('Please fill in all fields');
    fire
      .auth()
      .confirmPasswordReset(email, otp, newPassword)
      .then(() => {
        alert('Password reset successful! Please login.');
        setForgotPassword(false);
        setResetStep(1);
      })
      .catch(err => alert(err.message));
  };

  const handleEmailChange = e => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);

  const handleSignin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert('Please enter both email and password');
      return;
    }

    fire
      .auth()
      .signInAdmin(trimmedEmail, trimmedPassword)
      .then(() => {
        setTimeout(() => {
          routerHistory.push('/admin');
        }, 500);
      })
      .catch(error => {
        alert(`Login failed: ${error.message}`);
      });
  };

  return (
    <StyledWrapper>
      <PlantHalfPage isLoginPage={true} />
      <StyledFormWrapper>
        <Heading>🛡️ Admin Portal</Heading>
        <Text>Restricted Access Only</Text>

        <StyledForm
          onSubmit={handleSubmit(
            forgotPassword
              ? resetStep === 1
                ? handleRequestOtp
                : handleConfirmReset
              : handleSignin,
          )}
        >
          {forgotPassword ? (
            <>
              <StyledInputLabelWrapper>
                <StyledInput
                  name="resetEmail"
                  placeholder="Enter Admin Email"
                  value={email}
                  onChange={handleEmailChange}
                  ref={register({ required: true })}
                />
                <StyledLabel>Admin Email</StyledLabel>
              </StyledInputLabelWrapper>

              {resetStep === 2 && (
                <>
                  {displayedOtp && (
                    <div
                      style={{
                        background: '#fff5f5',
                        border: '2px solid #feb2b2',
                        borderRadius: '8px',
                        padding: '1rem',
                        margin: '1rem 0',
                        textAlign: 'center',
                      }}
                    >
                      <p style={{ color: '#c53030', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                        ⚠️ Email delivery failed. Use this code:
                      </p>
                      <p
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          letterSpacing: '4px',
                          margin: 0,
                        }}
                      >
                        {displayedOtp}
                      </p>
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

              <Button type="submit" secondary style={{ width: '100%', marginTop: '1rem' }}>
                {resetStep === 1 ? 'Send OTP' : 'Reset Password'}
              </Button>

              {resetStep === 2 && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <Button
                    simple
                    disabled={resendTimer > 0}
                    onClick={handleRequestOtp}
                    style={{
                      fontSize: '0.9rem',
                      color: resendTimer > 0 ? '#aaa' : '#555',
                      cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </Button>
                </div>
              )}
              <Button
                simple
                style={{ marginTop: '1rem', textDecoration: 'underline' }}
                onClick={handleForgotPasswordToggle}
              >
                Back to Login
              </Button>
            </>
          ) : (
            <>
              <StyledInputLabelWrapper>
                <StyledInput
                  name="email"
                  placeholder="Admin Email"
                  onChange={handleEmailChange}
                  ref={register({
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email',
                    },
                  })}
                />
                <StyledLabel>Admin Email</StyledLabel>
              </StyledInputLabelWrapper>
              {errors.email && <Text errorMessage>{errors.email.message}</Text>}

              <StyledInputLabelWrapper>
                <StyledPasswordInput
                  name="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  ref={register({ required: true })}
                />
                <StyledLabel>Password</StyledLabel>
              </StyledInputLabelWrapper>
              {errors.password && <Text errorMessage>Password is required</Text>}

              <div style={{ width: '100%', textAlign: 'right', marginTop: '-1rem' }}>
                <Button simple onClick={handleForgotPasswordToggle} style={{ fontSize: '0.9rem' }}>
                  Forgot Password?
                </Button>
              </div>

              <Button type="submit" secondary style={{ width: '100%', marginTop: '1rem' }}>
                Login to Dashboard
              </Button>
            </>
          )}
        </StyledForm>

        <Button simple style={{ marginTop: '1rem' }} onClick={() => routerHistory.push('/')}>
          Back to Shop
        </Button>
      </StyledFormWrapper>
    </StyledWrapper>
  );
};

export default AdminLogin;
