import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
// import PropTypes from 'prop-types';
import Top from './TopBar'
import styles from '../styles/Quiz.module.css';

function User () {
  // let loaded = false;
  const navigate = useNavigate();
  const [success, setSuccess] = useState('loading');
  const load = 1;
  const [quizzes, setQuizzes] = useState([]);

  useEffect(async () => {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      }
    })
    if (response.status === 200) {
      const data = await response.json();
      setQuizzes(data.quizzes);
      setSuccess('done');
      console.log(quizzes)
    } else {
      navigate('/error/403')
    }
  }, [load]);

  return (
    <>
      <Top />
      {success === 'done' &&
        <>
          <div className={styles.quizList}>
            <div className={styles.quizItem}>
              <NavLink to='/quiz/new' style={{ textDecoration: 'none' }}>
                <div className={styles.newGameLink}>
                  <AddCircleOutline color='disabled' style={{ fontSize: 80 }} />
                  <p className={styles.quizCreate}>Create a new game</p>
                </div>
              </NavLink>
            </div>
            {quizzes.map((game) => (
              <div key={game.id} className={styles.quizItem}>
                <NavLink to={'/quiz/' + game.id} style={{ textDecoration: 'none' }}>
                <div className={styles.GameLink}>
                  <h1 className={styles.gameName}>{game.name}</h1>
                  <p className={styles.gameCreated}>created at: {game.createdAt}</p>
                  <img src={game.thumbnail} />
                </div>
                </NavLink>
              </div>
            ))}
          </div>
        </>
      }
    </>
  )
}

export default User;
