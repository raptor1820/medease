from urllib.parse import quote_plus
import pymongo
from pymongo import MongoClient
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core.settings import Settings
from datasets import load_dataset
import json
import os
from dotenv import load_dotenv
import pandas as pd
from llama_index.core import Document
# Include this import to avoid MetadataMode error
from llama_index.core.schema import MetadataMode
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.core import VectorStoreIndex
# Load dataset from Hugging Face


load_dotenv()
dataset = load_dataset("wasiqnauman/medical-diagnosis-synthetic")

# Convert the dataset to a pandas dataframe
dataset_df = pd.DataFrame(dataset['train'])

# Remove rows where 'query' column is missing
dataset_df = dataset_df.dropna(subset=['input'])

# **LIMIT to the first 20 rows**
dataset_df = dataset_df.head(100)

# print("\nNumber of missing values in each column after removal:")
# print(dataset_df.isnull().sum())

# Initialize the OpenAI embedding model and LLM
llm = OpenAI(
    api_key=os.getenv("AI_API_KEY")
)
embed_model = OpenAIEmbedding(model="text-embedding-ada-002")

# Set up embedding and LLM in the settings
Settings.llm = llm
Settings.embed_model = embed_model

# Convert dataframe to a JSON list of dictionaries
data = dataset_df.to_json(orient="records")
docs_list = json.loads(data)  # Now, docs_list is a list of dictionaries

llama_docs = []


def shorten_metadata(metadata, max_len=500):
    for key, value in metadata.items():
        if isinstance(value, str) and len(value) > max_len:
            metadata[key] = value[:max_len] + \
                "..."  # Truncate and add ellipsis
    return metadata


# Loop over each document in the docs_list
for doc in docs_list:
    # Serialize 'query' and 'answer' in case they contain special characters
    doc["input"] = json.dumps(doc["input"])
    doc["output"] = json.dumps(doc["output"])

    doc = shorten_metadata(doc)

    # Create a Document object for each entry
    llama_doc = Document(
        text=doc["input"] + "\n" + doc["output"],
        metadata=doc,  # 'answer' will be part of metadata
        # Formatting metadata as 'key=>value'
        metadata_template="{key}=>{value}",
        # Custom template
        text_template="Metadata: {metadata_str}\n-----\nContent: {content}",
    )

    llama_docs.append(llama_doc)

# Observing an example of what the LLM and Embedding model receive as input
# print("\nThe LLM sees this: \n", llama_docs[0].get_content(
#     metadata_mode=MetadataMode.LLM))
# print("\nThe Embedding model sees this: \n",
#       llama_docs[0].get_content(metadata_mode=MetadataMode.EMBED))

# Define maximum token limit for the model
max_tokens = 8191  # Adjust this value based on the model's context limit

parser = SentenceSplitter(chunk_size=2000, chunk_overlap=200)
nodes = parser.get_nodes_from_documents(llama_docs)

for node in nodes:
    try:
        content = node.get_content(metadata_mode=MetadataMode.EMBED)

        if content is not None:
            # Truncate content if it exceeds max_tokens
            # Token length check (considering words as tokens)
            if len(content.split()) > max_tokens:
                # Truncate to the max_tokens limit
                content = ' '.join(content.split()[:max_tokens])

            node_embedding = embed_model.get_text_embedding(content)
            if node_embedding is not None:
                node.embedding = node_embedding
            else:
                print(f"Warning: Embedding for node {node} is None")
        else:
            print(f"Warning: Content for node {node} is None")
    except Exception as e:
        print(f"Error processing node {node}: {e}")
# print(nodes[0].get_content())


def get_mongo_client(mongo_uri):
    """Establish connection to the MongoDB."""
    try:
        client = pymongo.MongoClient(mongo_uri)
        print("Connection to MongoDB successful")
        return client
    except pymongo.errors.ConnectionFailure as e:
        print(f"Connection failed: {e}")
        return None


DB_NAME = "hackgt11-rag-vector-db"
COLLECTION_NAME = "hackgt11-collections"
username = quote_plus("asao6")
password = quote_plus("JpztdWCT1Fp6mNvN")
mongo_uri = f"mongodb+srv://{username}:{password}@hackgt-cluster.7tzme.mongodb.net/{DB_NAME}"
if not mongo_uri:
    print("MONGO_URI not set in environment variables")

mongo_client = MongoClient(mongo_uri)

db = mongo_client[DB_NAME]
collection = db[COLLECTION_NAME]

vector_store = MongoDBAtlasVectorSearch(
    mongo_client, db_name=DB_NAME, collection_name=COLLECTION_NAME, vector_index_name="vector_index")
vector_store.add(nodes)

index = VectorStoreIndex.from_vector_store(vector_store)

count = collection.count_documents({})
# print(f"Number of documents in collection: {count}")

# print("Nodes added to vector store:")
# for node in nodes:
#     print(node.get_content(metadata_mode=MetadataMode.EMBED))

# query the RAG system
# Searching for text in 'input' field
query = {"metadata.input": {
    "$regex": ".*I have a sore throat, mild fever, and feel very tired. My throat hurts when I swallow.*"}}

# Query the collection
documents = collection.find_one(query, {"metadata.output": 1})

# Print the matching documents
# print("Documents found:")
# print(documents)

output = documents["metadata"]["output"]

cleaned_output = output.strip('""').replace("\\n", "\n")

# print(cleaned_output)


def get_metadata_output(someText):
    someText = someText.strip()
    """Query the RAG system and return metadata output for a given input text."""
    try:
        # Create a regex-based query for MongoDB
        query = {"metadata.input": {"$regex": f".*{someText}.*",
                                    "$options": "i"}}  # Case-insensitive search

        # Query MongoDB collection
        document = collection.find_one(query, {"metadata.output": 1})

        # If document is found, extract and clean the output
        if document:
            output = document["metadata"]["output"]
            cleaned_output = str(output).strip('""').replace("\\n", "\n")
            return cleaned_output
        else:
            return str("No matching document found in the RAG system.")

    except Exception as e:
        return str(f"Error occurred while retrieving metadata: {e}")
