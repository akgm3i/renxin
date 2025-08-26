import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { dummyPlayer } from '../lib/dummy-data';
import styles from './Game.module.css';

const GamePage: React.FC = () => {
  const navigate = useNavigate();

  // This is all dummy data for now
  const gameType = '501';
  const currentRound = 5;
  const totalRounds = 15;
  const currentScore = 255;
  const lastThrows = [20, 20, 20];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.gameType}>{gameType}</div>
        <div className={styles.round}>Round {currentRound}/{totalRounds}</div>
        <div className={styles.playerName}>{dummyPlayer.name}</div>
      </header>

      <section className={styles.scoreArea}>
        <div className={styles.currentScore}>{currentScore}</div>
        <div className={styles.lastThrows}>
          Last throws: {lastThrows.join(', ')}
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.dartboardPlaceholder}>
          <p>Darts Board UI</p>
        </div>
      </main>

      <footer className={styles.actions}>
        <Button variant="secondary">一投戻す (UNDO)</Button>
        {/* Navigate to playback screen after 3 throws */}
        <Button onClick={() => navigate('/playback')}>ラウンド終了</Button>
      </footer>
    </div>
  );
};

export default GamePage;
