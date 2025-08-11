import React, { useState, useEffect, useCallback } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    if (onClick) onClick();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`block md:inline-block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
        isActive
          ? 'text-primary'
          : 'text-muted-text hover:text-light-text'
      } ${!!onClick ? 'w-full text-left' : ''}`}
    >
      {children}
    </a>
  );
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const navLinksInfo = [
    { href: '#hero', label: 'Home', id: 'hero' },
    { href: '#about', label: 'About', id: 'about' },
    { href: '#portfolio', label: 'Work', id: 'portfolio' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);

    const sections = navLinksInfo.map(link => document.getElementById(link.id));
    const scrollPosition = window.scrollY + 100; // Offset for better accuracy

    let currentSectionId = 'hero';
    for (const section of sections) {
      if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
        currentSectionId = section.id;
        break;
      }
    }
    setActiveSection(currentSectionId);
  }, [navLinksInfo]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-dark-bg/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
                handleNavLinkClick();
              }}
              className="text-3xl font-display font-bold text-primary hover:text-secondary transition-colors"
            >
              YO.
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinksInfo.map((link) => (
                <NavLink
                  key={link.id}
                  href={link.href}
                  isActive={activeSection === link.id}
                  onClick={handleNavLinkClick}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-light-text hover:text-primary focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-card shadow-lg">
          {navLinksInfo.map((link) => (
            <NavLink
              key={link.id}
              href={link.href}
              isActive={activeSection === link.id}
              onClick={handleNavLinkClick}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
