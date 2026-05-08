import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { dummyPlayer } from '../lib/dummy-data';
import styles from './PlayerManagement.module.css';

const PlayerManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/home')} className={styles.backButton}>
          &lt; Home
        </button>
        <h1 className={styles.title}>プレイヤー管理</h1>
      </header>
      <main className={styles.mainContent}>
        <ul className={styles.playerList}>
          {/* In a real app, we would map over a list of players */}
          <li className={styles.playerItem} onClick={() => navigate('/home')}>
            <span>{dummyPlayer.name}</span>
            <span>{dummyPlayer.rating.toFixed(2)}</span>
          </li>
        </ul>
        <div className={styles.actions}>
          <Button onClick={() => navigate('/players/new')}>
            新規プレイヤー登録
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PlayerManagementPage;
