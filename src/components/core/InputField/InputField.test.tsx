import { screen, render } from '@testing-library/react';
import InputField from './InputField';
import '@testing-library/jest-dom';

test('renders label and error', () => {
  render(<InputField label="username" error="required" />);
  expect(screen.getByLabelText('username')).toBeInTheDocument();
  expect(screen.getByText('required')).toBeInTheDocument();
});
