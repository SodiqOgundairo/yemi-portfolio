import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Resume from './components/sections/Resume';
import Portfolio from './components/sections/Portfolio';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="bg-gray-900 text-white"> {/* Base background for the whole page */}
      <Navbar />
      <Hero />

      <main>
        <About />
        <Skills />
        <Resume />
        <Portfolio />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
