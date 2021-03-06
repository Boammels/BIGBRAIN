import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Top from './TopBar';
import styles from '../styles/Questions.module.css';
import Delete from '@material-ui/icons/DeleteOutlined';
import Edit from '@material-ui/icons/EditOutlined';
import DoneOutline from '@material-ui/icons/DoneOutline';
import Start from '@material-ui/icons/PlayArrow';

function Quiz () {
  const [questions, setQuestions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [name, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const quizId = useParams().quizId;
  const load = 1;

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

  // initilise the page
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
        setThumbnail(data.thumbnail);
        setActive(data.active)
        setSuccess(true);
      } else {
        navigate('/error/403')
      }
    }
  }, [load]);

  const updateQuiz = async () => {
    if (name === '') {
      alert('The name of the quiz cannot be empty');
      window.location.reload();
      return;
    }
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      },
      body: JSON.stringify({
        questions,
        name,
        thumbnail,
      })
    });
    const data = await response.json();
    if (response.status === 200) {
      window.location.reload();
    } else {
      alert(response.status + ': ' + data.error);
    }
  }

  // remove a question from the quiz
  const removeQuestion = (qid) => {
    const r = confirm('Are you sure to delete this question?');
    if (r === false) {
      return;
    }
    // console.log(qid);
    setQuestions(questions.splice(qid, 1));
    setSuccess(false);
    updateQuiz();
  }

  // add a question to the quiz with default text
  const addQuestion = () => {
    const newQuestion = {
      type: 'multiple',
      question: 'Title of the question1',
      timelimit: 5,
      mark: 5,
      answers: [
        {
          content: 'answer 01',
          type: true,
        },
        {
          content: 'answer 02',
          type: false,
        },
      ],
      url: '',
      urltype: 'none',
    }
    setQuestions(questions.concat(newQuestion));
  }

  // deleting a whole game
  const deleteGame = async () => {
    const r = confirm('Are you sure to delete this Game?');
    if (r === false) {
      return;
    }
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      }
    })
    const data = await response.json();
    if (response.status === 200) {
      navigate('/dashboard');
    } else {
      alert(response.status + ': ' + data.error);
    }
  }

  const startSession = async () => {
    if (active === null) {
      const r = confirm('Start the game now?');
      if (r === false) {
        return;
      }
      const response = await fetch('http://localhost:5005/admin/quiz/' + quizId + '/start', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        }
      })
      const data = await response.json();
      if (response.status === 200) {
        fetchGame(quizId);
      } else {
        alert(response.status + ': ' + data.error);
      }
    } else {
      navigate('/quiz/' + quizId + '/session/' + active);
    }
  }

  return (
    <>
      <Top/>
      {success &&
        <>
          <div className={styles.questionList}>
            <div className={styles.titleArea}>
              <input
                type='text'
                className={styles.title}
                value={name}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.buttonArea}>
              <button
                className={styles.deleteGame}
                onClick={() => deleteGame()}
              ><Delete></Delete></button>
              <button
                className={styles.confirmNameGame}
                onClick={() => startSession()}
              ><Start></Start></button>
              <button
                className={styles.confirmNameGame}
                onClick={() => updateQuiz()}
              ><DoneOutline></DoneOutline></button>
            </div>
            <div className={styles.thumbnailArea}>
              <input
                type='text'
                className={styles.thumbnailInput}
                placeholder='Enter the url for the thumbnail of the quiz'
                value={thumbnail === null ? '' : thumbnail}
                onChange={e => setThumbnail(e.target.value)}
              />
              {thumbnail !== null && thumbnail !== '' &&
                <img className={styles.thumbnail} src={thumbnail}/>
              }
            </div>
            {questions.map((question) => {
              return (
                <div key={questions.indexOf(question).toString()} className={styles.questionItem}>
                  <div className={styles.questionItemBtns}>
                    <button
                      className={styles.questionDelete}
                      onClick={() => removeQuestion(questions.indexOf(question))}
                    ><Delete></Delete></button>
                    <button
                      className={styles.questionEdit}
                      onClick={() => {
                        updateQuiz();
                        navigate(questions.indexOf(question).toString());
                      }}
                    ><Edit></Edit></button>
                  </div>
                  <div className={styles.questionContent}>
                    <p className={styles.question}>{question.question} </p>
                    <p className={styles.questionMark}>worths {question.mark} marks</p>
                    {question.answers.map((ans, index) => (
                      <p
                        key={index.toString()}
                        className={ans.type ? styles.answerCorrect : styles.answerWrong}
                      >- {ans.content};</p>
                    ))}
                  </div>
                </div>
              );
            })}
            <button
              className={styles.newQuestion}
              onClick={() => addQuestion()}
            >Add a New Question</button>
          </div>
        </>
      }
    </>
  );
}

export default Quiz;
