import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Main.module.css';
import logo from '../logo.svg';

function Main () {
  const navigate = useNavigate();
  const str = "Let's go!";
  localStorage.setItem('token', '');
  return (
    <>
      <header className={styles.header}>
        <img src={logo} className={styles.logo}></img>
        <h1 className={styles.welcome}>Welcome to <span className={styles.name}>BigBrain</span>!</h1>
        <button
          className={styles.join}
          onClick={() => navigate('/join')}
        >{str}</button>
        <div>
          <button
            className={styles.login}
            onClick={() => navigate('/login')}
          >LOGIN</button>
          <button
            className={styles.signup}
            onClick={() => navigate('/register')}
          >SIGN UP</button>
        </div>
      </header>
    </>
  );
}

export default Main;
