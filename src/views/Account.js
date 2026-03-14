import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
  position: relative;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  text-decoration: none;
  font-weight: bold;
  color: ${({ theme }) => theme.primaryColor || '#304c40'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(-5px);
  }
`;

const InfoWrapper = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  background-color: ${({ theme }) => theme.secondaryColor};
  border-radius: 8px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
  font-size: 2rem;
`;

const Star = styled.span`
  cursor: pointer;
  color: ${({ active }) => (active ? '#f1c40f' : '#ccc')};
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

const Account = () => {
  const { user } = useContext(CartContext);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Feedback states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const fetchOrders = () => {
    if (user && user.uid) {
      setLoading(true);
      fetch(`http://localhost:5000/api/orders/user/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching orders:', err);
          setLoading(false);
        });
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, [user]);

  const handlePasswordReset = () => {
    if (user && user.email) {
      fire
        .auth()
        .sendPasswordResetEmail(user.email)
        .then(() => {
          alert('Password reset email sent!');
        })
        .catch(error => {
          console.error('Error sending password reset email: ', error);
          alert('Error sending password reset email.');
        });
    }
  };

  const openFeedbackModal = order => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setRating(5);
    setComment('');
  };

  const submitFeedback = async () => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName || 'Customer',
          email: user.email,
          rating,
          message: comment,
          nurseryId: selectedOrder.nurseryId,
          orderId: selectedOrder.id,
          userId: user.uid,
        }),
      });

      if (res.ok) {
        alert('Thank you for your feedback! ⭐');
        setIsModalOpen(false);
        fetchOrders(); // Refresh to hide the rate button
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Feedback error:', err);
      alert('Failed to connect to server');
    } finally {
      setSubmitting(false);
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
      <BackLink to="/">← Back to Shop</BackLink>
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
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Button secondary onClick={handlePasswordReset}>
            Reset Password
          </Button>
        </div>
      </InfoWrapper>

      <StyledHeading style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        Order History
      </StyledHeading>
      {loading ? (
        <Text>Loading your orders...</Text>
      ) : orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <div style={{ textAlign: 'left', marginTop: '2rem' }}>
          {orders.map(order => {
            const items =
              typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
            return (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  borderLeft: `5px solid ${
                    order.status === 'delivered'
                      ? '#304c40'
                      : order.status === 'shipped'
                      ? '#2ecc71'
                      : order.status === 'processing'
                      ? '#f1c40f'
                      : order.status === 'pending'
                      ? '#e67e22'
                      : '#ccc'
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <strong>Order #{order.id}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {order.status === 'delivered' && !order.isRated && (
                      <Button
                        secondary
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.8rem',
                          background: '#f1c40f',
                          border: 'none',
                        }}
                        onClick={() => openFeedbackModal(order)}
                      >
                        ⭐ Rate Nursery
                      </Button>
                    )}
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        background: '#f0f0f0',
                        color: '#666',
                      }}
                    >
                      {order.status ? order.status.toUpperCase() : 'PENDING'}
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.9rem', color: '#444' }}>
                      {item.quantity}x {item.plantTitle}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    color: '#888',
                  }}
                >
                  <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <strong style={{ color: '#304c40', fontSize: '1rem' }}>
                    Total: ${order.totalAmount}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <StyledHeading style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              How was your experience? 🌱
            </StyledHeading>
            <Text>Please rate your order from this nursery</Text>

            <StarRating>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} active={star <= rating} onClick={() => setRating(star)}>
                  ★
                </Star>
              ))}
            </StarRating>

            <textarea
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                minHeight: '100px',
                marginBottom: '1.5rem',
                fontFamily: 'inherit',
              }}
              placeholder="Tell us about the plant quality and delivery..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button secondary style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button style={{ flex: 1 }} onClick={submitFeedback} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </StyledWrapper>
  );
};

export default Account;
