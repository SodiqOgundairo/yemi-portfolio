import React from 'react';
import type { Project } from '../../data/portfolioData';
import { FaTimes, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-dark-card p-6 sm:p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={handleModalContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-text hover:text-light-text transition-colors z-[101]"
          aria-label="Close modal"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={project.imageUrl || project.thumbnailUrl}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">{project.title}</h3>
            <p className="text-sm text-muted-text mb-4 capitalize">{project.category.join(', ')}</p>

            <p className="text-light-text leading-relaxed mb-6">{project.description}</p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-light-text mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="bg-gray-700 text-muted-text px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary hover:bg-secondary text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FaExternalLinkAlt />
                  <span>View Project</span>
                </a>
              )}
              {project.moreDetailsUrl && (
                 <a
                  href={project.moreDetailsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-light-text font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FaInfoCircle />
                  <span>More Details</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
