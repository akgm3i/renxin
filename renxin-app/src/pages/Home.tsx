import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import { dummyPlayer } from '../lib/dummy-data';
import styles from './Home.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Header playerName={dummyPlayer.name} rating={dummyPlayer.rating} />
      <div className={styles.menu}>
        <Button onClick={() => navigate('/game')}>01 GAME</Button>
        <Button onClick={() => navigate('/game')}>CRICKET</Button>
        <Button onClick={() => navigate('/stats')}>成績を見る</Button>
        <Button onClick={() => navigate('/players')}>プレイヤー管理</Button>
      </div>
    </div>
  );
};

export default HomePage;
