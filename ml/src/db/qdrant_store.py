from langchain.vectorstores import Qdrant
import qdrant_client
from langchain_community.embeddings import HuggingFaceEmbeddings
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-base-zh-v1.5")
# Initialize Qdrant client and vector store
client = qdrant_client.QdrantClient(
    url="https://22947d07-2eb1-420a-8811-be91e3977516.europe-west3-0.gcp.cloud.qdrant.io",
    api_key="z4Geuytmf-lXPO2GCWlfuD6e8rb4jo9hXdLtTmSgUT_QIpCkjafC5w"
)

# Vector configuration
vector_config = qdrant_client.http.models.VectorParams(
    size=768,
    distance=qdrant_client.http.models.Distance.COSINE
)
collection_name = "nasavectorstores"
# Recreate the collection in Qdrant
if client.collection_exists(collection_name)==False:
    client.create_collection(
          collection_name=collection_name,
          vectors_config=vector_config
      )



# Initialize the vector store
store = Qdrant(
    client=client,
    collection_name="nasavectorstores",
    embeddings=embeddings
)