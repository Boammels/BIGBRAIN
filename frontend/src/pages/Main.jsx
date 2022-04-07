import React from 'react';
import {
  Link
} from 'react-router-dom';
import styles from '../styles/Main.module.css';
import logo from '../logo.svg';

function Main () {
  const str = "Let's go!";
  return (
    <>
      <header className={styles.header}>
        <img src={logo} className={styles.logo}></img>
        <h1>Welcome to <a className={styles.name}>BigBrain</a>!</h1>
        <div className={styles.join_area}>
          <input type="text" className={styles.join_input} placeholder='Game Pin'/>
          <button className={styles.join}>{str}</button>
        </div>
        <div>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className={styles.login}>LOGIN</button>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button className={styles.signup}>SIGN UP</button>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Main;
