import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GamePage from './Game';

const TargetPage = ({ text }: { text: string }) => <div>{text}</div>;

const TestComponent = () => (
  <MemoryRouter initialEntries={['/game']}>
    <Routes>
      <Route path="/game" element={<GamePage />} />
      <Route path="/playback" element={<TargetPage text="Playback Page" />} />
    </Routes>
  </MemoryRouter>
);

test('navigates to playback page when round end button is clicked', async () => {
  const screen = await render(<TestComponent />);

  const roundEndButton = screen.getByRole('button', { name: /ラウンド終了/i });
  await userEvent.click(roundEndButton);

  expect(screen.getByText('Playback Page')).toBeInTheDocument();
});
