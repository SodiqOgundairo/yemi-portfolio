import React from 'react';
import type { Project } from '../../data/portfolioData';
import { FaPlus } from 'react-icons/fa';

interface PortfolioCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onViewDetails }) => {
  return (
    <div
      className="group bg-dark-card rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onViewDetails(project)}
    >
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
          <FaPlus className="text-white text-4xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted-text mb-1 capitalize">
          {project.category.join(', ')}
        </p>
        <h3 className="text-xl font-bold text-light-text truncate">
          {project.title}
        </h3>
      </div>
    </div>
  );
};

export default PortfolioCard;
