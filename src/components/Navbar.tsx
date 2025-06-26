'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface NavItem {
  href: string;
  label: string;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/plantas', label: 'Plantas' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/metricas', label: 'Métricas' },
  { href: '/experimentos', label: 'Experimentos' },
  { href: '/galeria', label: 'Galería' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Si no hay sesión, solo mostrar el botón de login
  if (status === 'loading') {
    return (
      <nav className="bg-yellow-600 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
            <div className="text-white">Cargando...</div>
          </div>
        </div>
      </nav>
    );
  }

  if (!session) {
    return (
      <nav className="bg-yellow-600 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
            <Link
              href="/login"
              className="text-white hover:text-yellow-700 hover:bg-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-yellow-600 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Nombre del usuario en lugar del logo */}
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {session.user.username}
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-yellow-700 hover:bg-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <div className="hidden md:flex items-center">
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="text-white hover:text-yellow-700 hover:bg-white inline-flex items-center justify-center p-2 rounded-md transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú principal"}
              >
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <div 
        className={`bg-yellow-700 md:hidden absolute top-16 left-0 right-0 z-50 overflow-hidden shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="text-white hover:text-yellow-700 hover:bg-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Cerrar Sesión */}
            <div className="border-t border-yellow-600 pt-2 mt-2">
              <button
                onClick={() => {
                  handleSignOut();
                  closeMobileMenu();
                }}
                className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 