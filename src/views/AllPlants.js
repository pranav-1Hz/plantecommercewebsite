import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { CartContext } from '../context/CartContext';
import { NurseryContext } from '../context/NurseryContext';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Products from '../components/organisms/Products';
import Loader from '../components/atoms/Loader/Loader';

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

/* ─── Title row (full width above the columns) ────────────── */
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
  margin-left: 0;          /* sits at the very left edge of the body */
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
  &:focus { border-color: ${({ theme }) => theme.fontColorPrimary}; }
  &::placeholder { color: #bbb; }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  background: ${({ theme }) => theme.secondaryColor};
  border: 2px solid transparent;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  color: ${({ theme }) => theme.fontColorHeading};
  transition: border-color 0.2s;
  &:focus { border-color: ${({ theme }) => theme.fontColorPrimary}; }
`;

const RangeWrapper = styled.div`
  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    background: none;
    cursor: pointer;
    margin: 3px 0;
  }
  input[type='range']::-webkit-slider-runnable-track {
    height: 4px;
    background: ${({ theme }) => theme.secondaryColor};
    border-radius: 3px;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: ${({ theme }) => theme.fontColorPrimary};
    margin-top: -6px;
    cursor: pointer;
  }
  input[type='range']::-moz-range-track {
    height: 4px;
    background: ${({ theme }) => theme.secondaryColor};
    border-radius: 3px;
  }
  input[type='range']::-moz-range-thumb {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: ${({ theme }) => theme.fontColorPrimary};
    border: none;
    cursor: pointer;
  }
`;

const PriceDisplay = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.fontColorText};
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
`;

const NurseryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primaryColor};
    border-radius: 4px;
  }
`;

const NurseryBtn = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.45rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ active, theme }) => active ? theme.primaryColor : 'transparent'};
  color: ${({ active, theme }) => active ? '#fff' : theme.fontColorHeading};
  font-weight: ${({ active, theme }) => active ? theme.bold : theme.regular};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ active, theme }) => active ? theme.primaryColor : theme.secondaryColor};
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

/* ─── Component ───────────────────────────────────────────── */
const AllPlants = () => {
  const {
    plants, filtredPlants, loading,
    price, minPrice, maxPrice,
    type, searchName,
    handleChangeSearch, handleChangeType, handleChangePrice,
  } = useContext(CartContext);

  const { nurseries } = useContext(NurseryContext);
  const [selectedNursery, setSelectedNursery] = useState(null);

  const plantTypes = ['all', ...[...new Set(plants.map(p => p.plantType).filter(Boolean))].sort()];
  const sortedNurseries = [...nurseries].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  let displayPlants = filtredPlants && filtredPlants.length > 0 ? filtredPlants : plants;
  if (selectedNursery !== null) {
    displayPlants = displayPlants.filter(p => String(p.nurseryId) === String(selectedNursery));
  }

  const handleReset = () => {
    handleChangeSearch({ preventDefault: () => { }, target: { value: '' } });
    handleChangeType({ preventDefault: () => { }, target: { value: 'all' } });
    handleChangePrice({ preventDefault: () => { }, target: { value: maxPrice } });
    setSelectedNursery(null);
  };

  return (
    <PageWrapper>
      <Header />
      <Main>
        {/* Full-width title above both columns */}
        <TitleRow>
          <PageTitle>All Plants</PageTitle>
          {!loading && (
            <CountBadge>{displayPlants.length} plant{displayPlants.length !== 1 ? 's' : ''}</CountBadge>
          )}
        </TitleRow>

        <Body>
          {/* Left sidebar */}
          <Sidebar>
            <div>
              <SidebarTitle>🌿 Filters</SidebarTitle>
              <FilterGroup>
                <FilterLabel htmlFor="ap-search">Search</FilterLabel>
                <SearchInput
                  id="ap-search"
                  type="text"
                  placeholder="e.g. Monstera…"
                  value={searchName}
                  onChange={handleChangeSearch}
                />
              </FilterGroup>
            </div>

            <FilterGroup>
              <FilterLabel htmlFor="ap-type">Plant type</FilterLabel>
              <StyledSelect id="ap-type" name="type" value={type} onChange={handleChangeType}>
                {plantTypes.map(t => (
                  <option value={t} key={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </StyledSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel htmlFor="ap-price">Max price — ${price}</FilterLabel>
              <RangeWrapper>
                <input
                  id="ap-price"
                  type="range"
                  name="price"
                  min={minPrice}
                  max={maxPrice}
                  value={price}
                  onChange={handleChangePrice}
                />
              </RangeWrapper>
              <PriceDisplay><span>${minPrice}</span><span>${maxPrice}</span></PriceDisplay>
            </FilterGroup>

            {sortedNurseries.length > 0 && (
              <FilterGroup>
                <FilterLabel>Nursery</FilterLabel>
                <NurseryList>
                  <li>
                    <NurseryBtn active={selectedNursery === null} onClick={() => setSelectedNursery(null)}>
                      All Nurseries
                    </NurseryBtn>
                  </li>
                  {sortedNurseries.map(n => (
                    <li key={n.id}>
                      <NurseryBtn
                        active={selectedNursery === n.id}
                        onClick={() => setSelectedNursery(n.id === selectedNursery ? null : n.id)}
                      >
                        {n.name}
                      </NurseryBtn>
                    </li>
                  ))}
                </NurseryList>
              </FilterGroup>
            )}

            <ResetBtn onClick={handleReset}>↺ Reset Filters</ResetBtn>
          </Sidebar>

          {/* Plant grid */}
          <Content>
            {loading ? <Loader /> : <Products plants={displayPlants} />}
          </Content>
        </Body>
      </Main>
      <Footer />
    </PageWrapper>
  );
};

export default AllPlants;
