'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl">
            DW
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-white hover:text-cyan-400 transition-colors ${
                pathname === '/' ? 'font-bold border-b-2 border-cyan-400' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/3d"
              className={`text-white hover:text-cyan-400 transition-colors ${
                pathname === '/3d' ? 'font-bold border-b-2 border-cyan-400' : ''
              }`}
            >
              3D
            </Link>
            <Link
              href="/ai"
              className={`text-white hover:text-cyan-400 transition-colors ${
                pathname === '/ai' ? 'font-bold border-b-2 border-cyan-400' : ''
              }`}
            >
              AI
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-sm">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className={`text-white hover:text-cyan-400 transition-colors ${
                  pathname === '/' ? 'font-bold text-cyan-400' : ''
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/3d"
                className={`text-white hover:text-cyan-400 transition-colors ${
                  pathname === '/3d' ? 'font-bold text-cyan-400' : ''
                }`}
                onClick={closeMenu}
              >
                3D
              </Link>
              <Link
                href="/ai"
                className={`text-white hover:text-cyan-400 transition-colors ${
                  pathname === '/ai' ? 'font-bold text-cyan-400' : ''
                }`}
                onClick={closeMenu}
              >
                AI
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
