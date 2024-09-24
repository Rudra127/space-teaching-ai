'use client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// components
import WebsiteCards from '@/app/(DashboardLayout)/components/dashboard/WebsiteCards';
import WelcomeCard from './components/dashboard/WelcomeCard';
import PageContainer from './components/container/PageContainer';

export default function Dashboard() {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} lg={12}>
            <WebsiteCards />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
