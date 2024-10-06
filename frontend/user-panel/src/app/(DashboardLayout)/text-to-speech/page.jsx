'use client';
import React, { useState } from 'react';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

const PollyTextToSpeech = () => {
  const [text, setText] = useState(''); // Store input text
  const [audioUrl, setAudioUrl] = useState(''); // Store the generated audio URL
  const [loading, setLoading] = useState(false); // Show loading state
  const [error, setError] = useState(''); // Show error message

  // Initialize Polly client
  const pollyClient = new PollyClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_API_TOKEN,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRET_API_TOKEN,
    },
  });

  // Function to handle text-to-speech conversion
  const handleTextToSpeech = async () => {
    setError(''); // Reset error state
    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Matthew', // Use the "Matthew" voice
        Engine: 'neural', // Use generative AI for more expressive speech
      };

      const command = new SynthesizeSpeechCommand(params);
      const { AudioStream } = await pollyClient.send(command);

      // Process the AudioStream correctly
      const audioChunks = [];
      const reader = AudioStream.getReader();

      let result;
      while (!(result = await reader.read()).done) {
        audioChunks.push(result.value);
      }

      // Convert audio chunks to Blob
      const blob = new Blob(audioChunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);

      setAudioUrl(audioUrl); // Set audio URL to play
      setLoading(false);
    } catch (err) {
      console.error('Error synthesizing speech:', err);
      setError('Failed to synthesize speech. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
       Text to Speech
      </h1>
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-400 focus:outline-none text-gray-700 text-lg"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here"
        rows="5"
      />
      <button
        className={`mt-6 w-full py-3 px-6 text-lg font-semibold text-white rounded-lg transition duration-300 shadow-md ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handleTextToSpeech}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to Speech'}
      </button>

      {error && <p className="mt-4 text-red-500 text-center font-semibold">{error}</p>}

      {audioUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Audio Output</h3>
          <audio controls src={audioUrl} className="w-full rounded-lg">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default PollyTextToSpeech;
