/**
 * @module CategoryCard
 * @description Samsung-style help category card
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  articles: number;
}

interface CategoryCardProps {
  category: HelpCategory;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-black transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Icon - Samsung style: black background */}
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 text-base group-hover:text-black">
            {category.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{category.description}</p>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <span>{category.articles} artículos</span>
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default CategoryCard;
