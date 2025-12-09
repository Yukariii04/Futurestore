import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories } from '../lib/api';
import { useStore } from '../context/StoreContext';
import { gsap } from 'gsap';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const { state } = useStore();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navRef.current) {
        try {
          gsap.from(navRef.current, {
            y: -50,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          });
        } catch (error) {
          console.warn('Navbar animation error:', error);

          if (navRef.current) {
            navRef.current.style.opacity = '1';
            navRef.current.style.transform = 'translateY(0)';
          }
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  return (
    <nav 
      ref={navRef} 
      className="sticky top-0 z-40 bg-black border-b border-neutral-800 backdrop-blur-sm"
      style={{ opacity: 1, transform: 'translateY(0)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-mono text-sm uppercase tracking-wider text-white hover:text-neutral-300 transition-colors">
            FUTURE.STORE
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="nav-link text-sm text-neutral-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/products" className="nav-link text-sm text-neutral-400 hover:text-white transition-colors">
              Products
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="nav-link text-xs text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded border border-neutral-800 hover:border-neutral-600"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <Link to="/wishlist" className="nav-link text-neutral-400 hover:text-white transition-colors relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-red-500"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => navigate('/cart')}
              className="nav-link text-neutral-400 hover:text-white transition-colors relative"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                  {cartCount}
                </span>
              )}
            </button>
            
            <Link to="/orders" className="nav-link text-sm text-neutral-400 hover:text-white transition-colors">
              Orders
            </Link>
            
            <Link to="/contact" className="nav-link text-sm text-neutral-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

