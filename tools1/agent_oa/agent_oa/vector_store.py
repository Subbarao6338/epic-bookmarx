import os
import openai
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

def embed_and_store_in_faiss(chunks, index_path, api_key, embedding_model):
    openai.api_key = api_key

    # Create an instance of the OpenAIEmbeddings class with the API key
    embeddings = OpenAIEmbeddings(model=embedding_model, openai_api_key=api_key)

    # Attempt to load an existing index if it exists
    if os.path.exists(index_path):
        try:
            vectorstore = FAISS.load_local(index_path, embeddings)
            print(f"Loaded FAISS index from {index_path}")
        except Exception as e:
            print(f"Failed to load FAISS index from {index_path}: {e}. Creating a new index.")
            vectorstore = FAISS.from_documents(chunks, embeddings)
            vectorstore.save_local(index_path)
    else:
        vectorstore = FAISS.from_documents(chunks, embeddings)
        vectorstore.save_local(index_path)
        print(f"Created and saved new FAISS index at {index_path}")

    return vectorstore
