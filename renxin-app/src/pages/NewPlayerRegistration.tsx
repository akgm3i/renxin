import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './NewPlayerRegistration.module.css';

const NewPlayerRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // In a real app, we would save the new player here.
      console.log('Registering new player:', name);
      navigate('/players');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/players')} className={styles.backButton}>
          &lt; Back
        </button>
        <h1 className={styles.title}>新規プレイヤー登録</h1>
      </header>
      <main className={styles.mainContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="playerName">Player Name</label>
            <Input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name"
              required
            />
          </div>
          <Button type="submit">登録する</Button>
        </form>
      </main>
    </div>
  );
};

export default NewPlayerRegistrationPage;
