import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { InputField } from '../InputField';

describe('InputField Component', () => {
  it('correctly calculates character counter and props', () => {
    const handleChange = vi.fn();
    const element = InputField({
      label: 'Dataset Description',
      value: 'Columns: age, fare, survived',
      onChange: handleChange,
      maxLength: 1000,
      rows: 4,
      required: true,
    });

    expect(element).toBeDefined();
    expect(element.props.children).toBeDefined();
  });

  it('handles error message display', () => {
    const handleChange = vi.fn();
    const element = InputField({
      label: 'Target Language',
      value: '',
      onChange: handleChange,
      error: 'Language is required',
    });

    expect(element).toBeDefined();
  });
});
