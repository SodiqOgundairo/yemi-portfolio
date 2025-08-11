import React from 'react';
import { ReactTyped } from 'react-typed';
import { FaGithub, FaLinkedin, FaBehance } from 'react-icons/fa';

const Hero: React.FC = () => {
  const socialLinks = [
    { href: "https://github.com/SodiqOgundairo", icon: <FaGithub />, label: "GitHub" },
    { href: "https://linkedin.com/in/yemi-ogundairo", icon: <FaLinkedin />, label: "LinkedIn" },
    { href: "https://behance.net/gr8qmgenesis", icon: <FaBehance />, label: "Behance" },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center bg-dark-bg pt-20 md:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Text Content */}
          <div className="text-center md:text-left" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-light-text mb-4">
              <span className="block mb-2">Hi, I'm Yemi,</span>
              a Creative
              <span className="text-primary ml-2">
                <ReactTyped
                  strings={[
                    "Product Designer",
                    "Frontend Developer",
                    "Graphics Designer",
                  ]}
                  typeSpeed={60}
                  backSpeed={40}
                  backDelay={1800}
                  loop
                  smartBackspace
                />
              </span>
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-lg text-muted-text mb-8">
              I specialize in building and designing exceptional digital experiences. Currently, I’m focused on creating intuitive user interfaces and scalable web applications.
            </p>
            <div className="flex justify-center md:justify-start items-center gap-4 mb-8">
              <a
                href="#portfolio"
                onClick={(e) => { e.preventDefault(); document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                My Work
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Me
              </a>
            </div>
            <div className="flex justify-center md:justify-start space-x-6">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-muted-text hover:text-primary transition-colors text-3xl"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Image Content */}
          <div className="flex justify-center" data-aos="fade-left">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent rounded-full blur-2xl opacity-50"></div>
              <img
                src="https://raw.githubusercontent.com/SodiqOgundairo/portfolio/main/assets/img/lamba.jpg"
                alt="Yemi Ogundairo"
                className="relative w-full h-full object-cover rounded-full shadow-2xl border-4 border-dark-bg"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
