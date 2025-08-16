import React from 'react';
import Link from 'next/link';

interface Category {
  name: string;
  count: number;
  icon: string;
  color: string;
}

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Explore Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find content that matches your interests across our diverse range of topics
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.name}
              href={`/blog?category=${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-secondary to-muted shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm text-muted-foreground">{category.count} articles</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
