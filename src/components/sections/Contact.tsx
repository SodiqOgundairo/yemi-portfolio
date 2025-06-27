import React from 'react';
import { FaLinkedin, FaGithub, FaBehanceSquare, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { FaSquareXTwitter, FaSquareInstagram } from 'react-icons/fa6'; // Using FaSquareXTwitter for X

interface SocialLinkProps {
  href: string;
  icon: React.ReactElement;
  label: string;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`text-gray-400 hover:text-blue-400 transition-colors text-3xl ${className}`}
  >
    {icon}
  </a>
);

interface ContactInfoItemProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  href?: string;
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ icon, label, value, href }) => (
  <div className="flex items-start mb-4" data-aos="fade-up" data-aos-delay="100">
    <span className="text-blue-400 text-2xl mr-4 mt-1">{icon}</span>
    <div>
      <h4 className="text-lg font-semibold text-gray-200">{label}</h4>
      {href ? (
        <a href={href} className="text-gray-400 hover:text-blue-300 transition-colors break-all">{value}</a>
      ) : (
        <p className="text-gray-400 break-all">{value}</p>
      )}
    </div>
  </div>
);


const Contact: React.FC = () => {
  const socialLinks = [
    { href: "https://linkedin.com/in/yemi-ogundairo", icon: <FaLinkedin />, label: "LinkedIn" },
    { href: "https://github.com/SodiqOgundairo", icon: <FaGithub />, label: "GitHub" },
    { href: "https://behance.net/gr8qmgenesis", icon: <FaBehanceSquare />, label: "Behance" },
    { href: "https://x.com/@yemi_ogundairo", icon: <FaSquareXTwitter />, label: "X (Twitter)" },
    { href: "https://www.instagram.com/yemi_ogundairo_", icon: <FaSquareInstagram />, label: "Instagram" },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-blue-400 mb-3">Get In Touch</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
          <div className="w-20 h-1 bg-blue-400 mx-auto rounded mt-2"></div>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-800 p-8 sm:p-10 rounded-xl shadow-2xl">
          <div className="grid md:grid-cols-1 gap-8"> {/* Was grid-cols-2, making it 1 for better flow of contact info */}
            <div>
              {/* <h3 className="text-2xl font-semibold text-teal-300 mb-6" data-aos="fade-up">Contact Information</h3> */}
              <ContactInfoItem
                icon={<FaMapMarkerAlt />}
                label="Location"
                value="Abeokuta, Ogun State, Nigeria"
              />
              <ContactInfoItem
                icon={<FaEnvelope />}
                label="Email"
                value="ogundairosodiq954@gmail.com"
                href="mailto:ogundairosodiq954@gmail.com"
              />
              <ContactInfoItem
                icon={<FaPhoneAlt />}
                label="Phone"
                value="+234 810 998 3194"
                href="tel:+2348109983194"
              />
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-700 text-center" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-xl sm:text-2xl font-semibold text-teal-300 mb-6">Connect With Me</h3>
            <div className="flex justify-center space-x-6">
              {socialLinks.map(link => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
