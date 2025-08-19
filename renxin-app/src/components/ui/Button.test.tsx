import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { expect, test, vi } from 'vitest';
import React from 'react';

import Button from './Button.tsx';

test('should render children correctly', async () => {
  const screen = await render(<Button>Click Me</Button>);
  const button = screen.getByRole('button', { name: /click me/i });
  await expect(button).toBeInTheDocument();
});

test('should call onClick handler when clicked', async () => {
  const handleClick = vi.fn();
  const screen = await render(<Button onClick={handleClick}>Click Me</Button>);
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
