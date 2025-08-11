import React from 'react';
import { FaGraduationCap, FaBriefcase, FaDownload } from 'react-icons/fa';

interface ResumeItemProps {
  title: string;
  duration?: string;
  institution?: string;
  details?: string[];
}

const resumeDownloadLink = "https://drive.google.com/file/d/1HwyjrWlUr3h-8JX_pkU7asc61pjKfrmc/view?usp=sharing";

const educationData: ResumeItemProps[] = [
  {
    title: "BSc in Computer Science",
    duration: "2021 - Present",
    institution: "National Open University of Nigeria",
  }
];

const experienceData: ResumeItemProps[] = [
    {
      title: "Graphics/UI Designer",
      institution: "AIENAI, UK",
      duration: "Aug 2024 - Present",
      details: [
        "Created visually compelling flyers and optimized web pages to boost visibility.",
        "Managed internal and client projects, consistently exceeding expectations."
      ]
    },
    {
      title: "Creative Designer",
      institution: "AMMBAN, Nigeria",
      duration: "Jan 2024 - Present",
      details: [
        "Designed promotional materials resulting in 75% higher engagement.",
        "Developed content strategies that drove a 15% growth in brand awareness."
      ]
    },
    {
      title: "IT Support/Frontend Developer",
      institution: "HIKIMA ACADEMY, USA",
      duration: "Mar 2023 - Present",
      details: [
        "Developed a user-friendly website that reduced bounce rates by 50%.",
        "Led training initiatives and designed brand creatives enhancing visibility by over 20%."
      ]
    },
    {
      title: "Product Designer",
      institution: "TEDPRIME HUB, Nigeria",
      duration: "Jan 2022 – Sept 2024",
      details: [
        "Revamped the company’s web app, resulting in a 30% increase in user sessions.",
        "Led design for a mobile app and contributed to an HR application."
      ]
    },
];

const ResumeItem: React.FC<ResumeItemProps> = ({ title, institution, duration, details }) => (
  <div className="relative pl-10 pb-8 border-l-2 border-gray-700">
    <div className="absolute -left-3 top-0 w-5 h-5 bg-primary rounded-full border-4 border-dark-bg"></div>
    <h4 className="text-xl font-bold text-light-text mb-1">{title}</h4>
    <p className="font-semibold text-muted-text mb-1">{institution}</p>
    <p className="text-sm text-gray-500 mb-3">{duration}</p>
    {details && (
      <ul className="list-disc list-inside text-muted-text space-y-1">
        {details.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    )}
  </div>
);

const Resume: React.FC = () => {
  return (
    <section id="resume" className="py-20 bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-display font-bold text-primary mb-3">My Journey</h2>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            A summary of my education and professional experience.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Education */}
          <div data-aos="fade-right">
            <div className="flex items-center mb-8">
              <FaGraduationCap className="text-3xl text-primary mr-4" />
              <h3 className="text-3xl font-bold text-light-text">Education</h3>
            </div>
            {educationData.map((item, index) => (
              <ResumeItem key={`edu-${index}`} {...item} />
            ))}
          </div>

          {/* Experience */}
          <div data-aos="fade-left">
            <div className="flex items-center mb-8">
              <FaBriefcase className="text-3xl text-primary mr-4" />
              <h3 className="text-3xl font-bold text-light-text">Experience</h3>
            </div>
            {experienceData.map((item, index) => (
              <ResumeItem key={`exp-${index}`} {...item} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12" data-aos="fade-up">
          <a
            href={resumeDownloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            <FaDownload />
            <span>Download Full Résumé</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Resume;
