from langchain_groq import ChatGroq
# Initialize the LLM (Groq model)
course_llm = ChatGroq(
    model="llama3-groq-70b-8192-tool-use-preview",
    groq_api_key="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",
    temperature=0
)