import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import HomePage from './pages/Home';
import PlayerManagementPage from './pages/PlayerManagement';
import NewPlayerRegistrationPage from './pages/NewPlayerRegistration';
import GamePage from './pages/Game';
import RoundEndPlaybackPage from './pages/RoundEndPlayback';
import GameResultPage from './pages/GameResult';
import StatisticsPage from './pages/Statistics';
import StartupRedirector from './pages/StartupRedirector';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <StartupRedirector /> },
      { path: '/home', element: <HomePage /> },
      { path: '/players', element: <PlayerManagementPage /> },
      { path: '/players/new', element: <NewPlayerRegistrationPage /> },
      { path: '/game', element: <GamePage /> },
      { path: '/playback', element: <RoundEndPlaybackPage /> },
      { path: '/result', element: <GameResultPage /> },
      { path: '/stats', element: <StatisticsPage /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
