import React from 'react';

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryName: string) => void;
}

export function CategoryFilter({ categories, activeCategory = 'All', onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 py-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryChange?.(category.name)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                category.name === activeCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {category.name}
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
