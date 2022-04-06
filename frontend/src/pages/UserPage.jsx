import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Top from './TopBar'
// import styles from '../styles/User.module.css';

function User () {
  console.log(localStorage.getItem('token'));
  return (
    <>
      <Top />
      <div>success</div>
    </>
  )
}

export default User;
