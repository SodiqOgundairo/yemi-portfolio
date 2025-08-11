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
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="portfolio" className="py-20 bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-display font-bold text-primary mb-3">My Work</h2>
          <p className="text-lg text-muted-text max-w-2xl mx-auto">
            Here are some of my recent projects.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded mt-4"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-10" data-aos="fade-up" data-aos-delay="100">
          {portfolioCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50
                ${activeFilter === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-dark-card text-muted-text hover:bg-primary hover:text-white'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div key={project.id} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
              <PortfolioCard
                project={project}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <p className="text-center text-muted text-xl mt-8" data-aos="fade-up">
            No projects in this category yet. Stay tuned!
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
