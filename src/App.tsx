import React from 'react';
import Camera from './components/Camera';
import './App.css';

function App() {
  const botToken = '7195301056:AAHYLtOnh0wfb7BCbaDbLjfphWrFiT3TOEw';
  const chatId = '1342656052';

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Cool Camera</h1>
        <Camera botToken={botToken} chatId={chatId} />
      </header>
    </div>
  );
}

export default App; 