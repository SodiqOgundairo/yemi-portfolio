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
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClick) {
      onClick(); // This will call handleNavLinkClick from Navbar for mobile
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                  ${isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  ${!!onClick ? 'w-full text-left' : ''} // Check if onClick is passed (for mobile links)
                  `}
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
    { href: '#skills', label: 'Skills', id: 'skills'},
    { href: '#resume', label: 'Resume', id: 'resume' },
    { href: '#portfolio', label: 'Portfolio', id: 'portfolio' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  const getNavbarHeight = useCallback(() => {
    // Standard h-16 Tailwind class is 4rem = 64px.
    // This function can be enhanced if the navbar height is dynamic.
    return 64;
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
    const navbarHeight = getNavbarHeight();
    let currentSectionId = '';

    // Determine which section is active
    for (const section of navLinksInfo) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Check if the top of the section is at or above the bottom of the navbar
        // and the bottom of the section is below the top of the viewport + navbar height (ensuring it's visible)
        // A common approach is to check if the section is in the "middle" of the screen or takes up most of it.
        // This logic might need tweaking based on section heights.
        // A section is active if its top is above a certain threshold (e.g., half screen height or specific offset)
        // and its bottom is also below a certain threshold.
        if (rect.top <= navbarHeight + window.innerHeight * 0.3 && rect.bottom >= navbarHeight) {
            currentSectionId = section.id;
            break;
        }
      }
    }

    // Fallback logic if no section strictly meets the criteria (e.g., between sections or at extremes)
    if (!currentSectionId) {
        if (window.scrollY < window.innerHeight / 2) {
            currentSectionId = 'hero'; // Default to hero if near the top
        } else if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - navbarHeight - 50) { // Near bottom
            currentSectionId = navLinksInfo[navLinksInfo.length - 1].id; // Default to last if near bottom
        } else {
            currentSectionId = activeSection; // Keep current if nothing else matches
        }
    }

    if (activeSection !== currentSectionId) {
        setActiveSection(currentSectionId);
    }

  }, [navLinksInfo, getNavbarHeight, activeSection]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavLinkClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${isScrolled || isMobileMenuOpen ? 'bg-gray-800 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
                handleNavLinkClick('hero');
              }}
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Yemi Ogundairo
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinksInfo.map((link) => (
                <NavLink
                  key={link.id}
                  href={link.href}
                  isActive={activeSection === link.id}
                  onClick={() => handleNavLinkClick(link.id)} // Pass the handler directly
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
              className="bg-gray-700 p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 shadow-lg rounded-b-md">
          {navLinksInfo.map((link) => (
            <NavLink
              key={link.id}
              href={link.href}
              isActive={activeSection === link.id}
              onClick={() => handleNavLinkClick(link.id)} // Pass the handler
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
