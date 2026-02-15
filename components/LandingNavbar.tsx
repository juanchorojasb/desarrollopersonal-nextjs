'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DesarrolloPersonal.uno
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#cursos" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Cursos
            </Link>
            <Link href="#talleres" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Talleres
            </Link>
            <Link href="#podcast" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Podcast
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Precios
            </Link>
            <Link 
              href="/auth/signin" 
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Comenzar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="#cursos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium transition-colors"
            >
              Cursos
            </Link>
            <Link
              href="#talleres"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium transition-colors"
            >
              Talleres
            </Link>
            <Link
              href="#podcast"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium transition-colors"
            >
              Podcast
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg font-medium transition-colors"
            >
              Precios
            </Link>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2 text-center text-indigo-600 border border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2 text-center bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
