import React from 'react';

interface ResumeItemProps {
  title: string;
  duration?: string;
  institution?: string;
  details?: string | string[];
  isEducation?: boolean;
  location?: string;
}

const ResumeCard: React.FC<ResumeItemProps & { 'data-aos': string; 'data-aos-delay'?: string }> = ({ title, duration, institution, details, location, isEducation, ...aosProps }) => (
  <div
    className="mb-8 p-6 bg-gray-800 rounded-lg shadow-xl hover:shadow-blue-400/30 transition-shadow duration-300"
    {...aosProps}
  >
    <h4 className={`text-xl sm:text-2xl font-semibold ${isEducation ? 'text-blue-300' : 'text-teal-300'} mb-1`}>{title}</h4>
    {institution && <p className="text-md text-gray-400 mb-1">{institution}</p>}
    {duration && <p className="text-sm text-gray-500 mb-2">{duration}</p>}
    {location && <p className="text-sm text-gray-500 mb-3 italic">{location}</p>}
    {typeof details === 'string' && <p className="text-gray-300 leading-relaxed">{details}</p>}
    {Array.isArray(details) && (
      <ul className="list-disc list-inside text-gray-300 space-y-1 leading-relaxed">
        {details.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    )}
  </div>
);

const Resume: React.FC = () => {
  const summary = "Creative Product Designer, Graphics & Brand Expert and Front-End Developer with over 7 years of experience turning ideas into impactful digital products. Blending design thinking, intuitive interfaces, and clean code to craft user-centered experiences across web and mobile platforms. Mentoring designers, leading cross-functional teams, and collaborating with startups, and tech communities to build meaningful solutions. With a single goal in mind: solving real problems beautifully.";
  const resumeDownloadLink = "https://drive.google.com/file/d/1HwyjrWlUr3h-8JX_pkU7asc61pjKfrmc/view?usp=sharing";

  const educationData: ResumeItemProps[] = [
    {
      title: "Bachelor of Science; Computer Science",
      duration: "2021 - Present",
      institution: "National Open University of Nigeria",
      isEducation: true,
    }
  ];

  const experienceData: ResumeItemProps[] = [
    {
      title: "Graphics/UI Designer",
      institution: "AIENAI",
      duration: "Aug 2024 - Present",
      location: "UK",
      details: [
        "Created visually compelling flyers for the UX Coaching Academy.",
        "Optimized company and academy webpages to boost visibility and revenue.",
        "Collaborated in training sessions to improve course delivery and overall project outcomes.",
        "Managed both internal and client projects, consistently exceeding expectations."
      ]
    },
    {
      title: "Creative Designer",
      institution: "Association of Mobile Money and Bank Agents of Nigeria (AMMBAN)",
      duration: "Jan 2024 - Present (Seasonal)",
      location: "Abuja, Nigeria",
      details: [
        "Designed creative promotional materials resulting in 75% higher engagement and a 40% increase in membership registrations.",
        "Developed targeted content strategies that drove a 15% growth in brand awareness."
      ]
    },
    {
      title: "IT Support/Frontend Developer",
      institution: "HIKIMA ACADEMY",
      duration: "Mar 2023 - Present (Seasonal)",
      location: "Chicago, USA",
      details: [
        "Developed a user-friendly website that reduced bounce rates by 50% and increased course enrollments by 15%.",
        "Led training initiatives for interns and students, achieving 90% positive feedback.",
        "Designed brand creatives that enhanced organizational visibility by over 20%.",
        "Supervised a cross-functional team to build a robust application for All Saints University, Dominica using native HTML, CSS, VanillaJS and PHP."
      ]
    },
    {
      title: "Product Designer",
      institution: "TEDPRIME HUB",
      duration: "Jan 2022 – Sept 2024",
      location: "Ogun, Nigeria",
      details: [
        "Revamped the company’s web app, resulting in a 30% increase in user sessions and a 25% rise in inquiries.",
        "As design lead, boosted product visibility by 40% and conversion rates by 20%.",
        "Contributed to strategic branding for the Microsoft Agrotech Hackathon in 2021.",
        "Led training bootcamps for interns and students, achieving 90% positive feedback. And a significant increase in revenue.",
        "Led the redesign of the Learnflox interface, reducing user complaints by 20% and boosting satisfaction by 15%.",
        "Served as design lead for the mobile app “Payproof” and contributed to a HR application (Altarnorm)."
      ]
    },
    {
      title: "UX/UI & Brand Designer",
      institution: "7TH INFOTECH",
      duration: "Sept 2022 – Feb 2023",
      location: "Turkey",
      details: [
        "Enhanced the company’s brand image, contributing to a 20% increase in client inquiries.",
        "Developed an intuitive UI for a Learning Management System, improving user engagement by 25%."
      ]
    },
    {
      title: "Graphics Design & Tutor",
      institution: "BROAD CONCEPT INTERNATIONAL AND ENTREPRENEURSHIP HUB",
      duration: "Aug 2021 - Jan 2022",
      location: "Ogun, Nigeria",
      details: [
        "Lead in the design, development, and implementation of the graphic, layout, and production communication materials",
        "Tutoring admitted trainees on CorelDraw",
        "Collaborating with technical team to complete organizational projects.",
        "Ensuring of intermittent upgrade of the hub in respect to ICT related facilities"
      ]
    },
    {
      title: "ICT Manager & Graphics Designer",
      institution: "TAIDOB COLLEGE",
      duration: "Jan 2018 - Dec 2021",
      location: "Ogun, Nigeria",
      details: [
        "User Support & Digital Transformation: Delivered prompt technical support and drove digital initiatives.",
        "Vendor & Budget Oversight: Managed IT budgets and coordinated with vendors for cost-effective solutions.",
        "System Security: Implemented robust security protocols to ensure high system reliability.",
        "Team Leadership: Led and mentored IT staff, fostering a collaborative environment.",
        "Strategic IT Management: Oversaw and optimized digital infrastructure to support academic and administrative functions."
      ]
    }
  ];

  return (
    <section id="resume" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-blue-400 mb-3">Resume</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">{summary}</p>
          <div className="w-20 h-1 bg-blue-400 mx-auto rounded mt-3"></div>
          <a
            href={resumeDownloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Download My Résumé
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Education Column */}
          <div data-aos="fade-right" data-aos-delay="200">
            <h3 className="text-3xl font-semibold text-blue-300 mb-8 text-center md:text-left">Education</h3>
            {educationData.map((item, index) => (
              <ResumeCard key={`edu-${index}`} {...item} data-aos="fade-up" data-aos-delay={`${index * 100 + 200}`}/>
            ))}
          </div>

          {/* Experience Column */}
          <div data-aos="fade-left" data-aos-delay="300">
            <h3 className="text-3xl font-semibold text-teal-300 mb-8 text-center md:text-left">Professional Experience</h3>
            {experienceData.map((item, index) => (
              <ResumeCard key={`exp-${index}`} {...item} data-aos="fade-up" data-aos-delay={`${index * 100 + 300}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
