import React from 'react';
import { Section, Container, Text, Card, CardHeader, CardContent } from '@/components/ui';

interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: 1 | 2 | 3 | 4;
  background?: 'default' | 'muted' | 'primary' | 'secondary';
}

export function Features({
  title,
  subtitle,
  features,
  columns = 3,
  background = 'default'
}: FeaturesProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <Section background={background} padding="xl">
      <Container size="lg">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <Text
                variant="h2"
                size="4xl"
                weight="bold"
                className="mb-4"
              >
                {title}
              </Text>
            )}
            
            {subtitle && (
              <Text
                variant="p"
                size="xl"
                color="muted"
                className="max-w-2xl mx-auto"
              >
                {subtitle}
              </Text>
            )}
          </div>
        )}
        
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                {feature.icon && (
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-primary text-3xl">
                    {feature.icon}
                  </div>
                )}
                
                <Text
                  variant="h3"
                  size="xl"
                  weight="semibold"
                  className="mb-2"
                >
                  {feature.title}
                </Text>
              </CardHeader>
              
              <CardContent>
                <Text
                  variant="p"
                  color="muted"
                  className="leading-relaxed"
                >
                  {feature.description}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
