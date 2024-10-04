'use client';
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Button } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import Link from 'next/link';

const courses = [
  {
    courseId: '1',
    title: 'Introduction to Exoplanets',
    description: 'Learn about the discovery and study of planets beyond our solar system.',
    image: '/images/blog/blog-img1.jpg', // Replace with appropriate image
  },
];

function Page() {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Module',
    },
  ];
  return (
    <div className="px-4 py-8  min-h-screen">
      <Breadcrumb title="Module" items={BCrumb} />

      <Grid container spacing={4}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card className="shadow-xl hover:shadow-2xl border border-gray-700 transition duration-300 ease-in-out transform hover:scale-105 ">
              <CardMedia
                component="img"
                height="140"
                className=" rounded-lg"
                image={course.image}
                alt={course.title}
              />
              <CardContent>
                <Typography variant="h5" component="div" className="text-white">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" className="text-gray-400">
                  {course.description}
                </Typography>
              </CardContent>
              <div className="px-4 pb-4">
                <Link href={`/Module/${course.courseId}`}>
                  <Button
                    variant="contained"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Page;
