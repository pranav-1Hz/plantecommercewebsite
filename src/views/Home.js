import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { NurseryContext } from '../context/NurseryContext';
import Products from '../components/organisms/Products';
import Hero from '../components/organisms/Hero';
import Header from '../components/organisms/Header';
import About from '../components/organisms/About';
import Footer from '../components/organisms/Footer';
import StyledHeading from '../components/atoms/Heading/Heading';

const SectionHeader = styled.div`
  max-width: 70vw;
  margin: 4rem auto 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media only screen and (max-width: 1000px) {
    max-width: 90vw;
    padding: 0 1rem;
  }
`;

const ViewAllBtn = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.fontColorPrimary};
  color: #fff;
  text-decoration: none;
  padding: 0.65rem 1.8rem;
  border-radius: 4px;
  font-size: 1.05rem;
  font-weight: ${({ theme }) => theme.regular};
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

const Home = () => {
  const { plants } = useContext(CartContext);
  const { nurseries } = useContext(NurseryContext);

  // Show only the first 4 plants (most-recently added are reversed in Products, so take last 4)
  const previewPlants = plants ? [...plants].reverse().slice(0, 4) : [];

  return (
    <>
      <Header />
      <main>
        <Hero />

        <SectionHeader id="products">
          <StyledHeading main>Featured Plants</StyledHeading>
          <ViewAllBtn to="/plants">View All Plants →</ViewAllBtn>
        </SectionHeader>

        <div>
          <Products plants={previewPlants} />
        </div>

        <About />
      </main>
      <Footer />
    </>
  );
};

export default Home;
