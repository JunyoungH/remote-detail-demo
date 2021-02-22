import React, { useEffect } from 'react';
import { SpeechToText } from 'watson-speech';

const userMedia = async () => {
  const micMedia = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

  //On Windows and Chrome OS the entire system audio can be captured, 
  //but on Linux and Mac only the audio of a tab can be captured.
  const desktopMedia = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true})

  const videoStream = new MediaStream(desktopMedia.getVideoTracks());
  const audioStreams = {
    sAudio: new MediaStream(desktopMedia.getAudioTracks()),
    mAudio: new MediaStream(micMedia.getAudioTracks())
  };

  listenSTT(audioStreams);
};

const listenSTT = (audioStreams) => {
  fetch('http://localhost:5000/')
    .then(res => res.json())
    .then(token => {
      //refer to the below repo
      //https://github.com/watson-developer-cloud/speech-javascript-sdk/blob/master/speech-to-text/recognize-stream.js

    });
}


const recordMedia = () => {
  const mediaStream = new MediaStream(/* media stream */);
  const rec = new MediaRecorder(mediaStream);
  rec.ondataavailable = (e) => {
    console.log(e.data)
  };
  rec.start(1000);
}
  

function Transcript () {
  useEffect(() => {
    userMedia();;
  }, []);


  return (
    <>
    </>
  );
}

export default Transcript;