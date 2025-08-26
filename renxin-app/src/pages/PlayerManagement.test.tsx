import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlayerManagementPage from './PlayerManagement';

const TargetPage = ({ text }: { text: string }) => <div>{text}</div>;

const TestComponent = () => (
  <MemoryRouter initialEntries={['/players']}>
    <Routes>
      <Route path="/players" element={<PlayerManagementPage />} />
      <Route path="/home" element={<TargetPage text="Home Page" />} />
      <Route path="/players/new" element={<TargetPage text="New Player Page" />} />
    </Routes>
  </MemoryRouter>
);

test('navigates to home page when back button is clicked', async () => {
  const screen = await render(<TestComponent />);
  const backButton = screen.getByRole('button', { name: /home/i });
  await userEvent.click(backButton);
  expect(screen.getByText('Home Page')).toBeInTheDocument();
});

test('navigates to home page when a player is clicked', async () => {
  const screen = await render(<TestComponent />);
  // Using text selector because it's a <li> element
  const playerItem = screen.getByText(/jules/i);
  await userEvent.click(playerItem);
  expect(screen.getByText('Home Page')).toBeInTheDocument();
});

test('navigates to new player page when register button is clicked', async () => {
  const screen = await render(<TestComponent />);
  const registerButton = screen.getByRole('button', { name: /新規プレイヤー登録/i });
  await userEvent.click(registerButton);
  expect(screen.getByText('New Player Page')).toBeInTheDocument();
});
