import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react'; 
import { useState } from 'react';

// Note: This component assumes the user context will determine if a user is SignedIn 
// and whether the Clerk components (UserButton, SignedIn/Out) are available.
// For the prototype, we keep the Clerk imports commented out.

export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    // List of links that appear in the main navigation area
    const primaryNavLinks = [
        { to: '/courses', name: 'Courses' },
        { to: '/events', name: 'Events' },
        { to: '/resources', name: 'Resources' },
    ];

    // List of links that typically require authentication
    const authLinks = [
        { to: '/dashboard', name: 'Dashboard' },
        { to: '/productivity', name: 'Productivity Tools' },
        { to: '/profile', name: 'Profile' }, // IMPLEMENTED PROFILE LINK
        { to: '/admin', name: 'Admin' }, // Placeholder for Admin access
    ];

    // Placeholder image path for the logo

    return (
        <header className="bg-[#30506C] text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Site Title */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img 
                            src="/logo.jpg" 
                            alt="ADHD Support UK Logo" 
                            className="h-10 w-10 object-contain rounded-md" 
                        />
                        <span className="text-xl text-black font-semibold tracking-wide">ADHD Support UK</span>
                    </Link>

                    {/* Desktop Navigation Links (Primary and Authenticated) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {primaryNavLinks.map(link => (
                            <Link key={link.to} to={link.to} className="hover:text-[#469CA4] text-white transition font-medium">
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* <SignedIn> */}
                            {authLinks.map(link => (
                                <Link key={link.to} to={link.to} className="hover:text-[#469CA4] text-white transition font-medium">
                                    {link.name}
                                </Link>
                            ))}
                        {/* </SignedIn> */}
                    </nav>

                    {/* Desktop Utility (Sign In/User Button) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* <SignedOut> */}
                            <Link
                                to="/sign-in"
                                className="px-4 py-2 rounded-lg hover:bg-[#469CA4] transition text-sm font-semibold"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/sign-up"
                                className="px-4 py-2 rounded-lg bg-[#469CA4] hover:bg-[#3a7d84] transition text-sm font-semibold"
                            >
                                Sign Up
                            </Link>
                        {/* </SignedOut> */}
                        {/* <SignedIn> */}
                            {/* <UserButton afterSignOutUrl="/" /> */}
                        {/* </SignedIn> */}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation"
                    >
                        {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#263A47] border-t border-[#469CA4] absolute w-full shadow-xl">
                    <nav className="px-4 py-4 space-y-3">
                        {[...primaryNavLinks, ...authLinks].map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block text-white hover:text-[#469CA4] transition text-base font-medium"
                                onClick={closeMobileMenu}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Auth Buttons */}
                        <div className="pt-4 space-y-2 border-t border-gray-700">
                            {/* <SignedOut> */}
                                <Link
                                    to="/sign-in"
                                    className="block text-center w-full px-4 py-2 rounded-lg hover:bg-[#469CA4] transition text-sm font-semibold border border-[#469CA4]"
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    className="block text-center w-full px-4 py-2 rounded-lg bg-[#469CA4] hover:bg-[#3a7d84] transition text-sm font-semibold"
                                    onClick={closeMobileMenu}
                                >

                                    
                                    Sign Up
                                </Link>
                            {/* </SignedOut> */}
                        </div>
                    </nav>
                </div>
            )}
        </header>

        
    );
}