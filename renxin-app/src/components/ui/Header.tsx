import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  playerName: string;
  rating: number;
}

const Header: React.FC<HeaderProps> = ({ playerName, rating }) => {
  return (
    <header className={styles.header}>
      <div className={styles.playerName}>{playerName}</div>
      <div className={styles.rating}>{rating.toFixed(2)}</div>
      <div className={styles.settings}>
        {/* Settings Icon will go here */}
      </div>
    </header>
  );
};

export default Header;
