from fastapi import FastAPI
from src.teacher.routes import teacher_route
from src.course.routes import course_route
from fastapi.middleware.cors import CORSMiddleware
version="v1"

app=FastAPI(
    title="Exoplanet AI",
    description="rest api for content and teacher",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with the specific origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(teacher_route,prefix="/api/{version}/teacher")
app.include_router(course_route,prefix="/api/{version}/course")