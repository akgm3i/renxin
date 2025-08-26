import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyPlayer, dummyGameHistory } from '../lib/dummy-data';
import styles from './Statistics.module.css';

const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/home')} className={styles.backButton}>
          &lt; Home
        </button>
        <h1 className={styles.title}>成績詳細</h1>
        <div className={styles.playerName}>{dummyPlayer.name}</div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.filters}>
          {/* These are just placeholders for now */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.active}`}>総合</button>
            <button className={styles.tab}>01 GAME</button>
            <button className={styles.tab}>CRICKET</button>
          </div>
          <div className={styles.periodFilters}>
            {/* Placeholder buttons */}
          </div>
        </div>

        <div className={styles.graphPlaceholder}>
          <p>Graph of Rating Trends</p>
        </div>

        <ul className={styles.historyList}>
          {dummyGameHistory.map((game) => (
            <li key={game.id} className={styles.historyItem}>
              <div className={styles.gameInfo}>
                <span>{game.date}</span>
                <span>{game.gameType}</span>
              </div>
              <div className={`${styles.result} ${styles[game.result.toLowerCase()]}`}>
                {game.result}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default StatisticsPage;
