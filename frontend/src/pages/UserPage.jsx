import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Add from '@material-ui/icons/AddCircleOutline';
import Delete from '@material-ui/icons/DeleteOutlined';
import Edit from '@material-ui/icons/EditOutlined';
import Start from '@material-ui/icons/PlayArrow';
// import PropTypes from 'prop-types';
// import PropTypes from 'prop-types';
import Top from './TopBar';
import styles from '../styles/Quiz.module.css';

function User () {
  // let loaded = false;
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
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
      console.log(data.quizzes);
      setQuizzes(data.quizzes);
      setSuccess(true);
    } else {
      navigate('/error/403')
    }
  }, [load]);

  const fetchGame = async (quizId) => {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      }
    })
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      const r = confirm('The seesion ID is: ' + data.active + ', press OK to copy the session ID and share with your friends!');
      if (r) {
        navigator.clipboard.writeText(data.active.toString());
        navigate('/quiz/' + quizId + '/session/' + data.active);
      } else {
        navigate('/quiz/' + quizId + '/session/' + data.active);
      }
    } else {
      navigate('/error/403')
    }
  }

  return (
    <>
      <Top />
      {success &&
        <>
          <div className={styles.quizList}>
            <div className={styles.quizItem}>
              <Link to='/quiz/new' style={{ textDecoration: 'none' }}>
                <div className={styles.newGameLink}>
                  <Add style={{ fontSize: 80 }} />
                  <p className={styles.quizCreate}>Create a new game</p>
                </div>
              </Link>
            </div>
            {quizzes.map((game) => (
              <div key={game.id} className={styles.quizItem}>
                <div className={styles.buttonAreaDashboard}>
                  <button
                    className={styles.deleteBtn}
                    onClick={
                      async () => {
                        const r = confirm('Are you sure to delete this Game?');
                        if (r === false) {
                          return;
                        }
                        const response = await fetch('http://localhost:5005/admin/quiz/' + game.id, {
                          method: 'DELETE',
                          headers: {
                            'Content-type': 'application/json',
                            Authorization: 'Bearer ' + localStorage.token,
                          }
                        })
                        const data = await response.json();
                        if (response.status === 200) {
                          window.location.reload();
                        } else {
                          alert(response.status + ': ' + data.error);
                        }
                      }
                    }
                  ><Delete></Delete></button>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      navigate('/quiz/' + game.id)
                    }}
                  ><Edit></Edit></button>
                  <button
                    className={styles.startBtn}
                    onClick={
                      async () => {
                        if (game.active === null) {
                          const r = confirm('Start the game now?');
                          if (r === false) {
                            return;
                          }
                          const response = await fetch('http://localhost:5005/admin/quiz/' + game.id + '/start', {
                            method: 'POST',
                            headers: {
                              'Content-type': 'application/json',
                              Authorization: 'Bearer ' + localStorage.token,
                            }
                          })
                          const data = await response.json();
                          if (response.status === 200) {
                            fetchGame(game.id);
                          } else {
                            alert(response.status + ': ' + data.error);
                          }
                        } else {
                          navigate('/quiz/' + game.id + '/session/' + game.active);
                        }
                      }
                    }
                  ><Start></Start></button>
                </div>
                <Link to={'/quiz/' + game.id} style={{ textDecoration: 'none' }}>
                <div className={styles.GameLink}>
                  <p className={styles.gameCreated}>created on {game.createdAt.slice(0, 10)}</p>
                  <h1 className={styles.gameName}>{game.name}</h1>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      }
    </>
  )
}

export default User;
