import { render } from 'vitest-browser-react';
import { expect, test, vi, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StartupRedirector from './StartupRedirector';

const TargetPage = ({ text }: { text: string }) => <div>{text}</div>;

// We need to clear mocks before each test
beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('redirects to new player page on first launch', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<StartupRedirector />} />
        <Route path="/players/new" element={<TargetPage text="New Player Page" />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('New Player Page')).toBeInTheDocument();
});

test('redirects to home page on subsequent launches', async () => {
  // Mock localStorage to simulate a returning user
  localStorage.setItem('renxin-player-exists', 'true');

  const screen = await render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<StartupRedirector />} />
        <Route path="/home" element={<TargetPage text="Home Page" />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Home Page')).toBeInTheDocument();
});
