import React, { useCallback, useEffect } from 'react';
import { SpeechToText } from 'watson-speech';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import config from '../config';
import { addTranscript, updateTranscript } from '../redux/trascriptRecuder';

const initSTT = (props) => {
   /* On Windows and Chrome OS the entire system audio can be captured, 
      but on Linux and Mac only the audio of a tab can be captured. */
    Promise.all([
      navigator.mediaDevices.getUserMedia({ video: false, audio: true}),
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    ])
    .then(streams => {
      const [micMedia, displayMedia] = streams;
      if(displayMedia.getAudioTracks().length < 1) {
        throw 'display audio share permission is denied';
      }

      const mediaStreams = {
        video: new MediaStream(displayMedia.getVideoTracks()),
        sAudio: new MediaStream(displayMedia.getAudioTracks()),
        mAudio: new MediaStream(micMedia.getAudioTracks())
      };

      listenSTT(mediaStreams, props)
        //.then(() => recordMedia(mediaStreams));
      
    })
    .catch(error => console.error(error));
}

const listenSTT = (mediaStreams, props) => {
  return fetch(`${config.HOST}/api/stt/token/`)
    .then(res => res.json())
    .then(({ accessToken, url }) => {
      const { addTranscript, updateTranscript } = props;
      const transcripts = [];

      for (const [type, stream] of Object.entries(mediaStreams)) {
        if (type !== 'video') { 
          //refer to the below repo
          //https://github.com/watson-developer-cloud/speech-javascript-sdk/blob/master/docs/SPEECH-TO-TEXT.md          
          const sttStream = SpeechToText.recognizeMicrophone({
            accessToken: accessToken,
            url: url,
            mediaStream: stream,
            model: 'ko-KR_BroadbandModel', //ko-KR_BroadbandModel, ko-KR_NarrowbandModel
            readableObjectMode: true,
            objectMode: true,
            inactivityTimeout: 3600,
            speechDetectorSensitivity: 1.0,
            backgroundAudioSuppression: 0.5
          });

          sttStream.recognizeStream.on('open', () => {
            console.info(`stt service ${type} connected`)
          });

          sttStream.on('data', data => {
            const result = data.results[0];
            if (result.final) {
              const transcript = {...result.alternatives[0], type: type, isAnalyzed: false}
              transcripts.push({...result.alternatives[0]});

              //add transcxripts
              addTranscript(transcript);
              
              //update every 5 (default pool size) transcripts
              upateTranscriptByKeywords(transcripts, updateTranscript)
            }
          })

          sttStream.on('error', err => {
            throw console.error(err)
          });
        }
      }
     
    });
}

const recordMedia = (mediaStreams) => {
  const socket = io(`${config.HOST}`);

  socket.on('connect', () => {
    console.info('socket connection established ')
  });
  
  for(const [type, stream] of Object.entries(mediaStreams)) {
    const options = type === 'video' ? 
      { mimeType: 'video/webm;codecs=H264', videoBitsPerSecond: 25000 } : 
      { mimeType: 'audio/webm', audioBitsPerSecond: 6400 };

    const recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = (e) => {
      socket.emit('data', {[type]: e.data});
    };

    recorder.start(1000);
  }
}

const upateTranscriptByKeywords = (transcripts, updateTranscript) => {
  const currentSize = transcripts.length;
  if (currentSize && currentSize % config.TRANSCRIPT_POOL === 0) {
    const start = (currentSize / config.TRANSCRIPT_POOL) - 1;
    const targetTranscripts = transcripts.slice(start, config.TRANSCRIPT_POOL);

    const params = new URLSearchParams({transcripts: JSON.stringify(targetTranscripts)});

    fetch(`${config.HOST}/api/transcript/keywords?${params}`)
      .then(res => res.json())
      .then(({ keywords }) => {
        updateTranscript({start: start, end: currentSize, keywords: keywords});
      });
  }
}

const mapStateToProps = state => {
  return { transcripts: state.transcripts }
}

const mapDispatchToProps = dispatch => {
  return { 
    addTranscript: transcript => dispatch(addTranscript(transcript)),
    updateTranscript: currentSize => dispatch(updateTranscript(currentSize))
  }
}


function Transcript (props) {
  useEffect(() =>{
    (async function () {
      initSTT(props);
    })();
  },[]);

  return <></>;
}

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);