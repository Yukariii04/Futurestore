import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StoreContext = createContext();

const initialState = {
  cart: [],
  wishlist: [],
  orders: [],
  toast: null,
};

// Reducer: Handle state actions
const storeReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...state,
        cart: action.payload.cart || [],
        wishlist: action.payload.wishlist || [],
        orders: action.payload.orders || [],
      };

    case 'ADD_TO_CART':
      const existingCartItem = state.cart.find(item => item.id === action.payload.id);
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          toast: { message: 'Item quantity updated', type: 'success' },
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
        toast: { message: 'Added to cart', type: 'success' },
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
        toast: { message: 'Removed from cart', type: 'info' },
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return {
          ...state,
          toast: { message: 'Already in wishlist', type: 'info' },
        };
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
        toast: { message: 'Added to wishlist', type: 'success' },
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
        toast: { message: 'Removed from wishlist', type: 'info' },
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
        toast: { message: 'Order placed successfully!', type: 'success' },
      };

    case 'CLEAR_TOAST':
      return {
        ...state,
        toast: null,
      };

    default:
      return state;
  }
};

// Component: Context Provider
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);


  // Effect: Load initial state from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedOrders = localStorage.getItem('orders');

    dispatch({
      type: 'LOAD_STATE',
      payload: {
        cart: savedCart ? JSON.parse(savedCart) : [],
        wishlist: savedWishlist ? JSON.parse(savedWishlist) : [],
        orders: savedOrders ? JSON.parse(savedOrders) : [],
      },
    });
  }, []);


  // Effect: Persist cart to local storage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Effect: Persist wishlist to local storage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Effect: Persist orders to local storage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);


  // Effect: Clear toast notification after timeout
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_TOAST' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
      {state.toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
          <div className={`glass-strong px-6 py-3 rounded-lg border ${state.toast.type === 'success' ? 'border-green-500/50' : 'border-blue-500/50'
            }`}>
            <p className="text-sm font-mono">{state.toast.message}</p>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
};

// Hook: Custom hook to use store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

