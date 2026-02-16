import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import { User, UserRole } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', section: null },
    { name: 'Services', path: '/#services', section: 'services' },
    { name: 'About', path: '/#about', section: 'about' },
    { name: 'Contact', path: '/#contact', section: 'contact' },
  ];

  const handleNav = (path: string, section?: string | null) => {
    setIsMobileMenuOpen(false);
    if (section) {
      // Navigate to home first if not there
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-jhl-black font-sans selection:bg-jhl-black selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="cursor-pointer select-none"
              onClick={() => handleNav('/')}
            >
              <img
                src="./logo.svg"
                alt="JHL Logo"
                className="h-44 w-auto object-contain"
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-12">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.path, link.section)}
                  className={`text-sm tracking-widest hover:text-gray-500 transition-colors uppercase relative group ${location.pathname === link.path ? 'font-medium' : ''}`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))}
            </nav>

            {/* User / CTA */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleNav(user.role === UserRole.ADMIN ? '/admin' : '/dashboard')}
                    className="flex items-center space-x-2 text-sm hover:text-gray-600"
                  >
                    <UserIcon size={18} />
                    <span>{user.name}</span>
                  </button>
                  <button onClick={onLogout} className="text-gray-400 hover:text-black">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('/auth')}
                  className="bg-jhl-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full h-screen">
            <div className="px-4 pt-8 pb-3 space-y-6 flex flex-col items-center">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.path, link.section)}
                  className="block text-2xl font-serif text-jhl-black hover:text-gray-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-8 border-t border-gray-100 w-full flex justify-center">
                {user ? (
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className="text-lg"
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav('/auth')}
                    className="text-lg underline underline-offset-4"
                  >
                    Member Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-jhl-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <img
                src="./logo.svg"
                alt="JHL Logo"
                className="h-64 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curating a lifestyle of elegance, health, and human connection through exceptional service.
            </p>
          </div>

          <div>
            <h3 className="uppercase text-xs tracking-[0.2em] mb-6 text-gray-500">Services</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">Individual Plans</a></li>
              <li><a href="#" className="hover:text-white transition">Company Memberships</a></li>
              <li><a href="#" className="hover:text-white transition">Event Catering</a></li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase text-xs tracking-[0.2em] mb-6 text-gray-500">Company</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase text-xs tracking-[0.2em] mb-6 text-gray-500">Newsletter</h3>
            <div className="flex border-b border-gray-700 pb-2">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-600"
              />
              <button className="text-gray-400 hover:text-white"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-900 text-center md:text-left">
          <p className="text-gray-600 text-xs tracking-wider">© 2024 JUST HUMAN LIFE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};
