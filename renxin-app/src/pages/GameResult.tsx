import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './GameResult.module.css';

const GameResultPage: React.FC = () => {
  const navigate = useNavigate();

  // Dummy data for the result
  const result = 'WIN';

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.resultText}>YOU {result}</h1>
        {/* Maybe show some summary stats here later */}
      </main>

      <footer className={styles.actions}>
        <Button onClick={() => navigate('/game')}>もう一度プレイ</Button>
        <Button onClick={() => navigate('/')} variant="secondary">
          ホームに戻る
        </Button>
      </footer>
    </div>
  );
};

export default GameResultPage;
