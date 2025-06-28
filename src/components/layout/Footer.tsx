import React from 'react';
// Optionally import social icons if you decide to add them here too
// import { FaLinkedin, FaGithub, FaBehanceSquare } from 'react-icons/fa';
// import { FaSquareXTwitter, FaSquareInstagram } from 'react-icons/fa6';


const Footer: React.FC = () => {
  // const socialLinks = [
  //   { href: "https://linkedin.com/in/yemi-ogundairo", icon: <FaLinkedin />, label: "LinkedIn" },
  //   { href: "https://github.com/SodiqOgundairo", icon: <FaGithub />, label: "GitHub" },
  //   { href: "https://behance.net/gr8qmgenesis", icon: <FaBehanceSquare />, label: "Behance" },
  //   { href: "https://x.com/@yemi_ogundairo", icon: <FaSquareXTwitter />, label: "X (Twitter)" },
  //   { href: "https://www.instagram.com/yemi_ogundairo_", icon: <FaSquareInstagram />, label: "Instagram" },
  // ];

  return (
    <footer
      className="py-8 px-4 bg-gray-800 text-center text-gray-500 border-t border-gray-700"
     
    >
      {/* Optional: Social Links in Footer
      <div className="flex justify-center space-x-6 mb-6">
        {socialLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-gray-400 hover:text-blue-400 transition-colors text-2xl"
          >
            {link.icon}
          </a>
        ))}
      </div>
      */}

      <p className="text-sm">
        &copy; {new Date().getFullYear()} Yemi Ogundairo. All rights reserved.
      </p>
      <p className="text-xs mt-2">
        {/* You can add a small tagline or "Made with..." if you like */}
        {/* Crafted with React, TypeScript, Tailwind CSS, and ❤️ */}
      </p>
    </footer>
  );
};

export default Footer;
