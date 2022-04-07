import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
import styles from '../styles/Top.module.css';

function Top () {
  const navigate = useNavigate();
  const logout = async () => {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      },
    });
    if (response.status === 200) {
      localStorage.setItem('token', '');
      navigate('/');
    }
  }
  return (
    <>
      <div className={styles.header}>
        <Link to='/dashboard' style={{ textDecoration: 'none' }}>
          <h1 className={styles.web_name}>BigBrain</h1>
        </Link>
        <button
          className={styles.btn_logout}
          onClick={logout}
        >
          LOGOUT
        </button>
      </div>
    </>
  )
}

export default Top;
