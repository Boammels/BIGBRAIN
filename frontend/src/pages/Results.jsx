import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
import styles from '../styles/Results.module.css';
import Top from './TopBar'

function Result () {
  const quizId = useParams().quizId;
  const sessionId = useParams().sessionId;
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const load = 1;

  useEffect(async () => {
    if (localStorage.token === '') {
      navigate('/error/403')
    } else {
      const response = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        }
      })
      if (response.status === 200) {
        const data = await response.json();
        setTitle(data.name);
        setQuestions(data.questions);
      } else {
        navigate('/error/403')
      }
    }
  }, [load]);

  useEffect(async () => {
    if (localStorage.token === '') {
      navigate('/error/403')
    } else {
      const response = await fetch('http://localhost:5005/admin/session/' + sessionId + '/results', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        }
      })
      if (response.status === 200) {
        const data = await response.json();
        setResults(data);
      } else {
        navigate('/error/403')
      }
    }
  }, [load]);

  console.log(questions);
  console.log(results);

  return (
    <>
      <Top />
      <div className={styles.resultArea}>
        <h1>{title}</h1>
        <p>{sessionId}</p>
      </div>
    </>
  )
}

export default Result;
