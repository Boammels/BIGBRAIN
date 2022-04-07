import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import alert from '../styles/Alert.module.css';
import PropTypes from 'prop-types';

const Error = ({ code }) => {
  let message = '';
  let link = '/';
  let buttonMsg = '';
  if (code === '403') {
    message = ': Access Forbidden';
    link = '/login';
    buttonMsg = 'Login Now';
  } else if (code === '400') {
    message = ': Invalid Input';
    link = '/dashboard';
    buttonMsg = 'Dashboard';
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

Error.propTypes = {
  code: PropTypes.any,
}

export default Error;
