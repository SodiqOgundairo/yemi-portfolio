import React from 'react';
import { Project } from '../../data/portfolioData'; // Assuming Project type is exported from data

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  // Stop propagation to prevent closing modal when clicking inside content
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close when clicking on the backdrop
      data-aos="fade" // General fade for modal backdrop
    >
      <div
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={handleModalContentClick} // Prevent backdrop click from closing via content
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-[101]"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h3 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-4 pr-8">{project.title}</h3>

        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={project.imageUrl || project.thumbnailUrl}
            alt={project.title}
            className="w-full h-auto object-contain max-h-[50vh] rounded-md"
          />
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-teal-300 mb-2">Description</h4>
          <p className="text-gray-300 leading-relaxed">{project.description}</p>
        </div>

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-teal-300 mb-2">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm shadow">
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
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              View Project / Live Site
            </a>
          )}
          {project.moreDetailsUrl && (
             <a
              href={project.moreDetailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              More Details / Source
            </a>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProjectModal;
