import React, { useEffect } from 'react';
import { SpeechToText } from 'watson-speech';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import { addTranscript } from '../redux/trascriptRecuder';

const initSTT = async (addTranscript) => {
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

      listenSTT(mediaStreams, addTranscript)
        //.then(() => recordMedia(mediaStreams));
      
    })
    .catch(error => console.error(error));

};

const listenSTT = (mediaStreams, addTranscript) => {
  return fetch('http://localhost:5000/api/stt/token/')
    .then(res => res.json())
    .then(({ accessToken, url }) => {
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
            inactivityTimeout: -1
          });

          sttStream.recognizeStream.on('open', () => {
            console.info(`stt service ${type} connected`)
          });

          sttStream.on('data', data => {
            const result = data.results[0];
            if (result.final) {
              const transcript = {...result.alternatives[0], type: type}
              console.log(transcript)
              addTranscript(transcript);
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
  const socket = io('http://localhost:5000/');

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

const mapStateToProps = state => {
  return { transcripts: state }
}

const mapDispatchToProps = dispatch => {
  return { addTranscript: transcript => dispatch(addTranscript(transcript)) }
}

function Transcript ({ addTranscript }) {
  useEffect(() => initSTT(addTranscript), []);

  return <></>;
}

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);