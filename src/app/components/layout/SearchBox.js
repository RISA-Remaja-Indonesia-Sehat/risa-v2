'use client';
import { useState, useRef, useEffect } from 'react';

export default function SearchBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add search logic here
      console.log('Searching for:', searchQuery);
      const resultUrl = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
      window.location.href = resultUrl;

      // Close search box after search
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cari" 
        className="text-gray-600 hover:text-pink-500 p-2 rounded-full hover:bg-pink-50 transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Input */}
      {isOpen && (
        <div className="absolute right-0 sm:right-0 top-12 w-screen sm:w-96 max-w-sm sm:max-w-none -mr-6 sm:mr-0 bg-white border border-pink-200 rounded-2xl shadow-lg p-4 z-50">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari artikel, tips, atau info..."
                className="w-full px-4 py-3 pr-10 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <svg 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="px-4 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Cari
            </button>
          </form>
          
          {/* Quick suggestions */}
          <div className="mt-3 pt-3 border-t border-pink-100">
            <p className="text-xs text-gray-500 mb-2">Pencarian populer:</p>
            <div className="flex flex-wrap gap-2">
              {['Menstruasi', 'HPV', 'Mood tracker', 'Tips kesehatan'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs hover:bg-pink-100 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}