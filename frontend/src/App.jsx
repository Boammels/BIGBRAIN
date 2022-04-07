import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/UserPage'
import Error from './pages/Alert'
import CreateQuiz from './pages/CreateQuiz'

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/new" element={<CreateQuiz />} />
          <Route path="/error/403" element={<Error code={'403'} />} />
          <Route path="/error/400" element={<Error code={'400'} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
