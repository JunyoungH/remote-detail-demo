import React from 'react';
import ChatView from './components/ChatView';
import Transcript from './components/Transcript';
import './style/App.css';

function App() {
  return (
    <>
      <Transcript></Transcript>
      <ChatView></ChatView>
    </>
  );
}

export default App;
