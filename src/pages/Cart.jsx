import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Cart = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  if (state.cart.length === 0) {
    return (
      <section className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono mb-2">
              SHOPPING CART
            </p>
            <h1 className="text-4xl font-mono mb-8">Cart</h1>
          </div>
          <div className="text-center py-16 glass rounded-lg border border-neutral-800">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-2xl font-mono mb-4">Your cart is empty</p>
            <p className="text-neutral-500 mb-8">Start adding items to your cart</p>
            <Link
              to="/products"
              className="px-6 py-3 border border-neutral-700 rounded hover:border-neutral-100 hover:bg-white/5 transition-all font-mono text-sm uppercase tracking-wider inline-block"
            >
              Continue Shopping
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
            SHOPPING CART
          </p>
          <h1 className="text-4xl font-mono mb-8">Cart ({state.cart.length} items)</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {state.cart.map((item, index) => (
              <div
                key={item.id}
                className="cart-item glass rounded-lg p-6 border border-neutral-800 hover:border-neutral-700 transition-all flex gap-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-neutral-900 rounded overflow-hidden">
                    <img
                      src={item.images?.[0] || item.images || 'https://via.placeholder.com/100'}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-mono text-sm mb-2 hover:text-neutral-300 transition-colors">{item.title}</h3>
                  </Link>
                  <p className="text-lg font-mono mb-4">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-neutral-700 rounded hover:border-neutral-500 transition-colors">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-white/5 font-mono transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-white/5 font-mono transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-neutral-500 hover:text-white font-mono uppercase tracking-wider transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1">
            <div className="glass-strong rounded-lg p-6 border border-neutral-800 sticky top-24">
              <p className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-4">
                ORDER SUMMARY
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Shipping</span>
                  <span className="font-mono">FREE</span>
                </div>
                <div className="border-t border-neutral-800 pt-3 flex justify-between">
                  <span className="font-mono">Total</span>
                  <span className="text-xl font-mono">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-3 bg-white text-black rounded hover:bg-neutral-200 transition-all font-mono text-sm uppercase tracking-wider mb-3"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="block text-center px-6 py-3 border border-neutral-700 rounded hover:border-neutral-100 hover:bg-white/5 transition-all text-sm font-mono uppercase tracking-wider"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;

