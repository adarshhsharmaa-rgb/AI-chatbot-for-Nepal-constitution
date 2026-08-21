from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.chroma_client import get_chroma_client
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import os
from dotenv import load_dotenv

from app.utils import get_intent

load_dotenv()

app = FastAPI()

# -----------------------------
# Environment Variables
# -----------------------------

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# -----------------------------
# CORS
# -----------------------------

origins = [
    "http://localhost:3000",
    FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# AI Models
# -----------------------------

model = SentenceTransformer(
    "all-MiniLM-L6-v2",
    device="cpu"
)

genai.configure(api_key=GEMINI_API_KEY)

gemini = genai.GenerativeModel(
    "gemini-2.0-flash-001"
)

# -----------------------------
# ChromaDB
# -----------------------------

client = get_chroma_client()
collection = client.get_collection("documents")

# -----------------------------
# Request Model
# -----------------------------

class QueryRequest(BaseModel):
    prompt: str

# -----------------------------
# Routes
# -----------------------------

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/query")
async def handle_query(request_body: QueryRequest):

    # Classify query intent
    intent = get_intent(request_body.prompt)

    # Generate semantic embedding
    query_embedding = model.encode(
        request_body.prompt
    ).tolist()

    # Retrieve relevant documents
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5,
        where={
            "$or": [
                {
                    "intent1": intent[0]
                },
                {
                    "intent2": intent[1]
                }
            ]
        }
    )

    # Build context
    context = "\n\n".join(
        results["documents"][0]
    )

    # Generate response
    response = gemini.generate_content(
        f"""
Context:
{context}

Question:
{request_body.prompt}

Answer:
"""
    )

    return {
        "response": response.text
    }


# -----------------------------
# Run Server
# -----------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8001"))

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port
    )