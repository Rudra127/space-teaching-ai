'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import CustomTitle from '@/app/(DashboardLayout)/components/ui/CustomTitle';
import PricingCard from './PricingCard';
import { Container, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

const plans = [
  {
    month: {
      starter: {
        id: 'price_1PyzVKSCN5U3Z9OGPDQO2VqF',
        price: '8$/MONTH',
        features: [
          '20+ AI Document Templates',
          'Regular Support Business',
          '10 Images per month',
          'Live Chat Support',
          '1 Speech to Text per month',
          'Live Chat Support',
          '20+ AI Document Templates',
        ],
      },
      pro: {
        id: 'price_1Pz0kRSCN5U3Z9OGdOFG3a9X',

        price: '16$/MONTH',
        features: [
          '20+ AI Document Templates',
          'Regular Support Business',
          '10 Images per month',
          'Live Chat Support',
          '1 Speech to Text per month',
          'Live Chat Support',
          '20+ AI Document Templates',
        ],
      },
      agency: {
        price: 'BOOK A CALL',
        features: [
          '20+ AI Document Templates',
          'Regular Support Business',
          '10 Images per month',
          'Live Chat Support',
          '1 Speech to Text per month',
          'Live Chat Support',
          '20+ AI Document Templates',
        ],
      },
    },
  },
  {
    year: {
      starter: {
        id: 'price_1PyzVKSCN5U3Z9OGPDQO2VqF',
        price: '80$/YEAR',
        features: [
          '20+ AI Document Templates',
          'Regular Support Business',
          '10 Images per month',
          'Live Chat Support',
          '1 Speech to Text per month',
          'Live Chat Support',
          '20+ AI Document Templates',
        ],
      },
      pro: {
        id: 'price_1Pz0rVSCN5U3Z9OGp3UbyoDI',
        price: '150$/YEAR',
        features: [
          '20+ AI Document Templates',
          'Regular Support Business',
          '10 Images per month',
          'Live Chat Support',
          '1 Speech to Text per month',
          'Live Chat Support',
          '20+ AI Document Templates',
        ],
      },
      agency: {
        price: 'BOOK A CALL',
        features: [
          '20+ AI Document Templates',
          'Regular Support Business',
          '10 Images per month',
          'Live Chat Support',
          '1 Speech to Text per month',
          'Live Chat Support',
          '20+ AI Document Templates',
        ],
      },
    },
  },
];

function page() {
  const [isYearly, setIsYearly] = useState(true);

  // Handle switch toggle
  const handleToggle = () => {
    setIsYearly(!isYearly);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  let success = searchParams.get('success');
  let error = searchParams.get('error');
  const [errorState, setErrorState] = useState(searchParams.get('error') === 'true');
  const [successState, setSuccessState] = useState(searchParams.get('success') === 'true');

  // Get the current pricing plans based on toggle state

  const currentPlans = isYearly ? plans[1].year : plans[0].month;

  useEffect(() => {
    const getCheckoutSession = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;
      try {
        const session = await axios.get(`/payment/validate-payment/${sessionId}`);
        if (session.status === 200) {
          localStorage.removeItem('sessionId');
          const userData = JSON.parse(localStorage.getItem('userData'));
          const newUserData = {
            ...userData, // Keep existing properties
            subscriptionStatus: 'active', // Update or add subscriptionStatus
            paidData: session.data.paidData, // Add or merge paidData object
          };

          localStorage.setItem('userData', JSON.stringify(newUserData));

          console.log('stripe subscription success', session.data.paidData);

          window.location.href = '/';
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (errorState || successState) {
      getCheckoutSession();
    }
  }, []);

  return (
    <>
      <Dialog
        maxWidth="lg"
        open={errorState || successState}
        onClose={() => {
          setErrorState(false);
          setSuccessState(false);
        }}
      >
        <DialogContent>
          <Box>
            {errorState && (
              <Typography variant="h2" color="warning">
                Sorry!! Your payment is not completed!
              </Typography>
            )}
            {successState && (
              <Typography variant="h2" color="success">
                Congratulations!! Your payment is completed!
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-center ">
        <main className="container mx-auto p-4">
          {/* Toggle Switch for Monthly/Yearly */}
          <div className="flex justify-center mt-4">
            <FormControlLabel
              control={<Switch checked={isYearly} onChange={handleToggle} color="primary" />}
              label={isYearly ? 'Yearly' : 'Monthly'}
            />
          </div>

          {/* Pricing Plans */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {/* Map over the current pricing plans based on selected toggle */}
            {Object.keys(currentPlans).map((planKey, index) => {
              const plan = currentPlans[planKey];
              return (
                <div key={index} className="w-full md:w-1/3 lg:w-1/4">
                  <PricingCard
                    plan={planKey}
                    features={plan.features || []}
                    price={plan.price}
                    buttonText={plan.price === 'BOOK A CALL' ? 'Contact Us' : 'Choose Plan'}
                  />
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}

export default page;
