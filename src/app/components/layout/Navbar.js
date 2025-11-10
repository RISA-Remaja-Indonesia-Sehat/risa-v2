'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBox from './SearchBox';
import useAuthStore from '../../store/useAuthStore';

export default function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isLoggedIn, logout, initAuth } = useAuthStore();

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
        const menu = document.getElementById("mobile-menu");
        if (menu) {
            menu.classList.add("translate-x-full");
        }
    };

    useEffect(() => {
        initAuth();

        const menu = document.getElementById("mobile-menu");
        
        const handleClick = (e) => {
            if (e.target.closest("#menu-toggle")) {
                setIsMenuOpen(true);
                menu.classList.remove("translate-x-full");
            }
            if (e.target.closest("#menu-close")) {
                setIsMenuOpen(false); 
                menu.classList.add("translate-x-full");
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [initAuth]);  
    
    return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm relative">
      {/** Logo */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image src="/image/LogoRisa.png" width={100} height={32} alt="RISA Logo" priority={true} />
        </Link>
      </div>

      {/** Menu Desktop */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium text-center text-sm lg:text-base items-center">
        <li><Link href="/mini-game" className="hover:text-pink-500">Mini Games</Link></li>
        <li><Link href="/article" className="hover:text-pink-500">Artikel</Link></li>
        <li><Link href="/missions" className="hover:text-pink-500">Misi Harian</Link></li>
        <li><Link href="/siklusku" className="hover:text-pink-500">Siklusku</Link></li>
        <li><Link href="/vaksin-hpv" className="hover:text-pink-500">Vaksin HPV</Link></li>
      </ul>

      {/** Right Section */}
      <div className="flex items-center gap-4">
        {/** Search */}
        <SearchBox />


        {/** Auth Section (Desktop) */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-pink-50 px-3 py-2 rounded-full">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button 
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full transition-all duration-200"
            >
              Keluar
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full transition-all duration-200">
              Masuk
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-full transition-all duration-200">
              Daftar
            </Link>
          </div>
        )}

        {/** Mobile Toggle */}
        <button id="menu-toggle" className="md:hidden text-gray-600 hover:text-pink-500 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/** Mobile Menu Sidebar */}
      <div id="mobile-menu" className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col p-6 gap-4">
        <button id="menu-close" className="self-end text-gray-600 hover:text-pink-500">
          ✕
        </button>
        
        {/** Mobile Auth Section */}
        {isLoggedIn ? (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="font-medium text-gray-700">{user?.name}</span>
            </div>
            <button 
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full transition-all duration-200"
            >
              Keluar
            </button>
          </div>
        ) : (
          <div className="border-b border-gray-200 pb-4 mb-4 space-y-2">
            <Link href="/login" className="block w-full px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full transition-all duration-200 text-center">
              Masuk
            </Link>
            <Link href="/register" className="block w-full px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-full transition-all duration-200 text-center">
              Daftar
            </Link>
          </div>
        )}
        
        <Link href="/mini-game" className="hover:text-pink-500" onClick={closeMobileMenu}>Mini Games</Link>
        <Link href="/article" className="hover:text-pink-500" onClick={closeMobileMenu}>Artikel</Link>
        <Link href="/missions" className="hover:text-pink-500" onClick={closeMobileMenu}>Misi Harian</Link>
        <Link href="/siklusku" className="hover:text-pink-500" onClick={closeMobileMenu}>Siklusku</Link>
        <Link href="/vaksin-hpv" className="hover:text-pink-500" onClick={closeMobileMenu}>Vaksin HPV</Link>
      </div>
    </nav>
  )
}
