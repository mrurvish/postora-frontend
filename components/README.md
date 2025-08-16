# UI Components

This directory contains reusable UI components built with React and Tailwind CSS.

## Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="outline" size="lg">Large Outline Button</Button>

// With loading state
<Button isLoading>Loading...</Button>

// As a link (asChild prop)
<Button asChild variant="secondary">
  <Link href="/about">About</Link>
</Button>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `isLoading`: boolean
- `asChild`: boolean (renders as child element)
- All standard button HTML attributes

### Text
A flexible text component for consistent typography.

```tsx
import { Text } from '@/components/ui';

// Basic usage
<Text>Regular paragraph text</Text>

// As different elements
<Text variant="h1" size="5xl" weight="bold">Large Heading</Text>

// With colors and alignment
<Text color="primary" align="center">Centered primary text</Text>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
- `weight`: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
- `color`: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'destructive'
- `align`: 'left' | 'center' | 'right' | 'justify'

### Card
A card component for organizing content.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input
A form input component with support for labels, errors, and icons.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  helperText="We'll never share your email"
  error="Please enter a valid email"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- All standard input HTML attributes

### Container
A container component for consistent page layouts.

```tsx
import { Container } from '@/components/ui';

<Container size="lg">
  <p>Content with large max-width</p>
</Container>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `as`: HTML element type

### Section
A section component for organizing page content.

```tsx
import { Section } from '@/components/ui';

<Section background="muted" padding="xl">
  <h2>Section Title</h2>
  <p>Section content...</p>
</Section>
```

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `background`: 'default' | 'muted' | 'primary' | 'secondary'
- `container`: boolean (whether to wrap in container)
- `containerSize`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `as`: HTML element type

## Section Components

### Hero
A hero section component for landing pages.

```tsx
import { Hero } from '@/components/sections';

<Hero
  title="Welcome to Our Platform"
  subtitle="Get started today"
  description="Join thousands of users..."
  primaryAction={{
    label: "Get Started",
    href: "/register"
  }}
  secondaryAction={{
    label: "Learn More",
    href: "/about"
  }}
/>
```

### Features
A features section component for showcasing product features.

```tsx
import { Features } from '@/components/sections';

<Features
  title="Why Choose Us?"
  subtitle="Everything you need to succeed"
  features={[
    {
      icon: "🚀",
      title: "Fast Performance",
      description: "Lightning-fast loading times"
    }
  ]}
  columns={3}
/>
```

## Usage Examples

### Complete Page Structure
```tsx
import { Section, Container, Text, Button } from '@/components/ui';

export default function Page() {
  return (
    <main>
      <Section background="primary" padding="xl">
        <Container size="lg">
          <Text variant="h1" size="5xl" weight="bold" align="center">
            Welcome
          </Text>
          <Button size="lg">Get Started</Button>
        </Container>
      </Section>
    </main>
  );
}
```

### Form with Validation
```tsx
import { Input, Button, Card, CardContent } from '@/components/ui';

export default function Form() {
  return (
    <Card>
      <CardContent>
        <Input
          label="Email"
          type="email"
          error="Please enter a valid email"
        />
        <Button type="submit">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Styling

All components use Tailwind CSS classes and support:
- Dark/light theme switching
- Responsive design
- Custom className overrides
- Consistent spacing and typography
- Accessibility features (focus states, ARIA labels)

## Accessibility

Components include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Semantic HTML structure
