import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Top from './TopBar';
import styles from '../styles/Questions.module.css';
import Delete from '@material-ui/icons/DeleteOutlined';
import Edit from '@material-ui/icons/EditOutlined';

function Quiz () {
  const [questions, setQuestions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [name, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();
  const quizId = useParams().quizId;
  const load = 1;

  // initilise the page
  useEffect(
    async () => {
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
          console.log(data.questions)
          setSuccess(true);
        } else {
          navigate('/error/403')
        }
      }
    }, [load]
  );

  const updateQuiz = async () => {
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
    console.log(qid);
    setQuestions(questions.splice(qid, 1));
    console.log(questions);
    setSuccess(false);
    updateQuiz();
  }

  // add a question to the quiz with default text
  const addQuestion = () => {
    const newQuestion = {
      type: 'multiple',
      question: 'Title of the question112323',
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
      url: null,
    }
    setQuestions(questions.push(newQuestion));
    setSuccess(false);
    updateQuiz();
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

  return (
    <>
      <Top/>
      {success &&
        <>
          <div className={styles.questionList}>
            <h1 className={styles.title}>{name}</h1>
            <button
              className={styles.deleteGame}
              onClick={() => deleteGame()}
            ><Delete></Delete></button>
            {questions.map((question) => {
              return (
                <div key={questions.indexOf(question).toString()} className={styles.questionItem}>
                  <div className={styles.questionItemBtns}>
                    <button
                      className={styles.questionDelete}
                      onClick={() => removeQuestion(questions.indexOf(question))}
                    ><Delete></Delete></button>
                    <button className={styles.questionEdit}><Edit></Edit></button>
                  </div>
                  <div className={styles.questionContent}>
                    <span className={styles.question}>{question.question} </span>
                    <span className={styles.questionMark}>worths {question.mark} marks</span>
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
