'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { courses } from '../../../../store/staticData';

function CoursePage() {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (courseId) {
      const courseData = courses.find((course) => course.id === courseId);
      setCourse(courseData);
    }
  }, [courseId]);

  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    console.log('lesson', lesson);
    localStorage.setItem('lesson', JSON.stringify(lesson));
    router.push(`/Module/${courseId}/lesson/${lesson.id}`);
  };
  return (
    <div className="p-8 min-h-screen">
      {course ? (
        <Grid container spacing={4}>
          {/* Left Side: Accordion with Lessons */}
          <Grid item xs={12} md={8}>
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <Typography variant="h6" className="pb-4 text-white font-semibold">
                Topics to be Covered
              </Typography>

              {course.lessons.map((lesson) => (
                <Accordion
                  key={lesson.id}
                  className="bg-gray-700 text-white rounded-md shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-600 "
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-white" />}
                    aria-controls={`lesson-${lesson.id}-content`}
                    id={`lesson-${lesson.id}-header`}
                    className=" rounded-md transition-colors duration-200 ease-in-out"
                  >
                    <Typography className="font-medium">{lesson.title}</Typography>
                  </AccordionSummary>

                  <AccordionDetails className=" rounded-b-md ">
                    <Typography className="text-gray-300 leading-relaxed">
                      {lesson.description}
                    </Typography>
                    {/* <Link href={`/Module/${courseId}/lesson/${course.id}`}> */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: '10px' }}
                      className="bg-blue-500 hover:bg-blue-600  transition-colors duration-200 ease-in-out"
                      onClick={() => handleViewLesson(lesson)}
                    >
                      View Lesson
                    </Button>
                    {/* </Link> */}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </Grid>

          {/* Right Side: Course Details and Selected Lesson Description */}
          <Grid item xs={12} md={4}>
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              {/* Course Title and Timeline */}
              <Typography variant="h4" className="mb-4 text-white font-bold">
                {course.title}
              </Typography>

              <div className="flex items-center mt-2 mb-6">
                {/* Timeline with Icon */}

                {/* <Typography variant="body1" className="text-gray-400 ">
                  Timeline: {course.timeline}
                </Typography> */}
              </div>

              {/* Course Progress */}
              <div className="mb-6">
                <Typography variant="body2" className="mb-2 text-gray-300">
                  Course Progress:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={50}
                  className="bg-gray-700 h-2 rounded-full my-1"
                  classes={{
                    bar: 'bg-green-400 rounded-full',
                  }}
                />
                <Typography variant="body2" className="text-sm text-gray-400 mt-1">
                  50% completed
                </Typography>
              </div>

              {/* Course Description */}
              <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
                {course.description}
              </Typography>

              {/* CTA Button */}
              <Link href={`/Module/${courseId}/lesson/1`}>
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-blue-600  hover:bg-blue-700 transition-colors duration-200 ease-in-out"
                  sx={{ marginTop: '16px' }}
                >
                  Start Course
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" className="text-center">
          Loading course details...
        </Typography>
      )}
    </div>
  );
}

export default CoursePage;
