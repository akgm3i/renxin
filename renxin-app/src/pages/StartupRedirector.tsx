import React from 'react';
import { Navigate } from 'react-router-dom';

const StartupRedirector: React.FC = () => {
  // Dummy check for first-time launch.
  // In a real app, this would check a persistent store.
  const isFirstLaunch = !localStorage.getItem('renxin-player-exists');

  if (isFirstLaunch) {
    // On first launch, go to player registration.
    return <Navigate to="/players/new" replace />;
  }

  // On subsequent launches, go to the home screen.
  return <Navigate to="/home" replace />;
};

export default StartupRedirector;
