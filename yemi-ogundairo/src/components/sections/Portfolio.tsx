import React, { useState, useMemo } from 'react';
import { projectsData, portfolioCategories } from '../../data/portfolioData';
import type { Project, ProjectCategory } from '../../data/portfolioData';
import PortfolioCard from './PortfolioCard';
import ProjectModal from './ProjectModal';

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return projectsData;
    }
    return projectsData.filter(project => project.category.includes(activeFilter));
  }, [activeFilter]);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent background scroll when modal is open
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto'; // Restore scroll
  };

  return (
    <section id="portfolio" className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-blue-400 mb-3">My Portfolio</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A selection of projects that showcase my passion for design and development.
          </p>
          <div className="w-20 h-1 bg-blue-400 mx-auto rounded mt-2"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-10" data-aos="fade-up" data-aos-delay="100">
          {portfolioCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ease-in-out focus:outline-none
                ${activeFilter === category.id
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-blue-400 hover:text-white hover:shadow-md'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
                onViewDetails={handleViewDetails}
                // data-aos-delay can be added here if needed for staggered animation
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl" data-aos="fade-up">
            No projects found for this category. More coming soon!
          </p>
        )}

      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default Portfolio;
