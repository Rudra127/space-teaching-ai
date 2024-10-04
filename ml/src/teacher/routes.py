from fastapi import FastAPI, APIRouter,status,HTTPException
from src.teacher.services import Teacher
from src.teacher.llm import teacher_llm
from src.teacher.schemas import Message
from src.db.redis_store import store

redis_store=store
teacher_route=APIRouter()
teacher_services=Teacher(llm=teacher_llm,redis_store=store)

@teacher_route.post("/chat")
async def chat(message: Message):
    user_input = message.text
    user_id = message.user_id

    response = await teacher_services.teacher_response(user_id,user_input)
    if response:
        return {"response": response["text"]}
    else:
       raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="md content not found not found")
    
    
