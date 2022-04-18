import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
      let response = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
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
      response = await fetch('http://localhost:5005/admin/session/' + sessionId + '/results', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token,
        }
      })
      if (response.status === 200) {
        const data = await response.json();
        setResults(data.results);
      } else {
        navigate('/error/403')
      }
    }
  }, [load]);

  return (
    <>
      <Top />
      <div className={styles.resultArea}>
        <h1>{title}</h1>
        {results.length > 0 && results.map((res, index) => (
          <div key={index} className={index === 0 ? styles.champ : styles.oth}>
            <ResLine index={index} questions={questions} person={res} />
          </div>
        ))}
      </div>
    </>
  )
}

const ResLine = ({ index, questions, person }) => {
  // console.log(person);
  const [sum, setSum] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    let sumAn = 0
    for (const i in questions) {
      if (person.answers[i].correct) {
        sumAn = sumAn + questions[i].mark;
      }
    }
    setSum(sumAn);
    if (person.name.length >= 10) {
      setName(person.name.slice(0, 7).concat('... '))
    } else {
      let nameAn = person.name.concat(' ');
      let i = nameAn.length;
      while (i <= 10) {
        nameAn = nameAn.concat('-');
        i = nameAn.length;
      }
      setName(nameAn);
      console.log(nameAn + '132')
    }
  })

  return (
    <>
      <div>
        <p>
          <span
            className={index === 0 ? styles.first : styles.others}
          >No.{index + 1}</span>
          <span> {name}--- {sum} scores</span>
        </p>
      </div>
    </>
  )
}

ResLine.propTypes = {
  questions: PropTypes.array,
  person: PropTypes.object,
  index: PropTypes.number
}

export default Result;
