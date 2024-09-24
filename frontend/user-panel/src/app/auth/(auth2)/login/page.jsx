'use client';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// components
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AuthLogin from '../../authForms/AuthLogin';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserDataModal from './UserDataModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/store/useUserData';

export default function Login2() {
  const { data: session } = useSession();
  const [takeUserData, setTakeUserData] = useState(false);
  const router = useRouter();
  const { setUserData } = useUserData();

  useEffect(() => {
    const handleAuth = async () => {
      if (session && session.user) {
        try {
          const user = await axios.post('/auth/nextAuth-signIn', {
            email: session?.user?.email,
          });
          if (user.status === 200) {
            localStorage.setItem('userData', JSON.stringify(user.data.data.user));
            setUserData(user.data.data.user);
            router.push('/');
            // window.location.reload();
          }
        } catch (error) {
          console.log(error);
          if (error.response?.status === 400) {
            toast.error('You are not logged in please verify your email');
          }
          if (error.response?.status === 401) {
            toast.error('You are not logged in check your credentials!');
          }
          if (error.response?.status === 404) {
            toast.error('Welcome to the Neweb.ai Please complete your profile');
            setTakeUserData(true);
          }

          if (error.response?.status === 500) {
            toast.error('Some internal server error!');
          }
        }
      }
    };

    if (session) {
      console.log('working', session.user);
      handleAuth();
    }
  }, [session]);

  return (
    <PageContainer title="Login Page" description="this is Sample page">
      {takeUserData && (
        <UserDataModal takeUserData={takeUserData} setTakeUserData={setTakeUserData} />
      )}
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <AuthLogin
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="textSecondary" variant="h6" fontWeight="500">
                      New to Neweb.ai?
                    </Typography>
                    <Typography
                      component={Link}
                      href="/auth/register"
                      fontWeight="500"
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                      }}
                    >
                      Create an account
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

Login2.layout = 'Blank';
