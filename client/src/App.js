import React from 'react';
import ChatView from './components/ChatView';
import KeywordSearch from './components/KeywordSearch';
import Transcript from './components/Transcript';
import './style/App.css';

function App() {
  return (
    <>
      <Transcript></Transcript>
      <ChatView></ChatView>
      <KeywordSearch></KeywordSearch>
    </>
  );
}

export default App;
