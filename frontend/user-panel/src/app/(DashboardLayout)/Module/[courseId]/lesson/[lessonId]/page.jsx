'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Grid, Typography, Button, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Skeleton from 'react-loading-skeleton';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import 'react-loading-skeleton/dist/skeleton.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
const initialChat = [{ id: 1, message: 'Hello! How can I assist you today?', isUser: false }];
function Page() {
  const { lessonId } = useParams();
  const [chatHistory, setChatHistory] = useState(initialChat);
  const [inputMessage, setInputMessage] = useState('');
  const [text, setText] = useState(
    'start teaching by giving a short info followed by asking a user engaging question',
  );
  const [markDownContent, setMarkDownContent] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const pollyClient = new PollyClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_API_TOKEN,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_API_TOKEN,
    },
  });

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonData = JSON.parse(localStorage.getItem('lesson'));
        const body = {
          user_id: '12',
          question: lessonData.description,
          heading: lessonData.title,
        };

        const res = await fetch(
          'https://space-teaching-ai-1.onrender.com/api/v1/course/get_markdown_content',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );

        if (res.ok) {
          const data = await res.json();

          const response = await fetch(
            'https://space-teaching-ai-1.onrender.com/api/v1/teacher/chat',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: '12',
                text: text,
              }),
            },
          );
          if (response.ok) {
            const tutorData = await response.json();

            setMarkDownContent(`${data.markdown_content}`);
            const botResponse = {
              id: chatHistory.length + 2,
              message: tutorData.response,
              isUser: false,
            };
            handleTextToSpeech(`${tutorData.response}`);
            // setChatHistory((prev) => [...prev, botResponse]);
          }
        } else {
          console.error('Error:', res.statusText);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript); // Update the input field with the transcript
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    // handleStopAudio();
    if (inputMessage.trim()) {
      const newChat = {
        id: chatHistory.length + 1,
        message: inputMessage,
        isUser: true,
      };
      setChatHistory([...chatHistory, newChat]);
      setInputMessage('');

      try {
        const response = await fetch(
          'https://space-teaching-ai-1.onrender.com/api/v1/teacher/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: '12',
              text: inputMessage,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();

          const botResponse = {
            id: chatHistory.length + 2,
            message: data.response,
            isUser: false,
          };

          setChatHistory((prev) => [...prev, botResponse]);
          handleTextToSpeech(data.response);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error making API call:', error);
      } finally {
        setInputMessage('');
      }
    }
  };

  const handleTextToSpeech = async (text) => {
    const maxTextLength = 3000;
    const textToConvert = text.trim() || 'Hello World';

    setLoadingAudio(true);

    try {
      const chunks = [];

      if (textToConvert.length > maxTextLength) {
        for (let i = 0; i < textToConvert.length; i += maxTextLength) {
          chunks.push(textToConvert.slice(i, i + maxTextLength));
        }
      } else {
        chunks.push(textToConvert);
      }

      const audioChunks = await Promise.all(
        chunks.map(async (chunk) => {
          const params = {
            OutputFormat: 'mp3',
            Text: chunk,
            VoiceId: 'Matthew',
            Engine: 'neural',
          };

          const command = new SynthesizeSpeechCommand(params);
          const { AudioStream } = await pollyClient.send(command);

          const reader = AudioStream.getReader();
          const audioParts = [];
          let done = false;

          while (!done) {
            const { done: isDone, value } = await reader.read();
            if (isDone) {
              done = true;
            } else {
              audioParts.push(value);
            }
          }

          return new Blob(audioParts, { type: 'audio/mp3' });
        }),
      );

      const combinedBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const combinedAudioUrl = URL.createObjectURL(combinedBlob);
      console.log('combinedAudioUrl', combinedAudioUrl);
      setAudioUrl(combinedAudioUrl);
    } catch (err) {
      console.error('Error synthesizing speech:', err);
    } finally {
      setLoadingAudio(false);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.error('Speech recognition not supported');
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    // handleStopAudio();
    SpeechRecognition.stopListening();
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the audio
      audioRef.current.currentTime = 0; // Reset to the beginning
    }
  };

  return (
    <Grid container spacing={4} className="">
      <Grid item xs={12} sm={7}>
        <div className="h-full p-6 rounded-lg shadow-lg bg-gradient-to-br from-black via-gray-800 to-black max-h-[640px] overflow-y-auto">
          <div className="prose prose-invert w-full">
            {loading ? (
              <div>
                <Skeleton width={600} height={40} baseColor="gray" className="mb-2 bg-gray-800" />

                {/* Introduction Section */}
                <Skeleton width={250} height={30} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={600} height={25} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={580} height={25} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={550} height={25} baseColor="gray" className="mb-4 bg-gray-400" />

                {/* Definition of Exoplanet */}
                <Skeleton width={320} height={30} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={600} height={25} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={580} height={25} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={540} height={25} baseColor="gray" className="mb-4 bg-gray-400" />

                {/* Detection Methods */}
                <Skeleton width={280} height={30} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={600} height={25} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={580} height={25} baseColor="gray" className="mb-2 bg-gray-400" />
                <Skeleton width={500} height={25} baseColor="gray" className="mb-4 bg-gray-400" />
              </div>
            ) : (
              <>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markDownContent}</ReactMarkdown>

                {audioUrl && (
                  <div className="mt-4">
                    <audio
                      src={audioUrl}
                      controls
                      autoPlay
                      className="w-full rounded-lg hidden"
                      ref={async (audio) => audio && (await audio.play())}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Grid>

      <Grid item xs={12} sm={5}>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <Typography variant="h6" className="text-white font-semibold pb-4">
              Chat with LLM
            </Typography>
            <div className="chat-window p-4 rounded-md h-96 overflow-y-auto mb-4 bg-gray-800">
              {chatHistory?.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex mb-4 ${chat.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[75%] break-words ${
                      chat.isUser ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'
                    }`}
                  >
                    <Typography variant="body1">{chat.message}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              sx={{ mr: 2 }}
              className="bg-gray-700 rounded-lg"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Send
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={listening ? stopListening : startListening}
              className={`ml-2 ${
                listening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white py-2 px-4 rounded-lg`}
            >
              {listening ? 'Listening' : 'Record'}
            </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default Page;
