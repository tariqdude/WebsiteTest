import { render, screen, fireEvent } from '@testing-library/react';
import SimpleColorDemo from '../../ui/SimpleColorDemo';

describe('SimpleColorDemo', () => {
  it('renders with default title and color', () => {
    render(<SimpleColorDemo />);
    expect(screen.getByText('Color Picker Demo')).toBeInTheDocument();
    expect(screen.getByText('#3B82F6')).toBeInTheDocument();
  });

  it('changes color when a swatch is clicked', () => {
    render(<SimpleColorDemo />);
    const swatch = screen.getByLabelText('Select color #10B981');
    fireEvent.click(swatch);
    expect(screen.getByText('#10B981')).toBeInTheDocument();
  });

  it('generates a random color', () => {
    render(<SimpleColorDemo />);
    const initialColor = screen.getByText(/#/i).textContent;
    const randomButton = screen.getByText('Random Color');
    fireEvent.click(randomButton);
    const newColor = screen.getByText(/#/i).textContent;
    expect(newColor).not.toBe(initialColor);
    expect(newColor).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
