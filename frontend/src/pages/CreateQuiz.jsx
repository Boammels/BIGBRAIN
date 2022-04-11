import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';
import Top from './TopBar'
import styles from '../styles/Quiz.module.css';

function CreateQuiz () {
  const navigate = useNavigate();
  useEffect(
    () => {
      if (localStorage.token === '') {
        navigate('/error/403')
      }
      console.log(1);
    }
  );
  return (
    <>
      <Top />
      <QuizForm
        success={() => navigate('/dashboard')}
        failed={e => navigate('/error/' + e)}
      />
    </>
  );
}

const QuizForm = ({ success, failed }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const submit = async () => {
    if (name === '') {
      alert('The game title cannot be empty!');
    } else {
      const response = await fetch('http://localhost:5005/admin/quiz/new', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        },
        body: JSON.stringify({
          name,
        })
      })
      if (response.status === 200) {
        success();
      } else {
        failed(response.status);
      }
    }
  }
  console.log(name);
  const line = 'Next >>';
  return (
    <>
      <div className={styles.createPage}>
        <h1 className={styles.pageTitle}>
          Create Your <span className={styles.highlight}>Quiz</span> NOW!
        </h1>
        <input
          type='text'
          onChange = {e => setName(e.target.value)}
          placeholder = {'Quiz Name'}
          className={styles.inputName}
        />
        <div className={styles.buttonArea}>
          <button
            className={styles.cancelBtn}
            onClick={() => navigate('/dashboard')}
          >Cancel</button>
          <button
            className={styles.nextBtn}
            onClick={() => submit()}
          >{line}</button>
        </div>
      </div>
    </>
  )
}

QuizForm.propTypes = {
  success: PropTypes.func,
  failed: PropTypes.func,
}

export default CreateQuiz;
