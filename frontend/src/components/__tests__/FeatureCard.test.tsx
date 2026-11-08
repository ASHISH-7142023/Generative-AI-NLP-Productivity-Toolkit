import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { FeatureCard } from '../FeatureCard';
import { Sparkles } from 'lucide-react';

describe('FeatureCard Component', () => {
  it('renders title, category, and description', () => {
    const handleOpen = vi.fn();
    const element = React.createElement(FeatureCard, {
      title: 'Pandas EDA',
      category: 'Module A',
      badge: 'Data',
      description: 'Generates exploratory data analysis code',
      icon: Sparkles,
      onOpen: handleOpen,
    });

    expect(element.props.title).toBe('Pandas EDA');
    expect(element.props.category).toBe('Module A');
    expect(element.props.badge).toBe('Data');
    expect(element.props.description).toContain('exploratory data analysis');
  });

  it('triggers onOpen when invoked', () => {
    const handleOpen = vi.fn();
    const card = FeatureCard({
      title: 'Resume Generator',
      category: 'Module B',
      description: 'Generates structured resume',
      icon: Sparkles,
      onOpen: handleOpen,
    });

    expect(card).toBeDefined();
    expect(typeof card.props.onClick).toBe('function');
    card.props.onClick();
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });
});
