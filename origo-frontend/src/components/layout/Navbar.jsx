import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-primary/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Origo</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Pricing'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-text-secondary hover:text-white transition-colors text-sm font-medium">
              {item}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="group">
              Sign Up <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-bg-secondary/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-4 shadow-2xl"
          >
             {['Features', 'How It Works', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-text-secondary hover:text-white py-2 block">
                {item}
              </a>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/login')}>Log In</Button>
            <Button variant="primary" className="w-full" onClick={() => navigate('/signup')}>Sign Up Now</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
