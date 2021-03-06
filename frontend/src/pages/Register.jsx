import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../styles/Login.module.css';

function Register () {
  const navigate = useNavigate();
  return (
    <>
      <header className={styles.header}>
      <h1 className={styles.welcome}>Join <span className={styles.name}>BigBrain</span> now!</h1>
        <RegisterForm success={() => navigate('/dashboard')} />
      </header>
    </>
  )
}

function RegisterForm ({ success }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const register = async () => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (!re.test(email)) {
      alert('Invalid Email Address');
      return;
    } else if (password.length < 6) {
      alert('The password must be at least 6 characters');
      return;
    } else if (name === '') {
      alert('Name cannot be empty');
    }
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      })
    });
    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem('token', data.token);
      success();
    } else {
      const alertstr = 'Status ' + response.status + ': ' + data.error;
      alert(alertstr);
    }
  }
  return (
    <>
      <input
        type = "text"
        placeholder = "Name"
        className = {styles.inputarea}
        onChange = {e => setName(e.target.value)}
      />
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
        <button className={styles.btn} onClick={register}>Register</button>
        <Link to = '/' style={{ textDecoration: 'none' }}>
          <button className={styles.btn}>Cancel</button>
        </Link>
      </div>
    </>
  );
}

RegisterForm.propTypes = {
  success: PropTypes.func,
}

export default Register;
