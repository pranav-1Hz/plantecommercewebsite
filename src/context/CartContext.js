import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatoCMSData from '../DatoCMS/DatoCMS';

import {
  addItemToCart,
  removeItemFromCart,
  filterItemFromCart,
  getCartItemsCount,
  getCartTotal,
} from '../utils/CartUtils';

export const CartContext = createContext({
  plants: [],
  filtredPlants: [],
  cartItems: [],
  addItem: () => {},
  addPlant: () => {},
  removePlant: () => {},
  removeItem: () => {},
  clearItemFromCart: () => {},
  getPlant: () => {},
  handleChange: () => {},
  filterPlants: [],
  cartItemsCount: 0,
  cartTotal: 0,
  price: 0,
  minPrice: 0,
  maxPrice: 0,
  type: '',
  searchName: '',
  hex1: '#B5B5B5',
  hex2: '#485550',
  hex3: '#4B6358',
  changeColor: () => {},
  clearColor: () => {},
  loading: false,
  user: {},
});

const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [plants, setPlants] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filtredPlants, setFiltredPlants] = useState([]);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('');
  const [searchName, setSearchName] = useState('');
  const [hex1, setHex1] = useState('#B5B5B5');
  const [hex2, setHex2] = useState('#485550');
  const [hex3, setHex3] = useState('#4B6358');
  const [loading, setLoading] = useState(true);

  const changeColor = e => {
    const color1 = e.target.getAttribute('data-hex1');
    const color2 = e.target.getAttribute('data-hex2');
    const color3 = e.target.getAttribute('data-hex3');
    setHex1(color1);
    setHex2(color2);
    setHex3(color3);
  };
  const clearColor = () => {
    setHex1('#B5B5B5');
    setHex2('#485550');
    setHex3('#4B6358');
  };

  const addItem = item => setCartItems(addItemToCart(cartItems, item));
  const removeItem = item => setCartItems(removeItemFromCart(cartItems, item));
  const clearItemFromCart = item => setCartItems(filterItemFromCart(cartItems, item));

  const getPlant = slug => {
    const templatePlants = [...plants];
    const plantSlug = templatePlants.find(plant => plant.plantSlug === slug);
    return plantSlug;
  };

  const handleChangeSearch = e => {
    e.preventDefault();
    const value = e.target.value;
    setSearchName(value);
  };

  const handleFilteringPlantsByName = () => {
    let tempPlants = [...plants];
    if (searchName !== '') {
      tempPlants = plants.filter(plant => {
        const regex = new RegExp(searchName, 'gi');
        return plant.plantTitle.match(regex);
      });
      setFiltredPlants(tempPlants);
      return tempPlants;
    }
    setFiltredPlants(tempPlants);
    return tempPlants;
  };
  useEffect(() => {
    handleFilteringPlantsByName();
  }, [searchName]);

  const handleChangeType = e => {
    e.preventDefault();
    const value = e.target.value;
    setType(value);
  };

  const handleFilteringPlantsByType = () => {
    let tempPlants = [...plants];
    if (type !== 'all') {
      tempPlants = tempPlants.filter(plant => plant.plantType === type);
    }
    setFiltredPlants(tempPlants);
    return tempPlants;
  };
  useEffect(() => {
    handleFilteringPlantsByType();
  }, [type]);

  const handleChangePrice = e => {
    e.preventDefault();
    const value = e.target.value;
    setPrice(value);
  };

  const handleFilteringPlantsByPrice = () => {
    let tempPlants = [...plants];
    tempPlants = tempPlants.filter(plant => plant.plantPrice <= price);
    setFiltredPlants(tempPlants);
    return tempPlants;
  };
  useEffect(() => {
    handleFilteringPlantsByPrice();
  }, [price]);

  const dataList = productsDataItems => {
    const template = productsDataItems.map(item => {
      const singlePlant = { ...item };
      return singlePlant;
    });
    return template;
  };

  const [localPlants, setLocalPlants] = useState([]);

  // Load local plants on mount
  useEffect(() => {
    const saved = localStorage.getItem('localPlants');
    if (saved) {
      setLocalPlants(JSON.parse(saved));
    }
  }, []);

  const addPlant = newPlant => {
    const updatedLocalPlants = [...localPlants, newPlant];
    setLocalPlants(updatedLocalPlants);
    localStorage.setItem('localPlants', JSON.stringify(updatedLocalPlants));
    // Immediately update plants state to show new plant
    setPlants(prev => [...prev, newPlant]);
    // Allow filtering to update
    setFiltredPlants(prev => [...prev, newPlant]);
  };

  useEffect(() => {
    const getPlantsData = async () => {
      try {
        const response = await DatoCMSData.items.all().then(dataPlant => {
          // Merge CMS plants with local plants
          const allPlants = [...dataList(dataPlant), ...localPlants];

          setPlants(allPlants);
          setMaxPrice(Math.max(...allPlants.map(plant => plant.plantPrice)));
          setMinPrice(Math.min(...allPlants.map(plant => plant.plantPrice)));
          setFiltredPlants(allPlants);
          // Only set price if it's 0 (initial load) to avoid resetting filter
          if (price === 0) {
            setPrice(Math.max(...allPlants.map(plant => plant.plantPrice)));
          }
          setCartItemsCount(getCartItemsCount(cartItems));
          setCartTotal(getCartTotal(cartItems));
          setLoading(false);
        });
        return response;
      } catch (error) {
        console.error('Error loading plants from DatoCMS:', error);
        // Fallback: Use mock plants
        const mockPlants = [
          {
            id: '1',
            plantTitle: 'Monstera Deliciosa',
            plantType: 'indoor',
            plantPrice: 49.99,
            plantSlug: 'monstera-deliciosa',
            plantDescription: 'A large-leafed tropical plant',
            image: null,
          },
          {
            id: '2',
            plantTitle: 'Snake Plant',
            plantType: 'indoor',
            plantPrice: 29.99,
            plantSlug: 'snake-plant',
            plantDescription: 'Low maintenance succulent',
            image: null,
          },
          {
            id: '3',
            plantTitle: 'Pothos',
            plantType: 'indoor',
            plantPrice: 19.99,
            plantSlug: 'pothos',
            plantDescription: 'Easy to grow climbing plant',
            image: null,
          },
        ];

        const allPlants = [...mockPlants, ...localPlants];
        setPlants(allPlants);
        setMaxPrice(Math.max(...allPlants.map(plant => plant.plantPrice)));
        setMinPrice(Math.min(...allPlants.map(plant => plant.plantPrice)));
        setFiltredPlants(allPlants);
        if (price === 0) {
          setPrice(Math.max(...allPlants.map(plant => plant.plantPrice)));
        }
        setCartItemsCount(getCartItemsCount(cartItems));
        setCartTotal(getCartTotal(cartItems));
        setLoading(false);
      }
    };
    getPlantsData();
  }, [cartItems, localPlants.length]);

  const removePlant = plantId => {
    // Remove from local storage
    const updatedLocalPlants = localPlants.filter(p => p.id !== plantId);
    setLocalPlants(updatedLocalPlants);
    localStorage.setItem('localPlants', JSON.stringify(updatedLocalPlants));

    // Remove from state
    setPlants(prev => prev.filter(p => p.id !== plantId));
    setFiltredPlants(prev => prev.filter(p => p.id !== plantId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        addPlant,
        removePlant,
        removeItem,
        clearItemFromCart,
        handleChangeSearch,
        handleChangeType,
        handleChangePrice,
        changeColor,
        clearColor,
        getPlant,
        cartItemsCount,
        cartTotal,
        plants,
        filtredPlants,
        price,
        maxPrice,
        minPrice,
        type,
        searchName,
        hex1,
        hex2,
        hex3,
        loading,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
CartProvider.propTypes = {
  children: PropTypes.any.isRequired,
  user: PropTypes.object,
};

CartProvider.defaultProps = {
  user: null,
};

export default CartProvider;
