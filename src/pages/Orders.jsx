import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Orders = () => {
  const { state } = useStore();

  if (state.orders.length === 0) {
    return (
      <section className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center py-16 glass rounded-lg border border-neutral-800">
            <p className="text-2xl font-mono mb-4">No orders yet</p>
            <p className="text-neutral-500 mb-8">Your order history will appear here</p>
            <Link
              to="/products"
              className="px-6 py-3 border border-neutral-700 rounded hover:border-white hover:bg-white/5 transition-all font-mono text-sm uppercase tracking-wider inline-block"
            >
              Start Shopping
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
            ORDER HISTORY
          </p>
          <h1 className="text-4xl font-mono mb-8">Orders</h1>
        </div>

        <div className="space-y-4">
          {state.orders.map((order) => (
            <div
              key={order.id}
              className="glass rounded-lg p-6 border border-neutral-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-neutral-400 font-mono">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="text-xl font-mono">${order.total.toFixed(2)}</p>
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-neutral-400">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.customer && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <p className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                    Shipping To
                  </p>
                  <p className="text-sm text-neutral-400">{order.customer.name}</p>
                  <p className="text-sm text-neutral-400">{order.customer.email}</p>
                  <p className="text-sm text-neutral-400">{order.customer.address}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Orders;

