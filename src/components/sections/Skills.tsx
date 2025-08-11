import React from 'react';
import { FaCode, FaPaintBrush, FaCog } from 'react-icons/fa';

interface Skill {
  name: string;
}

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
  icon: React.ReactNode;
}

const skillsData = {
  development: [
    { name: 'ReactJS' }, { name: 'TailwindCSS' }, { name: 'JavaScript' },
    { name: 'VueJS' }, { name: 'Bootstrap' }, { name: 'HTML5/CSS3' },
    { name: 'TypeScript' }, { name: 'Git & GitHub' },
  ],
  design: [
    { name: 'Figma' }, { name: 'Adobe XD' }, { name: 'Adobe Photoshop' },
    { name: 'CorelDraw' }, { name: 'UI/UX Principles' }, { name: 'Wireframing' },
    { name: 'Prototyping' }, { name: 'Brand Identity' },
  ],
  professional: [
    { name: 'Microsoft Office' }, { name: 'IT Support' }, { name: 'Problem Solving' },
    { name: 'Agile Methodologies' }, { name: 'Team Collaboration' },
  ],
};

const SkillCategory: React.FC<SkillCategoryProps> = ({ title, skills, icon }) => (
  <div className="bg-dark-card p-6 rounded-lg shadow-md" data-aos="fade-up">
    <div className="flex items-center mb-4">
      <span className="text-primary text-2xl mr-3">{icon}</span>
      <h3 className="text-2xl font-bold text-light-text">{title}</h3>
    </div>
    <ul className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <li key={index} className="bg-gray-700 text-muted-text px-3 py-1 rounded-full text-sm font-medium">
          {skill.name}
        </li>
      ))}
    </ul>
  </div>
);

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-display font-bold text-primary mb-3">Skills & Expertise</h2>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            My technical and creative capabilities.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkillCategory title="Development" skills={skillsData.development} icon={<FaCode />} />
          <SkillCategory title="Design" skills={skillsData.design} icon={<FaPaintBrush />} />
          <SkillCategory title="Professional" skills={skillsData.professional} icon={<FaCog />} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
