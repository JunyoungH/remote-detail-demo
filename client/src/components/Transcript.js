import React, { useEffect } from 'react';
import { SpeechToText } from 'watson-speech';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import config from '../config';

// Services
import { getWatsonToken } from '../services/sttService';
import { getKeywords, getWordCloud } from '../services/transcriptService';

// Actions
import { addTranscript, updateTranscript, hasTranscriptError } from '../redux/transcriptReducer';
import { updateWordCloud } from '../redux/wordCloudReducer';

const resizeWindow = () => {
  window.resizeTo(330, 520);
}

const initSTT = (props) => {
      //On Windows and Chrome OS the entire system audio can be captured, 
      //but on Linux and Mac only the audio of a tab can be captured.
    Promise.all([
      navigator.mediaDevices.getUserMedia({ video: false, audio: true}),
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    ])
    .then(streams => {
      resizeWindow();
      const [micMedia, displayMedia] = streams;
      if(displayMedia.getAudioTracks().length < 1) {
        throw 'display audio share permission is denied';
      }

      //media type of display (video, audio) and microphone input
      const mediaStreams = {
        video: new MediaStream(displayMedia.getVideoTracks()),
        sAudio: new MediaStream(displayMedia.getAudioTracks()),
        mAudio: new MediaStream(micMedia.getAudioTracks())
      };

      listenSTT(mediaStreams, props)
        .then(() => recordMedia(mediaStreams))
      
    })
    .catch(error => {
      resizeWindow();
      props.hasTranscriptError({ isHasError: true });
      console.error(error);
    });
}

const listenSTT = (mediaStreams, props) => {
  return getWatsonToken()
    .then(({ accessToken, url }) => {
      const { addTranscript, updateTranscript, hasTranscriptError, updateWordCloud } = props;
      const transcripts = [];

      for (const [type, stream] of Object.entries(mediaStreams)) {
        if (type !== 'video') { 
          
          //refer to the below repo for options
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

          sttStream.recognizeStream.on('error', error => {
            hasTranscriptError({ isHasError: true });
            console.error(error);
          })

          sttStream.on('data', data => {
            const result = data.results[0];
            if (result.final) {
              const transcript = {...result.alternatives[0], type: type, isAnalyzed: false}
              transcripts.push({...result.alternatives[0]});

              //add transcxripts
              addTranscript({ transcript });
              
              //update every 5 (default pool size) transcripts
              updateTranscriptByKeywords(transcripts, updateTranscript, updateWordCloud);

            }
          })

          sttStream.on('error', error => {
            hasTranscriptError({ isHasError: true });
            console.error(error);
          });
        }
      }
     
    });
}

const recordMedia = (mediaStreams) => {
  const socket = io(`${config.SERVER_BASE_URL}`);

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

const updateTranscriptByKeywords = (transcripts, updateTranscript, updateWordCloud) => {
  const currentSize = transcripts.length;
  
  if (currentSize && currentSize % config.TRANSCRIPT_POOL === 0) {
    const start = (currentSize / config.TRANSCRIPT_POOL) - 1;
    const targetTranscripts = transcripts.slice(start, config.TRANSCRIPT_POOL);

    const params = new URLSearchParams({transcripts: JSON.stringify(targetTranscripts)});

    getKeywords(params).then(({ keywords }) => {
      updateTranscript({start: start, end: currentSize, keywords: keywords});
    });

    getWordCloud(params).then(({ words }) => {
      updateWordCloud(words);
    });
  }
}

const mapStateToProps = state => {
  return {
    transcripts: state.transcript.results,
    isHasError: state.transcript.isHasError
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    addTranscript: transcript => dispatch(addTranscript(transcript)),
    updateTranscript: currentSize => dispatch(updateTranscript(currentSize)),
    hasTranscriptError: isHasError => dispatch(hasTranscriptError(isHasError)),
    updateWordCloud: words => dispatch(updateWordCloud(words))
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