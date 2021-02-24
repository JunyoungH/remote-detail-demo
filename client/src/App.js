import React from 'react';
import ChatView from './components/ChatView';
import KeywordSearch from './components/KeywordSearch';
import Transcript from './components/Transcript';
import WordCloud from './components/WordCloud';
import './style/App.css';

function App() {
  return (
    <>
      <Transcript/>
      <ChatView/>
      <KeywordSearch/>
      <WordCloud/>
    </>
  );
}

export default App;
