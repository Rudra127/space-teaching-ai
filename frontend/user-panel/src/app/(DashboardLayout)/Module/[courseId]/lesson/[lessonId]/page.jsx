'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Grid, Typography, Button, TextField, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS for better appearance

const initialChat = [{ id: 1, message: 'Hello! How can I assist you today?', isUser: false }];

function Page() {
  const { lessonId } = useParams();
  const [chatHistory, setChatHistory] = useState(initialChat);
  const [inputMessage, setInputMessage] = useState('');
  const [markDownContent, setMarkDownContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonData = JSON.parse(localStorage.getItem('lesson'));
        const body = {
          user_id: '12',
          question: lessonData.description,
          heading: lessonData.title,
        };

        const res = await fetch('http://127.0.0.1:8000/api/v1/course/get_markdown_content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          setMarkDownContent(`${data.markdown_content}`);
        } else {
          console.error('Error:', res.statusText);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newChat = {
        id: chatHistory.length + 1,
        message: inputMessage,
        isUser: true,
      };
      setChatHistory([...chatHistory, newChat]);
      setInputMessage('');

      // Simulate LLM response
      setTimeout(() => {
        const botResponse = {
          id: chatHistory.length + 2,
          message: 'This is a simulated response from the LLM based on your query.',
          isUser: false,
        };
        setChatHistory((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Left Side: Markdown Renderer with Skeleton */}
      <Grid item xs={12} sm={7}>
        <div className="h-full p-6 rounded-lg shadow-lg bg-gradient-to-br from-black via-gray-900 to-black hover:shadow-2xl transition-shadow duration-300 ease-in-out max-h-[640px] overflow-y-auto ">
          <div className="prose prose-invert w-full">
            {loading ? (
              // Show loading skeleton while fetching markdown content
              <div>
                {/* Title */}
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
              // Render markdown content once data is loaded
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markDownContent}</ReactMarkdown>
            )}
          </div>
        </div>
      </Grid>

      {/* Right Side: Chat Interface */}
      <Grid item xs={12} sm={5}>
        <div className="bg-gradient-to-br from-black via-gray-900 to-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col justify-between">
          <div>
            <Typography variant="h6" className="text-white font-semibold pb-4">
              Chat with LLM
            </Typography>
            <div className="chat-window p-4 rounded-md shadow-sm h-96 overflow-y-auto mb-4">
              {chatHistory.map((chat) => (
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

          {/* Message Input */}
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
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 ease-in-out"
            >
              Send
            </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default Page;
