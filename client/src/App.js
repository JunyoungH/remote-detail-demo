import React from 'react';
import ChatView from './components/ChatView';
import CloseDialog from './components/CloseDialog';
import KeywordSearch from './components/KeywordSearch';
import Transcript from './components/Transcript';
import WordCloud from './components/WordCloud';
import './style/App.css';

function App() {
  return (
    <>
      <Transcript/>
      <CloseDialog/>
      <ChatView/>
      <KeywordSearch/>
      <WordCloud/>
    </>
  );
}

export default App;
