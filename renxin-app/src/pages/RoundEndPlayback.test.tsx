import { render } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RoundEndPlaybackPage from './RoundEndPlayback';

const TargetPage = ({ text }: { text: string }) => <div>{text}</div>;

const TestComponent = () => (
  <MemoryRouter initialEntries={['/playback']}>
    <Routes>
      <Route path="/playback" element={<RoundEndPlaybackPage />} />
      <Route path="/game" element={<TargetPage text="Game Page" />} />
      <Route path="/home" element={<TargetPage text="Home Page" />} />
    </Routes>
  </MemoryRouter>
);

test.each([
  { buttonName: /次のラウンドへ/i, expectedText: 'Game Page' },
  { buttonName: /ゲームを中断する/i, expectedText: 'Home Page' },
])('navigates to $expectedText when "$buttonName" button is clicked', async ({ buttonName, expectedText }) => {
  const screen = await render(<TestComponent />);

  const button = screen.getByRole('button', { name: buttonName });
  await userEvent.click(button);

  expect(screen.getByText(expectedText)).toBeInTheDocument();
});
