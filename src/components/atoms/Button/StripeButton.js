import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from './Button';

const PortalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.secondaryColor};
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  padding: 30px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.fontColorText};
`;

const PaymentOptions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 10px;
  flex-wrap: wrap;
`;

const PaymentBadge = styled.div`
  flex: 1;
  min-width: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  background: ${({ selected }) => (selected ? '#e6fff0' : '#fff')};
  border-color: ${({ selected, theme }) => (selected ? theme.primaryColor : '#ddd')};
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;

  &:hover {
    border-color: ${({ theme }) => theme.primaryColor};
  }

  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 5px;
  }
`;

const MockInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 16px;
  &::placeholder {
    color: #999;
  }
`;

const CheckoutModal = ({ price, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const history = useHistory();

  const handleSubmit = event => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate network delay for payment processing
    setTimeout(() => {
      history.push('/success');
    }, 1500);
  };

  return (
    <PortalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <div
          style={{
            marginBottom: '1.5rem',
            color: 'hsla(0, 0%, 0%, 0.8)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Secure Checkout (Demo)
        </div>

        <PaymentOptions>
          <PaymentBadge
            selected={selectedMethod === 'gpay'}
            onClick={() => setSelectedMethod('gpay')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6.5 4.5-6.5 4.5z"
                fill="#4285F4"
              />
            </svg>
            GPay
          </PaymentBadge>
          <PaymentBadge
            selected={selectedMethod === 'paytm'}
            onClick={() => setSelectedMethod('paytm')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" fill="#00baf2" />
              <text x="5" y="16" fill="white" fontSize="10" fontWeight="bold">
                Paytm
              </text>
            </svg>
            Paytm
          </PaymentBadge>
          <PaymentBadge
            selected={selectedMethod === 'card'}
            onClick={() => setSelectedMethod('card')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Card
          </PaymentBadge>
        </PaymentOptions>

        <form onSubmit={handleSubmit}>
          {selectedMethod === 'card' ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <MockInput type="text" placeholder="Card Number (e.g. 4242 4242...)" required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <MockInput type="text" placeholder="MM/YY" required style={{ flex: 1 }} />
                <MockInput type="text" placeholder="CVC" required style={{ flex: 1 }} />
              </div>
            </div>
          ) : (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: '4px',
                textAlign: 'center',
                color: '#666',
              }}
            >
              Click Pay to securely redirect to the{' '}
              {selectedMethod === 'gpay' ? 'Google Pay' : 'Paytm'} app.
            </div>
          )}

          <Button secondary type="submit" disabled={isProcessing} style={{ width: '100%' }}>
            {isProcessing ? 'Processing Payment...' : `Pay $${price} now`}
          </Button>
        </form>
      </ModalContent>
    </PortalOverlay>
  );
};

CheckoutModal.propTypes = {
  price: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

const StripeButton = ({ price }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button aria-label="Pay now" secondary onClick={() => setIsModalOpen(true)}>
        Pay now
      </Button>

      {isModalOpen && <CheckoutModal price={price} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

StripeButton.propTypes = {
  price: PropTypes.number.isRequired,
};

export default StripeButton;
