from fastapi import FastAPI, APIRouter, HTTPException
from src.course.services import RAG
from src.course.llm import course_llm
from src.db.qdrant_store import store as qdrantStore
from src.course.schemas import QuestionRequest
from src.db.redis_store import store as redisStore
import json

course_route = APIRouter()
course_services = RAG(llm=course_llm, vector_store=qdrantStore)

@course_route.post("/get_markdown_content")
async def get_markdown_content(request: QuestionRequest):
    try:
        # Reset the chat key if it exists for the user
        course_services.reset_chat_if_exists(request.user_id)

        # Retrieve the markdown content
        response = course_services.retrieve_answer(request.question, request.heading)

        # Remove newline characters from the response
        # response = response.replace('\n', '')

        # Store the markdown content in Redis
        data_to_store = {"md_content": response}
        await redisStore.set(request.user_id, json.dumps(data_to_store))

        return {"markdown_content": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
