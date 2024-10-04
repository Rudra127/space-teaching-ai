from fastapi import FastAPI
from src.teacher.routes import teacher_route
from src.course.routes import course_route

version="v1"

app=FastAPI(
    title="Exoplanet AI",
    description="rest api for content and teacher",
)

app.include_router(teacher_route,prefix="/api/{version}/teacher")
app.include_router(course_route,prefix="/api/{version}/course")