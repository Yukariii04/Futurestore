import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../lib/api';
import { gsap } from 'gsap';
import { useStore } from '../context/StoreContext';
import tetoGif from '../../teto/teto.gif';

const statTiles = [
  { value: '48', label: 'micro studios', sub: 'shipping direct' },
  { value: '4.9', label: 'customer score', sub: 'past 6 months' },
  { value: '72h', label: 'restock cycle', sub: 'average' },
];

const Home = () => {
  const { dispatch } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await fetchProducts();

        if (products && products.length > 0) {
          setFeaturedProducts(products.slice(0, 6));
        } else {
          console.warn('No products returned from API');
          setError('No products available');
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (heroRef.current && titleRef.current) {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          heroRef.current.querySelectorAll('[data-animate]').forEach(node => {
            node.style.opacity = '1';
            node.style.transform = 'none';
          });
          if (titleRef.current) {
            titleRef.current.style.opacity = '1';
            titleRef.current.style.transform = 'none';
          }
          return;
        }

        try {
          const children = Array.from(heroRef.current.children).filter(
            child => child !== titleRef.current && child.nodeType === 1
          );

          if (children.length > 0) {
            gsap.from(children, {
              opacity: 0,
              y: 40,
              duration: 0.9,
              stagger: 0.15,
              ease: 'power3.out',
            });
          }

          if (titleRef.current) {
            gsap.from(titleRef.current, {
              opacity: 0,
              y: 20,
              duration: 0.9,
              ease: 'power3.out',
            });
          }
        } catch (error) {
          console.warn('Hero animation error:', error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (productsRef.current && featuredProducts.length > 0) {
      const timer = setTimeout(() => {
        try {
          const cards = Array.from(productsRef.current.children).filter(
            child => child.nodeType === 1
          );
          if (cards.length > 0) {
            cards.forEach(card => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });

            const prefersReducedMotion =
              typeof window !== 'undefined' &&
              window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (!prefersReducedMotion) {
              gsap.from(cards, {
                opacity: 0,
                y: 30,
                scale: 0.9,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
              });
            }
          }
        } catch (error) {
          console.warn('Product cards animation error:', error);

          if (productsRef.current) {
            const cards = Array.from(productsRef.current.children);
            cards.forEach(card => {
              if (card.nodeType === 1) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }
            });
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [featuredProducts]);

  const featuredSelection = featuredProducts.slice(0, 3);

  const handleProductSelect = (product) => {
    setActiveProduct(product);
  };

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <div ref={heroRef} className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-mono mb-4"
              data-animate
            >
              FUTURE.STORE SIGNAL
            </p>
            <h1 ref={titleRef} className="text-5xl md:text-7xl font-mono font-bold leading-tight mb-6">
              Minimal luxury for kinetic lives
            </h1>
            <p className="text-neutral-400 max-w-xl mb-8" data-animate>
              Curated objects, modular apparel, and conscious tech sourced from visionary makers. Calm
              surfaces, sharp silhouettes.
            </p>
            <div className="flex flex-wrap gap-4" data-animate>
              <Link
                to="/products"
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all font-mono text-sm uppercase tracking-[0.35em]"
              >
                Shop collection
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition-all font-mono text-sm uppercase tracking-[0.35em]"
              >
                Contact store
              </Link>
            </div>
          </div>
          <div className="orbit-card" aria-hidden="true">
            <img src={tetoGif} alt="Teto dancing" className="orbit-media" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {statTiles.map((stat) => (
            <div key={stat.label} className="stat-tile rounded-2xl border border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-3">{stat.label}</p>
              <p className="text-4xl font-mono">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-600 mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-mono mb-2">
                FEATURED CAPSULE
              </p>
              <h2 className="text-3xl font-mono">Objects moving fast</h2>
            </div>
            <Link
              to="/products"
              className="text-xs uppercase tracking-[0.35em] border-b border-white/30 pb-1"
            >
              Browse all
            </Link>
          </div>

          {loading && (
            <div className="text-center py-16">
              <p className="text-neutral-500 font-mono">Loading capsules...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-16">
              <p className="text-neutral-500 font-mono mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && featuredSelection.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 font-mono">Stock refresh incoming. Check back soon.</p>
            </div>
          )}
          {!loading && !error && featuredSelection.length > 0 && (
            <div ref={productsRef} className="grid gap-6 md:grid-cols-3" style={{ opacity: 1 }}>
              {featuredSelection.map((product) => {
                let imageUrl = 'https://via.placeholder.com/300';
                if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                  imageUrl = product.images[0];
                } else if (typeof product.images === 'string') {
                  imageUrl = product.images;
                } else if (product.image) {
                  imageUrl = product.image;
                }

                return (
                  <div
                    key={product.id}
                    className="featured-card glass rounded-2xl p-5 border border-neutral-800 hover:border-white/50 transition-colors duration-200"
                    style={{ opacity: 1 }}
                  >
                    <div className="aspect-square bg-neutral-900 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.title || 'Product'}
                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300';
                        }}
                      />
                    </div>
                    <h3 className="font-mono text-sm mb-2 line-clamp-2">{product.title || 'Untitled Product'}</h3>
                    <p className="text-lg font-mono mb-4">${Number(product.price || 0).toFixed(2)}</p>
                    <button
                      type="button"
                      onClick={() => handleProductSelect(product)}
                      className="show-details-btn"
                    >
                      Show details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {activeProduct && (
            <div className="mt-10 glass rounded-2xl border border-white/20 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square bg-neutral-900 rounded-xl overflow-hidden">
                    <img
                      src={Array.isArray(activeProduct.images) && activeProduct.images.length > 0
                        ? activeProduct.images[0]
                        : activeProduct.image || activeProduct.images || 'https://via.placeholder.com/400'}
                      alt={activeProduct.title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 mb-2">SELECTED ITEM</p>
                    <h3 className="text-3xl font-mono">{activeProduct.title || 'Untitled Product'}</h3>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {activeProduct.description || 'No additional details available for this item yet.'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm font-mono">
                    <span className="px-3 py-1 border border-white/30 rounded-full">
                      ${Number(activeProduct.price || 0).toFixed(2)}
                    </span>
                    {activeProduct.category?.name && (
                      <span className="px-3 py-1 border border-white/10 rounded-full text-neutral-400">
                        {activeProduct.category.name}
                      </span>
                    )}
                    {activeProduct.rating && (
                      <span className="px-3 py-1 border border-white/10 rounded-full text-neutral-400">
                        {`${activeProduct.rating} ★`}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'ADD_TO_CART', payload: activeProduct })}
                      className="px-6 py-2 rounded-full border border-white/70 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.35em]"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'ADD_TO_WISHLIST', payload: activeProduct })}
                      className="px-6 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all text-xs uppercase tracking-[0.35em]"
                    >
                      Add to wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;

