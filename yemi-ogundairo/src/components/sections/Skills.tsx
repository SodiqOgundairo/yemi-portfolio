import React from 'react';
// Consider importing icons from a library like react-icons if desired
// import { FaReact, FaJsSquare, FaFigma, FaBootstrap } from 'react-icons/fa';
// import { SiTailwindcss, SiAdobephotoshop, SiAdobexd, SiCoreldraw } from 'react-icons/si';
// import { DiVuejs } from 'react-icons/di'; // Vuejs
// import { AiFillDatabase } from 'react-icons/ai'; // Placeholder for MS Office or general tech

interface SkillItem {
  name: string;
  level?: string; // e.g., "Advanced", "Intermediate", or a percentage if you still prefer
  // icon?: React.ReactElement; // For react-icons
}

const skillsData: SkillItem[] = [
  // Development Skills
  { name: 'ReactJS', level: '80%' }, // level can be used for visual cues if desired
  { name: 'TailwindCSS', level: '90%' },
  { name: 'JavaScript', level: '80%' },
  { name: 'VueJS', level: '80%' },
  { name: 'Bootstrap', level: '85%' },
  { name: 'HTML5' },
  { name: 'CSS3' },
  { name: 'TypeScript' }, // Add if you want to list it explicitly
  { name: 'Git & GitHub'},

  // Design Skills
  { name: 'Figma', level: '95%' },
  { name: 'Adobe XD', level: '85%' },
  { name: 'Adobe Photoshop', level: '85%' },
  { name: 'CorelDraw', level: '95%' },
  { name: 'UI/UX Design Principles' },
  { name: 'Wireframing & Prototyping' },
  { name: 'Brand Identity Design' },

  // Other Skills
  { name: 'Microsoft Office', level: '95%' },
  { name: 'IT Support' },
  { name: 'Problem Solving' },
  { name: 'Agile Methodologies' },
  { name: 'Team Collaboration' },
];

const SkillCard: React.FC<{ skill: SkillItem }> = ({ skill }) => (
  <div
    className="bg-gray-700 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-blue-400/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center text-center"
    data-aos="fade-up"
    // data-aos-delay could be dynamic based on index if mapping
  >
    {/* {skill.icon && <div className="text-4xl text-blue-400 mb-3">{skill.icon}</div>} */}
    <h4 className="text-lg sm:text-xl font-semibold text-gray-100">{skill.name}</h4>
    {/* Optional: display level if provided and desired */}
    {/* {skill.level && <p className="text-sm text-blue-300 mt-1">{skill.level}</p>} */}
  </div>
);

const Skills: React.FC = () => {
  const devSkills = skillsData.filter(s => ['ReactJS', 'TailwindCSS', 'JavaScript', 'VueJS', 'Bootstrap', 'HTML5', 'CSS3', 'TypeScript', 'Git & GitHub'].includes(s.name));
  const designSkills = skillsData.filter(s => ['Figma', 'Adobe XD', 'Adobe Photoshop', 'CorelDraw', 'UI/UX Design Principles', 'Wireframing & Prototyping', 'Brand Identity Design'].includes(s.name));
  const otherSkills = skillsData.filter(s => !devSkills.includes(s) && !designSkills.includes(s));


  return (
    <section id="skills" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-blue-400 mb-3">My Skills</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A blend of design prowess and development expertise to bring ideas to life.
          </p>
          <div className="w-20 h-1 bg-blue-400 mx-auto rounded mt-2"></div>
        </div>

        {/* Development Skills */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-2xl sm:text-3xl font-semibold text-teal-300 mb-6 text-center">Development</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {devSkills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </div>

        {/* Design Skills */}
        <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-2xl sm:text-3xl font-semibold text-teal-300 mb-6 text-center">Design</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {designSkills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </div>

        {/* Other Skills */}
        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-2xl sm:text-3xl font-semibold text-teal-300 mb-6 text-center">Professional & Other</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {otherSkills.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
