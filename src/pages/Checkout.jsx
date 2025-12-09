import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Checkout = () => {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: state.cart,
      total,
      customer: formData,
    };

    setTimeout(() => {
      dispatch({ type: 'ADD_ORDER', payload: order });
      setIsSubmitting(false);
      navigate('/orders');
    }, 500);
  };

  if (state.cart.length === 0) {
    return (
      <section className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center py-16 glass rounded-lg border border-neutral-800">
            <p className="text-2xl font-mono mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm uppercase tracking-wider"
            >
              Continue Shopping
            </button>
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
            CHECKOUT
          </p>
          <h1 className="text-4xl font-mono mb-8">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="glass rounded-lg p-6 border border-neutral-800 mb-6">
              <p className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-4">
                SHIPPING INFORMATION
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                    Address
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500 font-mono text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="glass-strong rounded-lg p-6 border border-neutral-800 sticky top-24">
              <p className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-4">
                ORDER SUMMARY
              </p>
              <div className="space-y-3 mb-6">
                {state.cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                    <span className="text-neutral-400">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-neutral-800 pt-3 flex justify-between">
                  <span className="font-mono">Total</span>
                  <span className="text-xl font-mono">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

