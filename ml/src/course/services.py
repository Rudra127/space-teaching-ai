from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage
import json
#loader = Docx2txtLoader("/content/planet.docx")
#documents = loader.load()

from src.db.redis_store import store as redisStore

# RAG class
class RAG:

    def __init__(self, llm, vector_store):
        self.llm = llm
        self.vector_store = vector_store
        self.retriever = self.vector_store.as_retriever()


    def chunk_data(self,document,chunk_size=2000, chunk_overlap=100):

        text_splitter = RecursiveCharacterTextSplitter(separators=["\n\n", "\n"], chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        doc_chunks = text_splitter.split_documents(document)

        return doc_chunks

    def store_document_in_vector_store(self,document):
      
       
        doc_chunks = self.chunk_data(document)
        self.vector_store.add_documents(doc_chunks)

    async def reset_chat_if_exists(self, user_id):
        
        user_data = await redisStore.get(user_id)
        if user_data:
            user_data = json.loads(user_data) 
            if "chat" in user_data:
                user_data["chat"] = [] 
                self.redis_client.set(user_id, json.dumps(user_data))

    def retrieve_answer(self, question, heading):
        
        matching_docs = self.retriever.get_relevant_documents(question)

        context = " ".join([doc.page_content for doc in matching_docs]) if matching_docs else  ""
        
        template="""You are an expert educational content generator specializing in creating Markdown-formatted course materials. Your task is to generate detailed, structured, and relevant content based on the provided subtopic, ensuring that all information is directly related to the subtopic given {heading}. The content should dynamically adapt to the subtopic provided and exclude any irrelevant information.

        **Guidelines:**
        1. **Introduction**: Start with a clear introduction that sets the context of the subtopic provided.
        3. **Logical Subheadings**: Create subheadings that organize the content logically, ensuring each section is relevant and directly addresses the subtopic.
        4. **Detailed Explanations**:
        - use your own wordings to make content understandable in more detailed way.
        - Provide clear  explanations under each subheading, using all the relevant parts of the provided content.
        - **Expand descriptions to provide detailed, informative, and student-friendly explanations**. For example, if mentioning a mission like "Kepler," describe not only its method but also its impact, findings, and significance in the context of exoplanet research.
        5. **Image Link Handling**: Extract all image links from the provided content. Look for text patterns such as `Image link:` followed by a URL and any direct URLs, and handle them as follows:
        - For each identified image link, use the format `![image alt text](image-url)`, ensuring no modifications to the URLs.
        - Place each image in the relevant section of the content based on context.
        - If an image description is missing, use a generic description like "Image related to [context]" for clarity.
        6. **Conclusion**: Summarize the key points covered, focusing on what students learned about the specific subtopic.
        7. **Markdown Formatting**:
        - Use `#` for the **main heading** (Lesson title).
        - Use `##` for **subheadings** (e.g., Learning Objectives, Key Takeaways).
        - Use `-` or `*` for **bulleted lists** (e.g., objectives or steps).
        - Use `1.`, `2.`, etc., for **numbered lists** (e.g., steps in a process or quiz questions).
        - Use backticks (`) for inline code formatting if necessary.
        - Use **bold** text using `**` and *italic* text using `_` where appropriate.
        - Include links and images formatted like `![image alt text](image-url)`.
        8. **File Formatting Guidelines**:
        - Ensure proper spacing between headings, paragraphs, and lists for readability.
        - The final document should be saved in `.md` format.

        **Constraints:**
        - Dynamically adapt the content to the subtopic provided, strictly including only relevant information.
        - Exclude unrelated content that does not directly pertain to the subtopic.
        - **Expand on descriptions, ensuring they are informative, well-explained, and give students a crystal-clear understanding**.
        - **Ensure any provided image links (starting with "Image link:") or direct URLs are formatted in Markdown and inserted at the correct position without changes to the URLs**.
        - Focus on enhancing explanations with clear and student-friendly wording.


        Provided Content:
        {context}

        ---

        """

        prompt = ChatPromptTemplate.from_template(template)
       
        prompt_input = prompt.format(context=context,heading=heading)

        message = HumanMessage(content=prompt_input)

        model_response = self.llm([message])
        readable_answer = model_response.content

        return readable_answer

