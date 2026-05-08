import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Home';

// A simple component to render on the target route for verification
const TargetPage = ({ text }: { text: string }) => <div>{text}</div>;

const TestComponent = () => (
  <MemoryRouter initialEntries={['/home']}>
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={<TargetPage text="Game Page" />} />
      <Route path="/stats" element={<TargetPage text="Statistics Page" />} />
      <Route path="/players" element={<TargetPage text="Player Management Page" />} />
    </Routes>
  </MemoryRouter>
);

test.each([
  { buttonName: /01 game/i, expectedText: 'Game Page' },
  { buttonName: /cricket/i, expectedText: 'Game Page' },
  { buttonName: /成績を見る/i, expectedText: 'Statistics Page' },
  { buttonName: /プレイヤー管理/i, expectedText: 'Player Management Page' },
])('navigates to $expectedText when "$buttonName" button is clicked', async ({ buttonName, expectedText }) => {
  const screen = await render(<TestComponent />);

  const button = screen.getByRole('button', { name: buttonName });
  await userEvent.click(button);

  expect(screen.getByText(expectedText)).toBeInTheDocument();
});
