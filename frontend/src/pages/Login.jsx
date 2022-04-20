import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../styles/Login.module.css';

function Login () {
  const navigate = useNavigate();
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.welcome}>Welcome to <span className={styles.name}>BigBrain</span>!</h1>
        <LoginForm success={() => navigate('/dashboard')} />
      </header>
    </>
  )
}

function LoginForm ({ success }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = async () => {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
    const data = await response.json();
    if (response.status === 200) {
      window.location.reload();
      localStorage.setItem('token', data.token);
      success();
    } else {
      window.location.reload();
      const alertstr = 'Status ' + response.status + ': ' + data.error;
      alert(alertstr);
    }
  }
  return (
    <>
      <input
        type = "text"
        placeholder = "E-mail Address"
        className = {styles.inputarea}
        onChange = {e => setEmail(e.target.value)}
      />
      <input
        type = "password"
        placeholder = "Password"
        className = {styles.inputarea}
        onChange = {e => setPassword(e.target.value)}
      />
      <div>
        <button className={styles.btn} onClick={login}>Login</button>
        <Link to = '/' style={{ textDecoration: 'none' }}>
          <button className={styles.btn}>Cancel</button>
        </Link>
      </div>
    </>
  );
}

LoginForm.propTypes = {
  success: PropTypes.func,
}

export default Login;
