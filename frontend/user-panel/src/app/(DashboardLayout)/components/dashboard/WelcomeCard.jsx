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
    <Card elevation={0} sx={{ py: 0 }}>
      <CardContent sx={{ py: 4, px: 2 }}>
        <Grid container>
          <Grid item sm={12}>
            <Box>
              <Box
                gap="16px"
                mb={5}
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'flex',
                  },
                  alignItems: 'center',
                }}
              >
                <Avatar src="/images/profile/user-1.jpg" alt="img" sx={{ width: 40, height: 40 }} />
                <Typography variant="h5" whiteSpace="nowrap">
                  Welcome back {userData.fullName} !
                </Typography>
              </Box>
              {userData.subscriptionStatus === 'unsubscribed' ? (
                <Stack spacing={2} direction="row">
                  {/* Plan 1 - Starter */}
                  <Box>
                    <Typography variant="h5" whiteSpace="nowrap">
                      Please select a Subscription !!
                    </Typography>
                    <Link href="/selectSubscriptionPlan">
                      <Button variant="contained" sx={{ marginTop: '8px' }}>
                        Select a plan
                      </Button>
                    </Link>
                  </Box>
                </Stack>
              ) : (
                // </Grid>
                <Stack
                  spacing={2}
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                >
                  {/* <Box>
                    <Typography variant="h2" whiteSpace="nowrap">
                      34
                      {/* <span>
                      <IconArrowUpRight width={18} color="#39B69A" />
                    </span> 
                    </Typography>
                    <Typography variant="subtitle1" whiteSpace="nowrap">
                      Total Websites
                    </Typography>
                  </Box> */}
                  <Box>
                    <Grid container spacing={2} alignItems="flex-start">
                      {/* Left Side */}
                      <Grid item xs={12} sm={4} md={4}>
                        <Typography variant="h2">PRO</Typography>
                        <Typography variant="subtitle1">Subscription Details</Typography>
                      </Grid>

                      {/* Right Side */}
                      <Grid item xs={12} sm={8} md={8}>
                        <Typography variant="h5">
                          ${' '}
                          {userData?.paidData?.price
                            ? (userData?.paidData?.price / 100).toFixed(2)
                            : '0.00'}
                          / month
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '4px' }}>
                          Next billing date:
                          {moment
                            .unix(userData?.paidData?.subscriptionEndDate)
                            .tz('Asia/Kolkata')
                            .format('MMMM D, YYYY')}
                        </Typography>
                        {/* <Typography variant="body2" >
                        Renewal: Auto-renewal enabled
                      </Typography> */}
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
