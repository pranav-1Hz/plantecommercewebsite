import React, { useState, useEffect, lazy, Suspense, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../atoms/Button/Button';
import CartButton from '../atoms/Button/CartButton';
import { fire } from '../../firebase/Firebase';
import Loader from '../atoms/Loader/Loader';
import { CartContext } from '../../context/CartContext';

const Cart = lazy(() => import('./Cart'));

const StyledWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const HeaderIcons = ({ isSinglePlant }) => {
  const { user } = useContext(CartContext);
  const [CartOpen, setCartOpen] = useState(false);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  useEffect(() => {
    setPageWidth(window.innerWidth);
  }, []);

  const handleCartOpen = () => setCartOpen(prevState => !prevState);
  const handlelogout = () => fire.auth().signOut();

  return (
    <StyledWrapper>
      {pageWidth <= 700 ? (
        <StyledLink to="/checkout">
          <CartButton aria-label="cart" />
        </StyledLink>
      ) : (
        <>
          <CartButton aria-label="cart" onClick={handleCartOpen} />
          <Suspense fallback={<Loader />}>
            <Cart isVisible={CartOpen} />
          </Suspense>
        </>
      )}
      {user ? (
        <>
          <StyledLink to={user.role === 'admin' ? '/admin' : user.role === 'nursery' ? '/nursery' : '/account'}>
            <Button logoutSinglePlant aria-label={user.role === 'user' ? 'Account' : 'Dashboard'}>
              {user.role === 'user' ? 'Account' : 'Dashboard'}
            </Button>
          </StyledLink>
          <Button logoutMain aria-label="Logout" onClick={handlelogout}>
            Logout
          </Button>
        </>
      ) : (
        <StyledLink to="/login">
          <Button logoutMain aria-label="Login">
            Login
          </Button>
        </StyledLink>
      )}
    </StyledWrapper>
  );
};
HeaderIcons.propTypes = {
  isSinglePlant: PropTypes.bool,
};
HeaderIcons.defaultProps = {
  isSinglePlant: null,
};
export default HeaderIcons;
