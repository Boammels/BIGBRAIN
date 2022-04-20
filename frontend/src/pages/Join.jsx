import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Main.module.css';

function Join () {
  const navigate = useNavigate();
  const [name, setName] = useState('Player');
  const [sessionId, setSession] = useState('');

  const join = async () => {
    const response = await fetch('http://localhost:5005/play/join/' + sessionId, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name
      })
    });
    if (response.status === 200) {
      navigate('/play/' + sessionId);
    } else {
      const data = await response.json();
      alert(response.status + ': ' + data.error);
    }
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.welcome}>Enter the session id and your name!</h1>
        <input
          type='text'
          className={styles.joinInput}
          placeholder='Please enter the session id for the game.'
          onChange={e => setSession(e.target.value)}
        />
        <input
          type='text'
          className={styles.joinInput}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          className={styles.join}
          onClick={() => join()}
        >Join Now!</button>
      </header>
    </>
  )
}
export default Join;
