import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Top from './TopBar';
import styles from '../styles/Questions.module.css';
import Done from '@material-ui/icons/DoneOutline';
import Checkbox from '@material-ui/core/Checkbox';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import Remove from '@material-ui/icons/Remove'
import Add from '@material-ui/icons/Add'
// import Edit from '@material-ui/icons/EditOutlined';

function Question () {
  const [questions, setQuestions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [urltype, setUrlType] = useState([]);
  const [timelimit, setTimeLimit] = useState([]);
  const [url, setUrl] = useState('');
  const [mark, setMark] = useState(0);
  const [type, setType] = useState('multuple');
  const navigate = useNavigate();
  const quizId = useParams().quizId;
  const questionId = parseInt(useParams().questionId);
  const load = 1;

  // initilise the page
  useEffect(
    async () => {
      if (localStorage.token === '') {
        navigate('/error/403');
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
          if (isNaN(questionId)) {
            navigate('/error/404');
          } else if (data.questions.length <= questionId) {
            navigate('/error/404');
          } else {
            setQuestions(data.questions);
            setName(data.name);
            setThumbnail(data.thumbnail);
            setQuestion(data.questions[questionId].question);
            setAnswers(data.questions[questionId].answers);
            setTimeLimit(data.questions[questionId].timelimit);
            setUrlType(data.questions[questionId].urltype);
            setType(data.questions[questionId].type);
            setUrl(data.questions[questionId].url);
            setMark(data.questions[questionId].mark);
            setSuccess(true);
          }
        } else {
          navigate('/error/403');
        }
      }
    }, [load]
  );

  const check = (q) => {
    let countCorrect = 0;
    for (const ans of q.answers) {
      console.log(ans.type);
      if (ans.type) {
        countCorrect += 1;
      }
    }
    console.log(countCorrect);
    if (countCorrect === 0) {
      alert('There Should be at least one correct answer');
      return false;
    }
    if (q.type === 'single' && countCorrect > 1) {
      alert('The single choice question should only have one correct answer');
      return false;
    }
    return true
  }

  const sendQuestion = async () => {
    const newQuestion = {
      answers: answers,
      timelimit: timelimit,
      url: url,
      question: question,
      type: type,
      urltype: urltype,
      mark: mark,
    }
    console.log(newQuestion);
    if (!check(newQuestion)) {
      return;
    }
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      },
      body: JSON.stringify({
        questions: questions.map((q, index) => {
          return index === questionId ? newQuestion : q;
        }),
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

  const updateAns = (value, type, index) => {
    const newAns = answers;
    newAns[index].content = value;
    newAns[index].type = type;
    setAnswers(newAns);
    console.log(answers);
  }

  const addAnswer = () => {
    const newAns = {
      content: 'answer',
      type: false,
    }
    const newAnswers = answers.concat(newAns)
    setAnswers(newAnswers);
  }

  const removeAnswer = () => {
    setAnswers(answers.slice(0, -1));
  }

  const str1 = 'Question: ';
  const str2 = 'URL and type of URL: ';
  console.log(url);
  console.log(urltype);

  return (
    <>
      <Top />
      {success &&
        <>
          <div className={styles.questionList}>
            <div className={styles.questionItem}>
              <div>
                <div>
                  <p>{str1}</p>
                  <input type='text'
                    className={styles.longInput}
                    value={question}
                    onChange={e => {
                      setQuestion(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.sectionLine}></div>
                <div>
                  <p>{str2}</p>
                  <input
                    type='url'
                    placeholder='Please attatch the url here for assissted info.'
                    className={styles.longInput}
                    value={url}
                    onChange={e => {
                      setUrl(e.target.value);
                    }}
                  />
                  <p><Checkbox
                    checked={urltype === 'video'}
                    value={undefined}
                    onChange={() => {
                      if (urltype === 'video') {
                        setUrlType('none');
                      } else {
                        setUrlType('video');
                      }
                    }}
                  />Video</p>
                  <p><Checkbox
                    checked={urltype === 'image'}
                    value={undefined}
                    onChange={() => {
                      if (urltype === 'image') {
                        setUrlType('none');
                      } else {
                        setUrlType('image');
                      }
                    }}
                  />Image</p>
                  {urltype === 'image' &&
                    <img src={url} className={styles.imagePreview}/>
                  }
                  {urltype === 'video' &&
                    <video
                      src={url}
                      className={styles.videoPreview}
                      controls="controls"
                      autoPlay={true}
                    />
                  }
                </div>
                <div className={styles.sectionLine}></div>
                <p className={styles.questionMark}>
                  {mark > 1 && <button
                    className={styles.smallBtn}
                    onClick={() => setMark(mark - 1)}
                  ><Remove></Remove></button>}
                  Worths <input
                    type='number'
                    value={mark}
                    className={styles.inputSmall}
                    onChange={e => setMark(e.target.value)}
                  /> marks.
                  <button
                    className={styles.smallBtn}
                    onClick={() => setMark(mark + 1)}
                  ><Add></Add></button>
                </p>
                <div className={styles.sectionLine}></div>
                <p className={styles.questionMark}>
                  {timelimit > 3 && <button
                    className={styles.smallBtn}
                    onClick={() => setTimeLimit(timelimit - 1)}
                  ><Remove></Remove></button>}
                  Limited in <input
                    type='number'
                    value={timelimit}
                    className={styles.inputSmall}
                    onChange={e => setTimeLimit(e.target.value)}
                  /> seconds.
                  <button
                    className={styles.smallBtn}
                    onClick={() => setTimeLimit(timelimit + 1)}
                  ><Add></Add></button>
                </p>
                <div className={styles.sectionLine}></div>
                <div>Please select the type of the question:
                  <p><Checkbox
                    checked={type === 'multiple'}
                    value={undefined}
                    onChange={() => {
                      setType('multiple');
                    }}
                  />Multiple Choice Question</p>
                  <p><Checkbox
                    checked={type === 'single'}
                    value={undefined}
                    onChange={() => {
                      setType('single');
                    }}
                  />Single Choice Question</p>
                </div>
                <div className={styles.sectionLine}></div>
                <div>Answers:
                  {answers.map((ans, index) => (
                    <Answer
                      key={index.toString()}
                      info={ans}
                      success={(value, type) => updateAns(value, type, index)}
                    ></Answer>
                  ))}
                  {answers.length < 6 &&
                    <button
                      onClick={() => addAnswer()}
                    >Add an Answer</button>
                  }
                  {answers.length > 2 &&
                    <button
                      onClick={() => removeAnswer()}
                    >Remove an Answer</button>
                  }
                </div>
              </div>
              <button
                className={styles.questionCancel}
                onClick={() => {
                  if (confirm('All unsaved changes will be aborted, are you sure to leave?')) {
                    navigate('/quiz/' + quizId);
                  }
                }}
              ><CancelIcon></CancelIcon></button>
              <button
                className={styles.questionSave}
                onClick={() => sendQuestion()}
              ><Done></Done></button>
            </div>
          </div>
        </>
      }
    </>
  )
}

const Answer = ({ info, success }) => {
  const [type, setType] = useState(info.type)
  const [value, setValue] = useState(info.content)
  return (
    <p className={styles.answer}>
      <Checkbox
        checked={type}
        onChange={() => {
          setType(!type);
        }}
      ></Checkbox>
      <input
        className={styles.answerInput}
        value={value}
        onChange={e => setValue(e.target.value)}
      ></input>
      <button
        className={styles.answerSave}
        onClick={() => success(value, type)}
      ><SaveAltIcon></SaveAltIcon>
      </button>
      </p>
  );
}

Answer.propTypes = {
  info: PropTypes.object,
  success: PropTypes.func,
}

export default Question;
