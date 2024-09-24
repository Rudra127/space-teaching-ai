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
  const [websiteCards, setWebsiteCards] = useState([]);
  const { userData } = useUserData();
  const router = useRouter();
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        console.log(userData);
        const res = await axios.get(`/project/userId/${userData._id}`);
        console.log(res.data);
        setWebsiteCards(res.data.data.Projects);
        if (res.status === 200) {
          // toast.success('websites fetched successfully');
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          // toast.error('No Projects found!!');
        }
        if (error.response.status === 401) {
          router.push('/auth/login');
        }
      }
    };
    if (userData.userId) {
      fetchWebsites();
    }
  }, [userData]);
  return (
    <Grid container spacing={3}>
      {/* Top right corner button */}
      {websiteCards.length > 0 && (
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/BuildWebsite">
              <Button
                variant="contained"
                disabled={userData.subscriptionStatus !== 'active'}
                sx={{ marginTop: '8px' }}
              >
                Create Website
              </Button>
            </Link>
          </div>
        </Grid>
      )}
      {/* Website cards */}
      {websiteCards.length > 0 ? (
        websiteCards.map((website, index) => (
          <Grid item xs={12} md={4} lg={3} key={index}>
            <BlankCard>
              <Typography
                component={Link}
                href={website.projectDomain}
                target="_blank"
                rel="noopener noreferrer"
                className="relative"
              >
                <iframe
                  src={website.projectDomain}
                  title={`${website.title} preview`}
                  style={{
                    width: '100%',
                    height: '200px',
                    border: 'none',
                    pointerEvents: 'none',
                  }}
                />
                <Tooltip title="Visit Website">
                  <Fab
                    size="small"
                    color="primary"
                    sx={{ bottom: '-15px', right: '15px', position: 'absolute' }}
                  >
                    <IconLink size="16" />
                  </Fab>
                </Tooltip>
              </Typography>

              <CardContent sx={{ p: 3, pt: 2 }}>
                <Typography variant="h6">{website.projectName}</Typography>
                <Typography variant="subtitle2" color="textSecondary" mt={1}>
                  {website.projectSummary}
                </Typography>
              </CardContent>
            </BlankCard>
          </Grid>
        ))
      ) : (
        <>
          {websiteCards.length == 0 && (
            <Grid item xs={12}>
              {/* <p className="ml-7 text-lg">No Websites found !!</p> */}
              <Link href="/BuildWebsite">
                <Button
                  variant="contained"
                  disabled={userData.subscriptionStatus !== 'active'}
                  sx={{ marginTop: '8px', marginLeft: '28px' }}
                >
                  Create your first Website
                </Button>
              </Link>
              {userData.subscriptionStatus !== 'active' && (
                <p className="ml-10 mt-1 text-red-400 text-sm">
                  * please select plan to create website
                </p>
              )}
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default WebsiteCards;
