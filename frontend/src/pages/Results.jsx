import React from 'react';
import { useParams } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import styles from '../styles/Login.module.css';
import Top from './TopBar'

function Result () {
  const sessionId = useParams().sessionId;
  return (
    <>
      <Top />
      <p>{sessionId}</p>
    </>
  )
}

export default Result;
