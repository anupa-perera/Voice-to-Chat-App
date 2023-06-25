import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css'
import axios from 'axios';
import { async } from 'regenerator-runtime';
import React, {useState} from 'react';

const API_URL = 'http://127.0.0.1:5000/voiceText';

export default function VoiceToText(){
  //invoking response state hook
  const [response, setResponse] = useState('');

  //extracting properties from speechRec. hook
  const { transcript, listening, resetTranscript } = useSpeechRecognition();


  //function to handle starting speechRec.  
    const handleStartListening = () => {
        window.speechSynthesis.cancel();
        resetTranscript()
        SpeechRecognition.startListening({ continuous: true, language : 'en-IN'}); //continous listening mode
    }
  
    //function to handle stopping the speechRec. 
    const handleStopListening = () => {
        SpeechRecognition.stopListening();
        sendApiRequest(transcript);
    }

    //send api request
    const sendApiRequest = async(transcript) => {
      try {
        const response = await axios.post(API_URL, {transcribed_text : transcript})
        setResponse(response.data.response); // response with the response
        speakResponse(response.data.response); //speak out the response
      } catch (error) {
        console.error(error)
      }
    }

    const speakResponse = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }

    return(
    <div className="voice-to-text-container">
      <h1 className="voice-to-text-heading">GTP 3.5 Voice app</h1>
      <div>
        <button disabled ={listening} className="voice-to-text-button" onClick={handleStartListening}>
          Start
        </button>
        <button disabled= {!listening} className="voice-to-text-button" onClick={handleStopListening}>
          Stop
        </button>
      </div>
      <p className='voice-to-text-transcription'>{transcript}</p>
      {response && <p className="voice-to-text-response">{response}</p>}
    </div>
    );
}