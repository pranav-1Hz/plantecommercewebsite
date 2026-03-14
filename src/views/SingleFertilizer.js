import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Heading from '../components/atoms/Heading/Heading';
import Text from '../components/atoms/Text/Text';
import Button from '../components/atoms/Button/Button';
import PlantHalfPage from '../components/molecules/PlantHalfPage';
import Header from '../components/organisms/Header';
import Modal from '../components/molecules/Modal';
import Accordion from '../components/molecules/Accordion';
import { CartContext } from '../context/CartContext';
import { NurseryContext } from '../context/NurseryContext';

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    overflow: hidden;
    height: 100vh;
  }
`;

const StyledDeteailsWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  padding: 6rem 4rem 0rem 2rem;
  @media only screen and (min-width: 1000px) {
    width: 50%;
    padding: 4rem 4rem 10rem 4rem;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const StyledTextWrapper = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 3rem 0 0 0;
  @media only screen and (min-width: 1000px) {
    margin: 2rem 0 0 2rem;
  }
`;

const StyledInfoWrapper = styled.article`
  margin-top: 2rem;
  width: 100%;
`;

const StyledPaymentWrapper = styled.div`
  margin: 3rem 0 7rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media only screen and (min-width: 1000px) {
    margin: 3rem 0 0 0;
  }
`;

const StyledPrice = styled.span`
  color: ${({ theme }) => theme.fontColorHeading};
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.bold};
`;

const StyledHeading = styled(Heading)`
  font-size: 3.5rem;
  @media only screen and (min-width: 500px) {
    font-size: 4rem;
  }
  @media only screen and (min-width: 1000px) {
    font-size: 5rem;
  }
`;

const SingleFertilizer = ({ match }) => {
  const { getFertilizer, addItem } = useContext(CartContext);
  const { nurseries } = useContext(NurseryContext);
  const [isModal, setIsModal] = useState(false);

  const fertilizer = getFertilizer(match.params.slug);

  if (!fertilizer) {
    return (
      <>
        <Header />
        <StyledWrapper style={{ justifyContent: 'center' }}>
          <Heading main>Fertilizer not found</Heading>
          <Link to="/fertilizers" style={{ textDecoration: 'none', marginTop: '2rem' }}>
            <Button secondary>Back to shop</Button>
          </Link>
        </StyledWrapper>
      </>
    );
  }

  const nursery = nurseries.find(n => String(n.id) === String(fertilizer.nurseryId));

  return (
    <StyledWrapper>
      <div
        style={{
          width: '50%',
          height: '100%',
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={
            fertilizer.image ||
            'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
          alt={fertilizer.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <StyledDeteailsWrapper>
        <StyledTextWrapper>
          <StyledHeading main>{fertilizer.name}</StyledHeading>
          <StyledInfoWrapper>
            <Text main style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              {fertilizer.weight} • Professional Grade
            </Text>

            <Accordion title="📖 Product Description">
              <Text main>{fertilizer.description}</Text>
            </Accordion>

            <Accordion title="🛠️ How to Use">
              <Text main>{fertilizer.usage || 'Refer to package for specific instructions.'}</Text>
            </Accordion>

            {nursery && (
              <Accordion title="🏡 Nursery Details">
                <Text main>
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <div>
                      <strong>Nursery:</strong> {nursery.name}
                    </div>
                    <div>
                      <strong>Location:</strong> {nursery.location || 'Not provided'}
                    </div>
                    <div>
                      <strong>Contact:</strong> {nursery.phoneNumber || nursery.contact}
                    </div>
                  </div>
                </Text>
              </Accordion>
            )}

            <StyledPaymentWrapper>
              <StyledPrice>${fertilizer.price.toFixed(2)}</StyledPrice>
              <Button
                secondary
                style={{ width: '15rem', height: '4.5rem', fontSize: '1.2rem' }}
                onClick={() => {
                  // Adapt for cartITEM structure
                  addItem({
                    ...fertilizer,
                    plantTitle: fertilizer.name, // compatibility
                    plantPrice: fertilizer.price, // compatibility
                    plantSlug: fertilizer.slug, // compatibility
                    id: fertilizer.id,
                  });
                  setIsModal(true);
                }}
              >
                Add to cart
              </Button>
            </StyledPaymentWrapper>
          </StyledInfoWrapper>
        </StyledTextWrapper>
      </StyledDeteailsWrapper>
      <Modal isVisible={isModal} handleModalChange={() => setIsModal(false)} />
    </StyledWrapper>
  );
};

export default SingleFertilizer;
