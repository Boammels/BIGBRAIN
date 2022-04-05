import React from 'react';
import './Button.css';
import './App.css';
import logo from './logo.svg';

function App () {
  const str = "Let's go!"
  const xml = (
    <header className="App-header">
      <img src={logo} className="App-logo"></img>
      <h1>Welcome to <a className="App-name">BigBrain</a>!</h1>
      <div id='App-join-area'>
        <input type="text" id='App-join-input' placeholder='Game Pin'/>
        <button className="btn-primary" id='App-join'>{str}</button>
      </div>
      <div>
        <button className="btn-primary" id='App-login'>LOGIN</button>
        <button className="btn-primary"id='App-signup'>SIGN UP</button>
      </div>
    </header>
  );
  return xml;
}

export default App;
