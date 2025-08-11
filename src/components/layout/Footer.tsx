import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg py-8 px-4 text-center text-muted-text border-t border-gray-700">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Yemi Ogundairo. All Rights Reserved.
      </p>
      <p className="text-xs mt-2">
        Designed & Built by Yemi Ogundairo
      </p>
    </footer>
  );
};

export default Footer;
