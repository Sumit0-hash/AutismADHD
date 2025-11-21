import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  onLogout?: () => void;
  isAdmin?: boolean;
}

export const Header = ({ userEmail, onLogout, isAdmin }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Combined list of navigation links
  const navLinks = [
    { to: '/', name: 'Home' },
    {to:'/dashboard', name: 'Dashboard' },
    { to: '/courses', name: 'Courses' },
    // { to: '/productivity', name: 'Productivity' },
    { to: '/resources', name: 'Resources' },
    // { to: '/events', name: 'Events' },
    { to: '/profile', name: 'Profile' },
  ];

  // Add Admin link if the user is an admin
  if (isAdmin) {
    navLinks.push({ to: '/admin', name: 'Admin' });
  }

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Helper to check if link is active for styling
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#30506C] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* --- Logo Section --- */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logofull.png"
              alt="ADHD Support UK Logo"
              className="h-20 w-40 object-contain rounded-md"
            />
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${isActive(link.to)
                    ? 'text-[#469CA4]'
                    : 'text-gray-200 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* --- User Actions (Desktop) --- */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {userEmail && (
              <div className="flex items-center space-x-2 text-sm text-gray-300 bg-[#263A47] py-1 px-3 rounded-full">
                <User size={14} />
                <span className="max-w-[150px] truncate">{userEmail}</span>
              </div>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-[#469CA4] hover:bg-[#3a7f8a] px-3 py-2 rounded-lg transition shadow-sm"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#263A47] rounded transition text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Panel --- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#263A47] border-t border-[#469CA4]">
          <div className="px-4 pt-2 pb-6 space-y-1">

            {/* Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={`block px-3 py-3 rounded-md text-base font-medium ${isActive(link.to)
                    ? 'bg-[#30506C] text-[#469CA4]'
                    : 'text-gray-200 hover:bg-[#30506C] hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-600 my-4"></div>

            {/* Mobile User Info & Logout */}
            <div className="px-3 space-y-4">
              {userEmail && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <User size={18} />
                  <span className="text-sm truncate">{userEmail}</span>
                </div>
              )}

              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-[#469CA4] hover:bg-[#3a7f8a] px-4 py-3 rounded-lg transition text-white font-semibold"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};