import React from 'react';
import { ReactTyped } from 'react-typed';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-900 text-white p-4 relative overflow-hidden">
      {/* Background elements - placeholder, can be replaced with more sophisticated graphics/images */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        {/* Example: Subtle geometric pattern or abstract shapes */}
        {/* <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5"/></pattern><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="url(#smallGrid)"/><path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg> */}
      </div>

      <div className="z-10" data-aos="fade-up">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-300 mb-2"
          data-aos="fade-down"
          data-aos-delay="200"
        >
          Hi there <span role="img" aria-label="waving hand">👋</span>, I am
        </h2>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-green-400"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          Yemi Ogundairo
        </h1>
        <div
          className="text-2xl sm:text-3xl md:text-4xl text-gray-200 mb-8"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <ReactTyped
            strings={[
              "A Product Designer",
              "A Frontend Developer",
              "A Graphics Designer",
              "An IT Support Specialist",
              "A Creative Writer"
            ]}
            typeSpeed={50}
            backSpeed={30}
            backDelay={1500}
            loop
            smartBackspace
            className="font-semibold text-teal-300"
          />
        </div>
        <p
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          I craft engaging digital experiences with a passion for aesthetics and problem-solving.
          Let's build something amazing together.
        </p>
        <div data-aos="fade-up" data-aos-delay="800">
          <a
            href="#portfolio"
            onClick={(e) => { e.preventDefault(); document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            View My Work
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="ml-4 border border-gray-500 hover:bg-gray-700 text-gray-300 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll down indicator (optional) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10" data-aos="fade-up" data-aos-delay="1200" data-aos-anchor="#hero">
          <a href="#about" onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label="Scroll to about section">
            <svg className="w-8 h-8 text-gray-500 animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
      </div>
    </section>
  );
};

export default Hero;
