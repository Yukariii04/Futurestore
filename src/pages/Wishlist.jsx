import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Wishlist = () => {
  const { state, dispatch } = useStore();

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
  };

  if (state.wishlist.length === 0) {
    return (
      <section className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono mb-2">
              WISHLIST
            </p>
            <h1 className="text-4xl font-mono mb-8">Saved Items</h1>
          </div>
          <div className="text-center py-16 glass rounded-lg border border-neutral-800">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-2xl font-mono mb-4">Your wishlist is empty</p>
            <p className="text-neutral-500 mb-8">Start saving items for later</p>
            <Link
              to="/products"
              className="px-6 py-3 border border-neutral-700 rounded hover:border-neutral-100 hover:bg-white/5 transition-all font-mono text-sm uppercase tracking-wider inline-block"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono mb-2">
            WISHLIST
          </p>
          <h1 className="text-4xl font-mono mb-8">Saved Items ({state.wishlist.length})</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {state.wishlist.map((product, index) => (
            <div
              key={product.id}
              className="wishlist-item glass rounded-lg overflow-hidden border border-neutral-800 hover:border-neutral-100 hover:bg-white/5 hover:-translate-y-1 transition-all duration-200 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square bg-neutral-900 overflow-hidden">
                  <img
                    src={product.images?.[0] || product.images || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-mono text-sm mb-2 line-clamp-2 hover:text-neutral-300 transition-colors">{product.title}</h3>
                </Link>
                <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3 font-mono">
                  {product.category?.name}
                </p>
                <p className="text-xl font-mono mb-4">${product.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-all font-mono text-xs uppercase tracking-wider"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-4 py-2 border border-neutral-700 rounded hover:border-red-500 hover:text-red-500 transition-all"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;

