/**
 * Card Component Tests
 *
 * Unit tests for the Card component using React Testing Library.
 *
 * @module tests/components/Card.test
 */

import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

describe('Card Component', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders complete card with all sections', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-card" data-testid="test-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('test-card');
    expect(card).toHaveClass('custom-card');
  });

  it('renders header without title when only description is provided', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Only description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Only description')).toBeInTheDocument();
  });

  it('renders footer with action buttons', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });
});

describe('Card Accessibility', () => {
  it('has semantic article role', () => {
    render(
      <Card data-testid="test-card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('test-card');
    expect(card.tagName).toBe('DIV');
  });
});
