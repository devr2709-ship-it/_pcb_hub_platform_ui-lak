import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useConfig } from '../context/ConfigContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, setIsCartOpen, currency, toggleCurrency, formatPrice } = useConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore PCBs', path: '/product-selection' },
    { name: 'Custom PCB', path: '/custom-pcb' },
    { name: 'Instant Pricing', path: '/pricing' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Design Help', path: '/design-help' },
  ];

  const searchableItems = [
    { label: 'Single-Sided PCB (1-Layer FR-4)', path: '/product-selection' },
    { label: 'Double-Sided PCB (2-Layer FR-4)', path: '/custom-pcb' },
    { label: 'Multilayer PCB (4–32 Layers HDI)', path: '/custom-pcb' },
    { label: 'Flexible Polyimide PCB', path: '/product-selection' },
    { label: 'Rigid-Flex Hybrid Stack', path: '/product-selection' },
    { label: 'Metal Core Aluminum PCB', path: '/product-selection' },
    { label: 'Dev Board Shields (ESP32 / RP2040)', path: '/product-selection' },
    { label: 'Power Supply 2oz/3oz Heavy Copper', path: '/product-selection' },
    { label: 'ENIG Gold Immersion Plating', path: '/custom-pcb' },
    { label: 'Cobalt Blue Solder Mask', path: '/custom-pcb' },
    { label: 'Instant Price Calculator & DFM Check', path: '/pricing' },
  ];

  const filteredSearch = searchableItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Announcement Ribbon */}
      <div className="bg-inverse-surface text-inverse-on-surface px-margin py-1.5 flex items-center justify-between text-center text-xs">
        <div className="w-full flex items-center justify-center gap-space-sm flex-wrap">
          <span className="font-label-sm text-label-sm tracking-wider uppercase bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-bold text-[10px]">
            SPEED RUN
          </span>
          <span className="font-body-sm text-body-sm text-inverse-on-surface font-medium text-xs sm:text-sm">
            ⚡ Superfast 24h PCB Prototyping &amp; Gerber Instant DFM Analysis | Free Shipping across India on orders over {formatPrice(999)}
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-surface-variant shrink-0">
          <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
          <span>IPC Class 2/3</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-16 w-full max-w-[1440px] mx-auto px-margin flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <div className="flex items-center gap-space-lg shrink-0">
          <Logo />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-space-md">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`py-2 text-sm transition-all relative ${
                  active
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Quick Search */}
          <div className="hidden md:flex items-center relative">
            <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specs, FR-4, parts..."
              className="w-48 lg:w-60 pl-8 pr-3 py-1.5 bg-surface-container-low text-on-surface rounded-lg font-label-md text-label-md border border-outline-variant focus:outline-none focus:border-primary placeholder:text-on-surface-variant transition-all text-xs"
            />

            {/* Search Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <div className="absolute top-10 left-0 w-72 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 py-2 z-50">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase px-3 py-1 block font-bold">
                  Matches ({filteredSearch.length})
                </span>
                {filteredSearch.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-on-surface-variant">No matching specifications found.</p>
                ) : (
                  filteredSearch.slice(0, 5).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => {
                        navigate(item.path);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low flex items-center justify-between"
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="material-symbols-outlined text-[14px] text-primary">chevron_right</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Interactive Currency Pill */}
          <button
            onClick={toggleCurrency}
            title="Click to toggle currency between INR and USD"
            className="hidden sm:flex items-center bg-surface-container hover:bg-surface-container-high px-2 py-1 rounded-lg gap-space-xs text-xs font-semibold cursor-pointer transition-colors"
          >
            <span className="font-mono text-xs text-on-surface font-bold">
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">unfold_more</span>
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Cart"
            className="relative p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-on-secondary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-space-xs pl-space-xs pr-space-sm py-1 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
            >
              <img
                src="/avatar.png"
                onError={(e) => {
                  e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8NqsHu5yDPQOPBp_a8esTgY-mq3_z-U64wcR4WnxHcg1qVx-HHb3-wm0Wzmel1AaMSWEyIE6SJ5Y1Jq64RJ8xHDBwpw68a08rLIrM4JZ0q5k7Qfol5l48cnzMU_0glbJNCzEjRBRwkQVx87beNYqZMrcR5iEDwdPNfOAXPcy4pkM6MLXk5mLRBml4FiUDPQJL-1SPDK9z1dClSLmLRiplTT-9sUlcljyxk2mmhXXr7k8YzDRMNglZ';
                }}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight text-xs">
                  Arjun Sharma
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px] leading-tight">
                  Hardware Lead
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                expand_more
              </span>
            </div>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/30 py-2 z-50">
                <div className="px-4 py-2 border-b border-outline-variant/20">
                  <p className="font-body-sm text-xs font-bold text-on-surface">Arjun Sharma</p>
                  <p className="font-label-sm text-[10px] text-on-surface-variant">arjun@hardwarelab.in</p>
                </div>
                <Link
                  to="/track-order"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                  <span>My Active Orders (1)</span>
                </Link>
                <Link
                  to="/custom-pcb"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">layers</span>
                  <span>Saved Gerbers &amp; Projects</span>
                </Link>
                <div className="border-t border-outline-variant/20 my-1"></div>
                <div className="px-4 py-1 text-[11px] text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>GST Credit Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* Primary Order PCB CTA */}
          <Link
            to="/custom-pcb"
            className="hidden lg:inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold shadow-[0_2px_12px_rgba(0,74,198,0.25)] hover:bg-primary-container transition-all active:scale-[0.98] text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
            <span>Order PCB</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-margin py-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm ${
                isActive(link.path)
                  ? 'bg-primary-container/10 text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2">
            <button
              onClick={toggleCurrency}
              className="w-full py-2 bg-surface-container rounded-lg font-mono text-xs font-bold text-on-surface text-center"
            >
              Active Currency: {currency === 'INR' ? '₹ INR (India)' : '$ USD (International)'}
            </button>
            <Link
              to="/custom-pcb"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow"
            >
              <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
              <span>Order Custom PCB</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
