import { render, screen } from '@testing-library/react';
import Input from './Input';

test('renders input with default type', () => {
  render(<Input />);
  const input = screen.getByRole('textbox');
  expect(input).toBeInTheDocument();
});

test('applies disabled state', () => {
  render(<Input disabled />);
  expect(screen.getByRole('textbox')).toBeDisabled();
});
