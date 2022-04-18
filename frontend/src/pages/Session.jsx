import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Top from './TopBar'
import styles from '../styles/Session.module.css';

function Session () {
  const quizId = useParams().quizId;
  const sessionId = useParams().sessionId;
  const [status, setStatus] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [load, setLoad] = useState(0);

  useEffect(
    () => {
      if (localStorage.token === '') {
        navigate('/error/403');
      }
    }
  );

  const timeCheck = (status, startTime) => {
    console.log(startTime);
    if (!status.active) {
      console.log('the quiz is finished!');
    } else if (startTime !== '') {
      if (status.answerAvailable) {
        console.log('done');
      } else {
        setLoad(load + 1);
      }
    } else {
      setLoad(load + 1);
    }
  }

  useEffect(
    async () => {
      const response = await fetch('http://localhost:5005/admin/session/' + sessionId + '/status', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        }
      })
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setStatus(data.results);
        const status = data.results;
        // const timelimit = position > -1 ? data.results.questions[position].timelimit : 0;
        const startTime = data.results.isoTimeLastQuestionStarted;
        // const available = data.results.answerAvailable
        setSuccess(true);
        setTimeout(
          () => {
            timeCheck(status, startTime);
          }, 1000
        );
      }
    }, [load]
  );

  const advanceGame = async () => {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizId + '/advance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      }
    })
    if (response.status === 200) {
      setSuccess(false);
      setLoad(load + 1);
    }
  }

  const stopGame = async () => {
    const r = confirm('Are you sure to end the game?');
    if (r === false) {
      return;
    }
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizId + '/end', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      }
    })
    if (response.status === 200) {
      navigate('/result/' + quizId + '/' + sessionId);
    } else {
      const data = await response.json();
      alert(response.status + ': ' + data.error);
      navigate('/dashboard');
    }
  }

  return (
    <>
      <Top />
      <div className={styles.page}>
          {success &&
            <>
              {status.position === -1 &&
                <>
                  <h1 className={styles.pageTitle}>The quiz will start soon!</h1>
                  <p className={styles.smallFont}>{status.players.length} player(s) has joined the quiz</p>
                  <button
                    className={styles.start}
                    onClick={() => advanceGame()}
                  >Start!</button>
                  <button
                    className={styles.cancel}
                    onClick={() => stopGame()}
                  >Abort this session</button>
                </>
              }
              {!status.answerAvailable && status.position > -1 && status.position < status.questions.length &&
                <>
                  <h1 className={styles.pageTitle}>{status.questions[status.position].question}</h1>
                  {status.questions[status.position].answers.map((ans, index) => (
                    <p key={index} className={ans.type ? styles.answerCorrect : styles.answerWrong}>{ans.content}</p>
                  ))}
                  <p className={styles.smallFont}>The players are answering the questions...</p>
                </>
              }
              {status.answerAvailable && status.position > -1 && status.position < status.questions.length &&
                <>
                  <h1 className={styles.pageTitle}>To the Next Question?</h1>
                  <div className={styles.buttonArea}>
                    <button
                      className={styles.start}
                      onClick={() => advanceGame()}
                    >Advance</button>
                    <button
                      className={styles.cancel}
                      onClick={() => stopGame()}
                    >End</button>
                  </div>
                </>
              }
              {status.position === status.questions.length &&
                <>
                  <h1 className={styles.pageTitle}>Check the results now!</h1>
                  <p className={styles.smallFont}>The result for the game is ready!</p>
                  <button
                    className={styles.start}
                    onClick={() => navigate('/result/' + quizId + '/' + sessionId)}
                  >Results</button>
                </>
              }
            </>
          }
      </div>
    </>
  );
}

export default Session;
