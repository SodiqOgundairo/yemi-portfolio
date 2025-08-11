import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaGithub, FaLinkedin, FaBehance } from 'react-icons/fa';

const Contact: React.FC = () => {
  const contactInfo = [
    { icon: <FaEnvelope />, text: "ogundairosodiq954@gmail.com", href: "mailto:ogundairosodiq954@gmail.com" },
    { icon: <FaPhoneAlt />, text: "+234 810 998 3194", href: "tel:+2348109983194" },
    { icon: <FaMapMarkerAlt />, text: "Ogun, Nigeria" },
  ];

  const socialLinks = [
    { href: "https://github.com/SodiqOgundairo", icon: <FaGithub />, label: "GitHub" },
    { href: "https://linkedin.com/in/yemi-ogundairo", icon: <FaLinkedin />, label: "LinkedIn" },
    { href: "https://behance.net/gr8qmgenesis", icon: <FaBehance />, label: "Behance" },
  ];

  return (
    <section id="contact" className="py-20 bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-display font-bold text-primary mb-3">Get In Touch</h2>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear from you.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded mt-4"></div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-dark-card p-8 rounded-lg shadow-lg">
          {/* Contact Info */}
          <div data-aos="fade-right">
            <h3 className="text-2xl font-bold text-light-text mb-6">Contact Information</h3>
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <span className="text-primary text-2xl mr-4">{item.icon}</span>
                {item.href ? (
                  <a href={item.href} className="text-muted-text hover:text-primary transition-colors">{item.text}</a>
                ) : (
                  <span className="text-muted-text">{item.text}</span>
                )}
              </div>
            ))}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-light-text mb-4">Follow Me</h3>
              <div className="flex space-x-4">
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
          </div>

          {/* Contact Form - NOTE: User needs to replace the action URL with their Formspree ID */}
          <div data-aos="fade-left">
            <h3 className="text-2xl font-bold text-light-text mb-6">Send Me a Message</h3>
            <form action="https://formspree.io/f/your_form_id" method="POST">
              <div className="mb-4">
                <label htmlFor="name" className="block text-light-text font-medium mb-2">Name</label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-2 bg-gray-700 text-light-text border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-light-text font-medium mb-2">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-2 bg-gray-700 text-light-text border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-light-text font-medium mb-2">Message</label>
                <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2 bg-gray-700 text-light-text border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
