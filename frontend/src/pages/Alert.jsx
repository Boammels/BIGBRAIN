import React from 'react';
import { Link, useParams } from 'react-router-dom';
// import PropTypes from 'prop-types';
import alert from '../styles/Alert.module.css';

const Error = () => {
  const code = useParams().errorId;
  let message = '';
  let link = '/dashboard';
  let buttonMsg = 'Dashboard';
  if (code === '403') {
    message = ': Access Forbidden';
    if (localStorage.token === '') {
      link = '/login';
      buttonMsg = 'Login Now';
    }
  } else if (code === '400') {
    message = ': Invalid Input';
  } else if (code === '404') {
    message = ': Not found';
  }
  return (
    <>
      <p className={alert.alert}>
        <span className={alert.number}>{code}</span>
        <span className={alert.message}>{message}</span>
      </p>
      <Link to={link} style={{ textDecoration: 'none' }}>
        <button className = {alert.btn}>{buttonMsg}</button>
      </Link>
    </>
  );
}

export default Error;
