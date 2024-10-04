from langchain import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
import json

class Teacher:

    def __init__(self,llm,redis_store):
        self.llm=llm
        self.redis_store=redis_store

    # Function to convert message objects to JSON serializable format
    def message_to_dict(self,message):
        if isinstance(message, SystemMessage):
            return {"type": "system", "content": message.content}
        elif isinstance(message, HumanMessage):
            return {"type": "human", "content": message.content}
        elif isinstance(message, AIMessage):
            return {"type": "ai", "content": message.content}
        return None

    # Function to convert JSON back to message objects
    def dict_to_message(self,message_dict):
        if message_dict["type"] == "system":
            return SystemMessage(content=message_dict["content"])
        elif message_dict["type"] == "human":
            return HumanMessage(content=message_dict["content"])
        elif message_dict["type"] == "ai":
            return AIMessage(content=message_dict["content"])
        return None

    # Function to retrieve chat history from Redis
    async def get_chat_history(self, user_id: str):
      
        user_data = await self.redis_store.get(user_id)
        if user_data:
            user_data = json.loads(user_data)
            chat_history = user_data.get("chats", [])
            return [self.dict_to_message(item) for item in chat_history]
        return []

    # Function to save chat history to Redis
    async def save_chat_history(self, user_id: str, chat_history):
      
        history_dict = [self.message_to_dict(msg) for msg in chat_history]
        user_data = await self.redis_store.get(user_id)

        user_data=json.loads(user_data) if user_data else {}

        user_data["chats"] = history_dict

        await self.redis_store.set(user_id, json.dumps(user_data))
    
    async def teacher_chain_response(self,user_input,chat_history,md_content):
       

        template = """
        You are an engaging and interactive virtual teacher. Your goal is to create a natural and friendly conversation with the student. Follow these guidelines:

1. Warmly welcome the student by name and express excitement for the lesson.
2. Ask the student if they have any prior knowledge about the subtopic using open-ended questions.
3. Teach the content clearly, subheading by subheading, keeping the explanation concise and relevant to the subtopic. Avoid overly long explanations. Stick to the key points, and give brief but complete answers for each subheading.
4. After each subheading, pause and ask if the student has questions or thoughts. Use transitions like "Let's begin with..." or "Next, we'll discuss..." to smoothly move to the next subheading.
5. If the student seems confused, simplify the concept without extending the explanation unnecessarily.
6. Before moving on to the next subheading, check if the student has any familiarity with it in a conversational tone.
7. End the lesson by giving positive reinforcement and showing enthusiasm for the next session.
8. Maintain a single paragraph response format, with no excessive paragraph breaks, while still making natural pauses between subheadings.
9. Keep the responses at a suitable length for each subheading, ensuring they are detailed enough to explain the concept but not too long.

        content from which you have to teach:
        {md_content}
        """
        template=template.format(md_content=md_content)
        # Create the prompt template including the chat history placeholder
        prompt = ChatPromptTemplate.from_messages(
                    [
                        SystemMessage(content=template),

                        MessagesPlaceholder(variable_name="chat_history"),

                        HumanMessagePromptTemplate.from_template("{human_input}"),
                    ]
                )

        # Create the LLM chain (single instance can be reused)
        conversation_chain = LLMChain(llm=self.llm, prompt=prompt)
        teacher_response = conversation_chain({"human_input": user_input, "chat_history": chat_history})
        return teacher_response
    
    async def teacher_response(self,user_id:str,user_input):
        user_data= await self.redis_store.get(user_id)
        if not user_data:
            return None
        else:
            md_content=json.loads(user_data)["md_content"]
            # Retrieve chat history from Redis
            chat_history = await self.get_chat_history(user_id)

            # Get the AI response with the formatted chat history
            response = await self.teacher_chain_response(user_input,chat_history,md_content)
            
            # Update chat history with new messages
            chat_history.append(HumanMessage(content=user_input))
            chat_history.append(AIMessage(content=response["text"]))

            # Save updated chat history back to Redis
            await self.save_chat_history(user_id, chat_history)
        
            return response