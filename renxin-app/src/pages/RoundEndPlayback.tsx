import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './RoundEndPlayback.module.css';

const RoundEndPlaybackPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>プレイバック</h1>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.videoPlayerPlaceholder}>
          <p>Posture Camera</p>
        </div>
        <div className={styles.videoPlayerPlaceholder}>
          <p>Board Camera</p>
        </div>
      </main>

      <footer className={styles.actions}>
        <Button onClick={() => navigate('/game')}>次のラウンドへ</Button>
        <Button onClick={() => navigate('/home')} variant="secondary">
          ゲームを中断する
        </Button>
      </footer>
    </div>
  );
};

export default RoundEndPlaybackPage;
