import { useState, useEffect, useRef } from 'react';
import { fetchProducts, fetchCategories } from '../lib/api';
import { useStore } from '../context/StoreContext';
import { gsap } from 'gsap';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dispatch } = useStore();
  const sectionRef = useRef(null);
  const productsGridRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading products page:', err);
        setError('Unable to load catalog');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sectionRef.current) {
        return;
      }

      const section = sectionRef.current;
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        return;
      }

      try {
        gsap.from(section, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
        });
      } catch (error) {
        console.warn('Products page animation error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category?.slug === selectedCategory;
      const matchesMinPrice = !minPrice || product.price >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || product.price <= parseFloat(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return (b.sourceId ?? 0) - (a.sourceId ?? 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  useEffect(() => {
    if (productsGridRef.current && filteredAndSortedProducts.length > 0) {
      const timer = setTimeout(() => {
        try {
          const cards = Array.from(productsGridRef.current.children).filter(
            child => child.nodeType === 1
          );

          if (cards.length === 0) {
            return;
          }


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
              y: 20,
              scale: 0.95,
              duration: 0.5,
              stagger: 0.05,
              ease: 'power2.out',
            });
          }
        } catch (error) {
          console.warn('Products grid animation error:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [filteredAndSortedProducts]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const matches = products
        .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleAddToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  return (
    <section ref={sectionRef} className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono mb-2">
            PRODUCT CATALOG
          </p>
          <h1 className="text-4xl font-mono mb-8">All Products</h1>
        </div>

        <div className="glass rounded-lg p-6 mb-8 border border-neutral-800">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono text-sm"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 glass-strong rounded border border-neutral-700 overflow-hidden">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      className="block px-4 py-2 hover:bg-white/5 text-sm border-b border-neutral-800 last:border-b-0 cursor-default"
                    >
                      {product.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono text-sm"
            />

            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-neutral-500 font-mono">
            Showing {filteredAndSortedProducts.length} products
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`category-pill ${selectedCategory === 'all' ? 'outline' : 'default'} text-[11px] uppercase tracking-[0.3em]`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`category-pill ${cat.slug} ${selectedCategory === cat.slug ? 'outline' : ''} text-[11px] uppercase tracking-[0.3em]`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 font-mono">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 glass rounded-lg border border-neutral-800">
            <p className="text-neutral-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm"
            >
              Retry
            </button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 glass rounded-lg border border-neutral-800">
            <p className="text-neutral-500 mb-4">No products found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMinPrice('');
                setMaxPrice('');
              }}
              className="px-4 py-2 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div ref={productsGridRef} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredAndSortedProducts.map((product) => {
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
                  className="product-card glass rounded-lg p-4 border border-neutral-800 hover:border-neutral-100 hover:bg-white/5 hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div>
                    <div className="aspect-square bg-neutral-900 rounded mb-4 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.title || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-mono text-sm line-clamp-2">{product.title || 'Untitled Product'}</h3>
                      {product.category && (
                        <span className={`category-pill ${product.category.slug} text-[10px]`}>{product.category.name}</span>
                      )}
                    </div>
                    <p className="text-lg font-mono mb-4">${Number(product.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-3 py-2 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-xs uppercase"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="px-3 py-2 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-xs"
                    >
                      ♡
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;

