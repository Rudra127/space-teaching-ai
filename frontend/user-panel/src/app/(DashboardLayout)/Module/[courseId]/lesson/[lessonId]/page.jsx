'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Grid, Typography, Button, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Mocked data for chat
const initialChat = [{ id: 1, message: 'Hello! How can I assist you today?', isUser: false }];

// Mock markdown content (replace with actual content in real-world)
const markdownContent = `
# Introduction to Exoplanets

## Learning Objectives
- Define what an exoplanet is.
- Understand the methods used to detect exoplanets.
- Learn about the significance of exoplanet research.

---

## What is an Exoplanet?
An **exoplanet** (or extrasolar planet) is a planet that orbits a star outside of our solar system. Exoplanets can vary in size, composition, temperature, and location within the habitable zone of their respective stars. They are classified into several categories based on their mass, composition, and other characteristics.

---

## Detection Methods
Detecting exoplanets is challenging due to their faintness compared to their parent stars. Scientists use several indirect methods to discover these distant worlds:

1. **Transit Method**: 
   - When an exoplanet passes in front of its star, it blocks a small amount of light, causing a mini-eclipse. By measuring the duration and frequency of these mini-eclipses, scientists can determine the size and orbit of the exoplanet.

2. **Doppler Shift**: 
   - As an exoplanet orbits its star, it induces a slight wobble in the star. By measuring this wobble, scientists can infer the presence of an exoplanet and estimate its mass.

3. **Direct Imaging**: 
   - Using powerful telescopes and advanced techniques, scientists can directly observe the light reflected off the surface of an exoplanet. This method is most effective for planets far from their stars.

4. **Gravitational Lensing**: 
   - If an exoplanet passes in front of a background star, it can create a gravitational lens effect, bending and magnifying the star's light. Observing these distortions can help scientists detect the presence of an exoplanet.

---

## Significance of Exoplanet Research
Researching exoplanets is vital for understanding the formation and evolution of planetary systems beyond our own. It also aids in the search for extraterrestrial life. Key reasons for the significance of exoplanet research include:

- **Understanding Planetary Formation**: 
  - By studying exoplanets, scientists gain insights into how planets form and evolve in various star systems. This knowledge enhances our understanding of our own solar system and the potential for life on other planets.

- **Searching for Life**: 
  - Exoplanets located in the habitable zone, or "Goldilocks zone," of their stars have conditions suitable for liquid water. Since water is essential for life as we know it, these exoplanets are prime targets in the search for extraterrestrial life.

- **Advancements in Technology**: 
  - The search for exoplanets drives technological innovation, leading to the development of more powerful telescopes and advanced detection methods. These advancements benefit other areas of astronomy and science.

---

## Key Takeaways
- Exoplanets are planets that orbit stars outside of our solar system.
- Scientists utilize various methods, including transit, Doppler shift, direct imaging, and gravitational lensing, to detect exoplanets.
- Exoplanet research is crucial for understanding planetary formation, searching for life, and fostering technological advancements.

---

## Conclusion
In conclusion, exoplanets are captivating celestial bodies that provide valuable insights into the formation and evolution of planetary systems beyond our own. The methods used to detect exoplanets have led to significant technological advancements and expanded our understanding of the universe. As we continue to explore and study exoplanets, we may one day uncover evidence of extraterrestrial life.

`;

function Page() {
  const { lessonId } = useParams();
  const [chatHistory, setChatHistory] = useState(initialChat);
  const [inputMessage, setInputMessage] = useState('');
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (lessonId) {
      // In a real-world app, fetch course details using courseId
      setCourse({
        id: 'exoplanets101',
        title: 'Exploring Exoplanets',
      });
    }
  }, [lessonId]);

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
      {/* Left Side: Markdown Renderer */}
      <Grid item xs={12} sm={7}>
        <div className="bg-gradient-to-br from-black via-gray-900 to-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <div className="prose prose-invert w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      </Grid>

      {/* Right Side: Chat Interface */}
      <Grid item xs={12} sm={5} className="">
        <div className="bg-gradient-to-br from-black  via-gray-900 to-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out  flex flex-col justify-between ">
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
