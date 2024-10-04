from pydantic import BaseModel

# Define the data model for incoming messages
class Message(BaseModel):
    user_id: str
    text: str