import React from 'react';

// Using the image from the old portfolio as a placeholder
const profilePicUrl = "https://raw.githubusercontent.com/SodiqOgundairo/portfolio/main/assets/img/lamba.jpg";

interface InfoItemProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode; // Optional: for icons next to items
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => (
  <li className="flex items-center mb-2">
    {icon && <span className="mr-2 text-blue-400">{icon}</span>}
    <strong className="text-gray-200">{label}:</strong>
    <span className="ml-2 text-gray-400">{value}</span>
  </li>
);

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-blue-400 mb-3">About Me</h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto rounded"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-16">
          <div
            className="w-full md:w-1/3 flex-shrink-0"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <img
              src={profilePicUrl}
              alt="Yemi Ogundairo"
              className="rounded-lg shadow-xl mx-auto md:mx-0 object-cover w-64 h-64 md:w-full md:h-auto max-h-[500px]"
            />
          </div>
          <div
            className="md:w-2/3"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <h3 className="text-3xl font-semibold text-teal-300 mb-4">
              Product Designer, Frontend Developer & Graphics Designer.
            </h3>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed fst-italic">
              "A designer and developer with out of the box problem solving skills."
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              An agile, versatile, smart and a great team player who is highly passionate about aesthetic designs and problem solving. A Front-End Developer and Creative Designer, strategic Information Technology personnel skilled
              in guiding navigation of modern technology. A great team player accustomed to driving efficiency
              and effectiveness by developing, delivering, and supporting strategic plans. Demonstrated skill in
              translating technical requirements to business solutions. An Enthusiast learner with a successful
              record of building positive relationships with internal and external stakeholders.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 mb-6">
              <ul>
                <InfoItem label="Website" value={<a href="https://yemiogundairo.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">yemiogundairo.vercel.app</a>} />
                <InfoItem label="Phone" value={<a href="tel:+2348109983194" className="hover:text-blue-300 transition-colors">+234 810 998 3194</a>} />
                <InfoItem label="Country" value="Nigeria" />
              </ul>
              <ul>
                <InfoItem label="Degree" value="BSc (Computer Science)" />
                <InfoItem label="Email" value={<a href="mailto:ogundairosodiq954@gmail.com" className="hover:text-blue-300 transition-colors">ogundairosodiq954@gmail.com</a>} />
                <InfoItem label="Freelance" value="Available" />
              </ul>
            </div>

            {/* Optional: A small blurb or quote */}
            {/* <p className="text-gray-500 italic">
              "Passionate about creating solutions that are not only functional but also beautiful and intuitive."
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
