import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { NurseryContext } from '../context/NurseryContext';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Loader from '../components/atoms/Loader/Loader';
import Heading from '../components/atoms/Heading/Heading';

/* ─── Page shell ──────────────────────────────────────────── */
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 3rem 1rem 6rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: ${({ theme }) => theme.bold};
  color: ${({ theme }) => theme.fontColorHeading};
  margin: 0;
`;

const CountBadge = styled.span`
  font-size: 0.9rem;
  background: ${({ theme }) => theme.secondaryColor};
  color: ${({ theme }) => theme.fontColorText};
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
`;

/* ─── Two-column body ─────────────────────────────────────── */
const Body = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

/* ─── Sidebar ─────────────────────────────────────────────── */
const Sidebar = styled.aside`
  width: 230px;
  flex-shrink: 0;
  position: sticky;
  top: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  padding: 1.8rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  @media only screen and (max-width: 768px) {
    width: 100%;
    position: relative;
    top: 0;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.bold};
  color: ${({ theme }) => theme.fontColorHeading};
  margin: 0 0 0.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid ${({ theme }) => theme.secondaryColor};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const FilterLabel = styled.label`
  font-size: 0.72rem;
  font-weight: ${({ theme }) => theme.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.fontColorText};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.fontColorPrimary};
  }
`;

const ResetBtn = styled.button`
  width: 100%;
  padding: 0.6rem;
  font-size: 0.9rem;
  font-family: inherit;
  border: 2px solid ${({ theme }) => theme.fontColorPrimary};
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.fontColorPrimary};
  cursor: pointer;
  transition: all 0.18s;
  &:hover {
    background: ${({ theme }) => theme.fontColorPrimary};
    color: #fff;
  }
`;

/* ─── Content area ────────────────────────────────────────── */
const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const FertilizerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
  padding: 0 1rem;
`;

const StyledTitleWrapper = styled.section`
  position: relative;
  display: block;
  margin-bottom: 2rem;
`;

const StyledTitle = styled.h3`
  position: absolute;
  z-index: 2;
  top: 70%;
  left: 0;
  color: #000;
  font-weight: ${({ theme }) => theme.bold};
  font-size: 1.15rem;
  background: #fff;
  padding: 1rem 1.6rem 1rem 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledPrice = styled.span`
  font-weight: ${({ theme }) => theme.regular};
  font-size: 0.9rem;
  color: #666;
`;

const StyledImageWrapper = styled.figure`
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  border-radius: 8px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const AllFertilizers = () => {
  const { fertilizers, loading } = useContext(CartContext);
  const { nurseries } = useContext(NurseryContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFertilizers = fertilizers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Header />
      <Main>
        <TitleRow>
          <PageTitle>Fertilizers</PageTitle>
          {!loading && (
            <CountBadge>
              {filteredFertilizers.length} item{filteredFertilizers.length !== 1 ? 's' : ''}
            </CountBadge>
          )}
        </TitleRow>

        <Body>
          <Sidebar>
            <FilterGroup>
              <SidebarTitle>🛒 Shop</SidebarTitle>
              <FilterLabel htmlFor="f-search">Search</FilterLabel>
              <SearchInput
                id="f-search"
                type="text"
                placeholder="Search fertilizers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </FilterGroup>
            <ResetBtn onClick={() => setSearchTerm('')}>↺ Clear Search</ResetBtn>
          </Sidebar>

          <Content>
            {loading ? (
              <Loader />
            ) : filteredFertilizers.length > 0 ? (
              <FertilizerGrid>
                {filteredFertilizers.map(f => {
                  const nursery = nurseries.find(n => n.id === f.nurseryId);
                  return (
                    <StyledTitleWrapper key={f.id}>
                      <StyledLink to={`/fertilizers/${f.slug}`}>
                        <StyledTitle>
                          {f.name}
                          <StyledPrice> /${f.price}</StyledPrice>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: '#666',
                              marginTop: '0.4rem',
                              fontWeight: 'normal',
                            }}
                          >
                            {f.weight} • By {nursery ? nursery.name : 'Green Thumb Gardens'}
                          </div>
                        </StyledTitle>
                        <StyledImageWrapper>
                          <StyledImage
                            src={
                              f.image ||
                              'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                            }
                            alt={f.name}
                          />
                        </StyledImageWrapper>
                      </StyledLink>
                    </StyledTitleWrapper>
                  );
                })}
              </FertilizerGrid>
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem' }}>
                <Heading>No fertilizers found</Heading>
              </div>
            )}
          </Content>
        </Body>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default AllFertilizers;
