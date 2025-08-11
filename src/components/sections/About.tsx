import React from 'react';
import { FaCalendarAlt, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const profilePicUrl = "https://raw.githubusercontent.com/SodiqOgundairo/portfolio/main/assets/img/lamba.jpg";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start mb-4">
    <span className="text-primary mr-4 mt-1 text-xl">{icon}</span>
    <div>
      <h4 className="font-semibold text-light-text">{label}</h4>
      <p className="text-muted-text">{value}</p>
    </div>
  </div>
);

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-display font-bold text-primary mb-3">About Me</h2>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            A passionate designer and developer with a knack for creating elegant solutions.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          {/* Image */}
          <div
            className="md:col-span-2"
            data-aos="fade-right"
          >
            <img
              src={profilePicUrl}
              alt="Yemi Ogundairo"
              className="rounded-lg shadow-xl mx-auto object-cover w-full h-auto max-h-[500px]"
            />
          </div>

          {/* Content */}
          <div
            className="md:col-span-3"
            data-aos="fade-left"
          >
            <h3 className="text-3xl font-bold text-light-text mb-4">
              I build & design digital products.
            </h3>
            <p className="text-muted-text mb-6 leading-relaxed">
              I am an agile, versatile, and passionate team player with a strong focus on aesthetic designs and problem-solving. As a Front-End Developer and Creative Designer, I am skilled in navigating modern technology and translating technical requirements into effective business solutions. I have a proven track record of building positive relationships with both internal and external stakeholders and am an enthusiastic lifelong learner.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem icon={<FaCalendarAlt />} label="Degree" value="BSc (Computer Science)" />
              <InfoItem icon={<FaEnvelope />} label="Email" value={<a href="mailto:ogundairosodiq954@gmail.com" className="hover:text-primary transition-colors">ogundairosodiq954@gmail.com</a>} />
              <InfoItem icon={<FaPhoneAlt />} label="Phone" value={<a href="tel:+2348109983194" className="hover:text-primary transition-colors">+234 810 998 3194</a>} />
              <InfoItem icon={<FaMapMarkerAlt />} label="Location" value="Nigeria" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
