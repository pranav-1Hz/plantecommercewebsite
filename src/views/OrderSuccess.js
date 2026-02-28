import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Button from '../components/atoms/Button/Button';
import Heading from '../components/atoms/Heading/Heading';
import Text from '../components/atoms/Text/Text';

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.secondaryColor};
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10rem;
  padding: 4rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const TrackingBox = styled.div`
  background-color: ${({ theme }) => theme.secondaryColor};
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  width: 100%;
  max-width: 400px;
`;

const OrderSuccess = () => {
    // Generate a random tracking number
    const trackingNumber = Math.floor(1000000000 + Math.random() * 9000000000);

    return (
        <>
            <Header />
            <StyledWrapper>
                <StyledContent>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <Heading main>Payment Successful!</Heading>
                    <Text main style={{ marginTop: '1rem' }}>
                        Thank you for your order. Your plants are getting ready for their new home!
                    </Text>

                    <TrackingBox>
                        <Text main style={{ fontWeight: 'bold' }}>Order Tracking Status:</Text>
                        <Text main style={{ color: 'hsla(152, 94%, 33%, 1)', fontSize: '1.5rem', margin: '1rem 0' }}>
                            Processing
                        </Text>
                        <Text main>Tracking ID: <strong>#{trackingNumber}</strong></Text>
                    </TrackingBox>

                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Button secondary style={{ marginTop: '2rem' }}>
                            Continue Shopping
                        </Button>
                    </Link>
                </StyledContent>
            </StyledWrapper>
        </>
    );
};

export default OrderSuccess;
