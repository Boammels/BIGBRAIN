import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import styles from '../styles/Top.module.css';

function Top () {
  /* const logout = () => {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
  } */
  return (
    <>
      <div className={styles.header}>
        <Link to='/dashboard' style={{ textDecoration: 'none' }}>
          <h1 className={styles.web_name}>BigBrain</h1>
        </Link>
        <button className={styles.btn_logout}>LOGOUT</button>
      </div>
    </>
  )
}

export default Top;
