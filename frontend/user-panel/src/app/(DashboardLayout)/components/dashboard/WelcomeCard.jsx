import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import { IconArrowUpRight } from '@tabler/icons-react';
import Image from 'next/image';
import { useUserData } from '@/store/useUserData';
import Link from 'next/link';
import moment from 'moment-timezone';

const WelcomeCard = () => {
  const { userData } = useUserData();

  return (
    <div className="mb-4">
      <div className="rounded-xl bg-gray-900 p-6 shadow-lg ">
        <div className="text-2xl font-bold text-white"> Exoplanet Exploration</div>
        <iframe
          src="https://eyes.nasa.gov/apps/solar-system/#/home"
          title="NASA Exoplanet"
          width="100%"
          height="500px"
          className="mb-2 mt-5 border-none"
        />
      </div>
    </div>
  );
};

export default WelcomeCard;
