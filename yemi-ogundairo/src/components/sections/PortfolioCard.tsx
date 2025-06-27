import React from 'react';
import { Project } from '../../data/portfolioData';

interface PortfolioCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onViewDetails }) => {
  return (
    <div
      className="group bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-blue-400/40 cursor-pointer"
      onClick={() => onViewDetails(project)}
      data-aos="fade-up" // Individual card animation
      // Consider adding data-aos-delay based on index if mapping directly in Portfolio.tsx
    >
      <div className="relative w-full h-56 sm:h-64 overflow-hidden">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
           {/* You could add a "View Details" text or icon here that appears on hover */}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl sm:text-2xl font-semibold text-blue-300 mb-2 truncate group-hover:text-teal-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3 capitalize">
          {/* Displaying the first category, or join if multiple */}
          {project.category.join(', ')}
        </p>
        {/* <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">
          {project.description.substring(0, 70)}{project.description.length > 70 && '...'}
        </p> */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click if button is separate
            onViewDetails(project);
          }}
          className="mt-2 inline-block text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors"
        >
          View Details &rarr;
        </button>
      </div>
    </div>
  );
};

export default PortfolioCard;
