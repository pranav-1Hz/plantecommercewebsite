import React, { useContext } from 'react';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import { fire } from '../firebase/Firebase';
import MainTemplate from '../templates/MainTemplate';
import StyledHeading from '../components/atoms/Heading/Heading';
import Text from '../components/atoms/Text/Text';
import Button from '../components/atoms/Button/Button';

const StyledWrapper = styled.div`
  padding: 5rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const InfoWrapper = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  background-color: ${({ theme }) => theme.secondaryColor};
  border-radius: 8px;
`;

const Account = () => {
    const { user } = useContext(CartContext);

    const handlePasswordReset = () => {
        if (user && user.email) {
            fire.auth().sendPasswordResetEmail(user.email)
                .then(() => {
                    alert('Password reset email sent!');
                })
                .catch((error) => {
                    console.error("Error sending password reset email: ", error);
                    alert('Error sending password reset email.');
                });
        }
    };

    if (!user) {
        return (
            <StyledWrapper>
                <Text>Please log in to view your account.</Text>
            </StyledWrapper>
        );
    }

    return (
        <StyledWrapper>
            <StyledHeading main>My Account</StyledHeading>
            <InfoWrapper>
                <Text main style={{ textAlign: 'center' }}>
                    <strong>Email:</strong> {user.email}
                </Text>
                <Text main style={{ textAlign: 'center' }}>
                    <strong>Full Name:</strong> {user.displayName || 'Not set'}
                </Text>
                <Text main style={{ textAlign: 'center' }}>
                    <strong>Phone:</strong> {user.phoneNumber || 'Not set'}
                </Text>
                <Text main style={{ textAlign: 'center' }}>
                    <strong>User ID:</strong> {user.uid}
                </Text>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <Button secondary onClick={handlePasswordReset}>
                        Reset Password
                    </Button>
                </div>
            </InfoWrapper>
        </StyledWrapper>
    );
};

export default Account;
