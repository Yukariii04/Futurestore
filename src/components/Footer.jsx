import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-black mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider mb-4">FUTURE.STORE</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              The future of e-commerce. Minimalist design meets cutting-edge technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-neutral-500 font-mono">
              © {new Date().getFullYear()} FUTURE.STORE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

