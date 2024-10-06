'use client';
import Link from 'next/link';
import { CardContent, Typography, Grid, Rating, Tooltip, Fab, Button } from '@mui/material';
import { Stack } from '@mui/system';
import { IconBasket } from '@tabler/icons-react';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import Image from 'next/image';
import { IconLink } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUserData } from '@/store/useUserData';
import { useRouter } from 'next/navigation';

// const websiteCards = [
//   {
//     title: 'TechCrunch',
//     subheader: 'Founded: June 11, 2005',
//     logo: '/images/logos/techcrunch.png',
//     url: 'https://neweb-ai.vercel.app/',
//     description:
//       'TechCrunch is an online publisher focusing on the tech industry, startup companies, and venture capital funding.',
//     rating: 5,
//     traffic: 'High',
//   },
//   {
//     title: 'GitHub',
//     subheader: 'Founded: April 10, 2008',
//     logo: '/images/logos/github.png',
//     url: 'https://neweb-ai.vercel.app/',
//     description:
//       'GitHub is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.',
//     rating: 5,
//     traffic: 'Very High',
//   },
//   {
//     title: 'Medium',
//     subheader: 'Founded: August 15, 2012',
//     logo: '/images/logos/medium.png',
//     url: 'https://neweb-ai.vercel.app/',
//     description:
//       'Medium is an open platform where readers find dynamic thinking, and where expert and undiscovered voices can share their writing on any topic.',
//     rating: 4,
//     traffic: 'Medium',
//   },
//   {
//     title: 'Stack Overflow',
//     subheader: 'Founded: September 15, 2008',
//     logo: '/images/logos/stackoverflow.png',
//     url: 'https://neweb-ai.vercel.app/',
//     description:
//       "Stack Overflow is a question and answer site for professional and enthusiast programmers. It's a place where you can ask and answer programming-related questions.",
//     rating: 5,
//     traffic: 'Very High',
//   },
// ];

const WebsiteCards = () => {
  return (
    <div className="mb-4">
      <div className="rounded-xl bg-gray-900 p-6 shadow-lg mb-8">
        <div className="text-2xl font-bold text-white"> Exoplanet Exploration</div>
        <Typography color="white" variant="body1"></Typography>
        <Button
          variant="contained"
          color="primary"
          href="https://scratch.mit.edu/projects/141280959/fullscreen/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '10px' }}
        >
          Exoplanet Game
        </Button>
      </div>

      <div className="rounded-xl bg-gray-900 p-6 shadow-lg">
        <div className="text-2xl font-bold text-white">GravityGame</div>
        <Typography color="white" variant="body1">
          gravity and exploration on different Exoplanets.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="https://scratch.mit.edu/projects/676798770/fullscreen/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '10px' }}
        >
          gravityGame
        </Button>
      </div>
    </div>
  );
};

export default WebsiteCards;
