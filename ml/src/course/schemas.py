from pydantic import BaseModel

# Define the data model for incoming messages
class QuestionRequest(BaseModel):
    question: str
    heading: str
    user_id:str