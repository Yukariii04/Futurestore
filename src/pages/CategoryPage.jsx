import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductsByCategory, fetchCategories } from '../lib/api';
import { useStore } from '../context/StoreContext';

const CategoryPage = () => {
  const { name: categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dispatch } = useStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [categoriesData, categoryProducts] = await Promise.all([
          fetchCategories(),
          fetchProductsByCategory(categorySlug),
        ]);
        setCategoryMeta(categoriesData.find((cat) => cat.slug === categorySlug) || null);
        setProducts(categoryProducts);
      } catch (err) {
        console.error('Error loading category page:', err);
        setError('Unable to load this collection right now.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [categorySlug]);

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
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

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleAddToWishlist = (product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const themeKey = categoryMeta?.slug || 'default';
  const categoryName = categoryMeta?.name || categorySlug;

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={`category-hero ${themeKey}`}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono mb-2 text-white/70">Category Capsule</p>
            <h1 className="text-4xl font-mono mb-4">{categoryName}</h1>
            <p className="text-sm text-white/70 max-w-2xl">
              {categoryMeta?.description || 'Focused drop curated for this channel.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            <span className={`category-pill ${themeKey}`}>Live capsule</span>
            <span className={`category-pill ${themeKey}`}>Multi-source feed</span>
            <Link to="/products" className={`category-pill ${themeKey} outline`}>All products</Link>
          </div>
        </div>

        <div className="glass rounded-lg p-6 mb-8 border border-neutral-800">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search in category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono text-sm"
            />
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

        <div className="mb-4">
          <p className="text-xs text-neutral-500 font-mono">
            Showing {filteredAndSortedProducts.length} products
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 font-mono">Syncing inventory...</p>
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
            <p className="text-neutral-500 mb-4">No products found in this category</p>
            <Link
              to="/products"
              className="px-4 py-2 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm inline-block"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                className={`category-card glass rounded-lg p-4 border border-neutral-800 hover:-translate-y-1 transition-all duration-200 group ${themeKey}`}
              >
                <div>
                  <div className="aspect-square bg-neutral-900 rounded mb-4 overflow-hidden">
                    <img
                      src={product.images?.[0] || product.images || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-mono text-sm line-clamp-2">{product.title}</h3>
                    <span className={`category-pill ${themeKey} text-[10px]`}>{categoryName}</span>
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;

