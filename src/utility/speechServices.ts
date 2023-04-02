import axios from "axios";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export async function textToSpeech(text: any) {

    const apiKey = process.env.NEXT_PUBLIC_EL_API_KEY;
    const voiceId = 'AZnzlk1XvdvUeBnXmlld'
    const baseUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
    const url = baseUrl

    let response = undefined
  
    await axios.post(url, {
            headers: {
                'accept': 'audio/mpeg',
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            text,
            voice_settings: {
                "stability": 0,
                "similarity_boost": 0
            },
        }).then((res) => {
            response = res
        }).catch((err) => {
            console.error(err)
        });
    
    return response
}

export async function textToSpeechAA(text: any) {
    const SPEECH_REGION = 'eastus';
    const subscriptionKey = process.env.NEXT_PUBLIC_TTS_API_KEY; // Replace with your subscription key
    const endpoint = process.env.NEXT_PUBLIC_TTS_ENDPOINT; // Replace with the endpoint URL
    const apiKey = Buffer.from(`${subscriptionKey}:${subscriptionKey}`).toString('base64');

    // Make the API call
    let res = null;

    await axios.post(`https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        },
        data: `<speak version='1.0' xml:lang=''en-US'>
                <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
                    ${text}
                </voice>
            </speak>`,
        responseType: 'arraybuffer'
    })
        .then((response) => {
            // The audio data is in the response.data buffer
            console.log(response.data);
            res = response
        })
        .catch((error) => {
            console.error(error);
        });

    return res
}

export async function sttFromMic() {
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(process.env.NEXT_PUBLIC_TTS_API_KEY, 'eastus');
    speechConfig.speechRecognitionLanguage = 'en-US';
    
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    console.log('speak into your mic')

    recognizer.recognizeOnceAsync((result: any) => {
        let displayText;
        console.log(result)
        if (result.reason === ResultReason.RecognizedSpeech) {
            displayText = `RECOGNIZED: Text=${result.text}`
        } else {
            displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
        }

        console.log(displayText)
    });
}

export async function speechToText(audioFile: any) {
    const subscriptionKey = process.env.NEXT_PUBLIC_TTS_API_KEY;
    const endpointUrl = process.env.NEXT_PUBLIC_TTS_ENDPOINT;
  
    const headers = {
      'Content-Type': 'audio/wav',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    };
  
    const params = {
      'language': 'en-US',
      'format': 'simple'
    };
  
    const url = `${endpointUrl}/speech/recognition/conversation/cognitiveservices/v1?${new URLSearchParams(params)}`;
  
    return axios.post(url, audioFile, { headers: headers });
}