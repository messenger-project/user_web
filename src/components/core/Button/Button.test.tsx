import Button from './Button';
import { render, screen } from '@testing-library/react';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByTestId('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Click Me');
  });
});
