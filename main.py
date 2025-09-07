from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Literal, List, Dict
import os
import asyncio
from datetime import datetime
import logging
from contextlib import asynccontextmanager
from collections import deque

# Document processing
import PyPDF2
from docx import Document as DocxDocument

# LangChain components
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI

# Tavily search integration
from tavily import TavilyClient

# Advanced chunking and processing
from langchain.schema import Document as LangchainDocument

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Set API keys - use environment variables for security
# These will be None if not set, which is handled gracefully by the LLM providers
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events"""
    # Startup
    try:
        # Initialize Tavily
        initialize_tavily()
        
        documents_folder = "company_documents"
        
        if not os.path.exists(documents_folder):
            os.makedirs(documents_folder)
            logger.info(f"Created {documents_folder} folder. Please add your company law documents there.")
        else:
            # Check if there are documents
            files = [f for f in os.listdir(documents_folder) if os.path.isfile(os.path.join(documents_folder, f))]
            if files:
                num_docs, num_chunks = initialize_rag_system(documents_folder)
                logger.info(f"RAG system initialized with {num_docs} documents and {num_chunks} chunks")
            else:
                logger.info("No documents found in company_documents folder")
        
    except Exception as e:
        logger.error(f"Error initializing system: {e}")
    
    yield
    
    # Shutdown (if needed)
    logger.info("Shutting down Company Law AI Agent")

app = FastAPI(
    title="Company Law AI Agent - Fast Version", 
    description="Simplified RAG system for faster responses",
    version="2.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuestionRequest(BaseModel):
    question: str = Field(..., description="Legal question")
    llm_provider: Literal["openai", "groq", "gemini"] = Field(default="groq")  # Default to Groq for speed
    model_name: Optional[str] = None
    use_web_search: bool = Field(default=True, description="Whether to include web search")  # Default to True
    max_search_results: int = Field(default=3, description="Maximum web search results")

class SearchResult(BaseModel):
    title: str
    url: str
    content: str
    relevance_score: float

class QuestionResponse(BaseModel):
    answer: str
    internal_database_answer: str = ""
    web_search_answer: str = ""
    status: str
    llm_used: str
    sources_used: List[str] = []
    web_search_results: List[SearchResult] = []
    processing_time: float = 0.0

class SystemStatus(BaseModel):
    status: str
    message: str
    documents_loaded: int = 0
    chunks_created: int = 0
    last_updated: Optional[str] = None

# Global variables
vector_store = None
retriever = None
tavily_client = None
system_status = {
    "documents_loaded": 0,
    "chunks_created": 0,
    "last_updated": None
}

# Memory context for conversation continuity
conversation_memory = deque(maxlen=10)  # Store last 10 Q&A pairs

def initialize_tavily():
    """Initialize Tavily search client"""
    global tavily_client
    try:
        tavily_api_key = os.getenv("TAVILY_API_KEY")
        if tavily_api_key and tavily_api_key != "your-tavily-key":
            tavily_client = TavilyClient(api_key=tavily_api_key)
            logger.info("Tavily client initialized successfully")
        else:
            logger.warning("Tavily API key not provided - web search will be disabled")
    except Exception as e:
        logger.error(f"Failed to initialize Tavily client: {e}")
        tavily_client = None

def get_llm(provider: str, model_name: Optional[str] = None):
    """Get the appropriate LLM based on provider"""
    
    if provider == "openai":
        model = model_name or "gpt-4o-mini"
        return ChatOpenAI(
            model=model, 
            temperature=0.1,
            max_tokens=1500  # Reduced for faster response
        ), f"OpenAI ({model})"
    
    elif provider == "groq":
        # Groq is MUCH faster than OpenAI
        model = model_name or "llama-3.3-70b-versatile"  # Using a faster model
        return ChatGroq(
            model=model, 
            temperature=0.1,
            max_tokens=1500
        ), f"Groq ({model})"
    
    elif provider == "gemini":
        model = model_name or "gemini-1.5-flash"
        return ChatGoogleGenerativeAI(
            model=model, 
            temperature=0.1,
            max_output_tokens=1500
        ), f"Gemini ({model})"
    
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text.strip():
                    text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
    except Exception as e:
        logger.error(f"Error extracting text from PDF {pdf_path}: {e}")
    return text.strip()

def extract_text_from_docx(docx_path: str) -> str:
    """Extract text from DOCX files"""
    try:
        doc = DocxDocument(docx_path)
        text = ""
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from DOCX {docx_path}: {e}")
        return ""

def simple_text_chunking(text: str, filename: str) -> List[LangchainDocument]:
    """Simplified text chunking for faster processing"""
    
    # Single chunking strategy - optimized for speed
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,  # Slightly smaller for better relevance
        chunk_overlap=200,  # Less overlap for fewer chunks
        separators=["\n\n", "\n", ". ", ", ", " "]
    )
    
    chunks = splitter.create_documents([text])
    for i, chunk in enumerate(chunks):
        chunk.metadata = {
            "source": filename,
            "chunk_id": f"{filename}_{i}"
        }
    
    return chunks

async def web_search_tavily(query: str, max_results: int = 3) -> List[SearchResult]:
    """Perform web search using Tavily - simplified"""
    if not tavily_client:
        return []
    
    try:
        response = await asyncio.to_thread(
            tavily_client.search,
            query=f"company law {query}",  # Simplified query
            search_depth="basic",  # Using basic instead of advanced for speed
            max_results=max_results
        )
        
        search_results = []
        for result in response.get("results", []):
            search_results.append(SearchResult(
                title=result.get("title", ""),
                url=result.get("url", ""),
                content=result.get("content", "")[:500],  # Limit content length
                relevance_score=result.get("score", 0.0)
            ))
        
        return search_results
    
    except Exception as e:
        logger.error(f"Web search error: {e}")
        return []

def initialize_rag_system(documents_folder_path: str):
    """Initialize simplified RAG system"""
    global vector_store, retriever, system_status
    
    supported_extensions = ['.pdf', '.docx', '.txt']
    document_files = []
    
    for filename in os.listdir(documents_folder_path):
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext in supported_extensions:
            document_files.append(os.path.join(documents_folder_path, filename))
    
    if not document_files:
        raise Exception(f"No supported documents found. Supported formats: {supported_extensions}")
    
    # Extract text from all documents
    all_chunks = []
    
    for doc_path in document_files:
        filename = os.path.basename(doc_path)
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext == '.pdf':
            text = extract_text_from_pdf(doc_path)
        elif file_ext == '.docx':
            text = extract_text_from_docx(doc_path)
        elif file_ext == '.txt':
            with open(doc_path, 'r', encoding='utf-8') as f:
                text = f.read()
        else:
            continue
        
        if text.strip():
            chunks = simple_text_chunking(text, filename)
            all_chunks.extend(chunks)
    
    if not all_chunks:
        raise Exception("No text content extracted from documents")
    
    # Create embeddings - using smaller, faster model
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",  # Smaller, faster model
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    
    # Create FAISS vector store
    vector_store = FAISS.from_documents(all_chunks, embeddings)
    
    # Simple retriever - no compression or ensemble for speed
    retriever = vector_store.as_retriever(
        search_type="similarity",  # Simple similarity search
        search_kwargs={"k": 5}  # Retrieve only 5 chunks for speed
    )
    
    system_status.update({
        "documents_loaded": len(document_files),
        "chunks_created": len(all_chunks),
        "last_updated": datetime.now().isoformat()
    })
    
    logger.info(f"RAG initialized: {len(document_files)} docs, {len(all_chunks)} chunks")
    return len(document_files), len(all_chunks)

def create_simple_prompt_template() -> ChatPromptTemplate:
    """Create simplified prompt template"""
    
    template = """You are a Company Law AI Assistant. Provide accurate, practical legal guidance.

Context from documents:
{context}

Web search results (if any):
{web_results}

Question: {question}

Provide a clear, concise, and actionable response. Focus on the most important points."""

    return ChatPromptTemplate.from_template(template)

def create_internal_database_prompt_template() -> ChatPromptTemplate:
    """Create prompt template for internal database responses"""
    
    template = """You are a Company Law AI Assistant. Answer based ONLY on the provided internal documents.

Previous conversation context:
{memory_context}

Context from internal documents:
{context}

Question: {question}

Provide a comprehensive answer based ONLY on the internal documents. If the information is not available in the documents, state that clearly.

Answer:"""
    
    return ChatPromptTemplate.from_template(template)

def create_web_search_prompt_template() -> ChatPromptTemplate:
    """Create prompt template for web search responses"""
    
    template = """You are a Company Law AI Assistant. Answer based on web search results and general legal knowledge.

Previous conversation context:
{memory_context}

Web search results:
{web_results}

Question: {question}

Provide additional insights, recent updates, or supplementary information based on the web search results. If no relevant web results are available, provide general legal guidance.

Answer:"""
    
    return ChatPromptTemplate.from_template(template)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Company Law AI Agent (Fast Version) is running",
        "status": "healthy",
        "version": "2.1.0"
    }

@app.get("/status", response_model=SystemStatus)
async def get_status():
    """Get system status"""
    if retriever is None:
        return SystemStatus(
            status="not_initialized",
            message="RAG system not initialized - please add documents to company_documents folder"
        )
    
    return SystemStatus(
        status="ready",
        message="Company Law AI Agent ready",
        documents_loaded=system_status["documents_loaded"],
        chunks_created=system_status["chunks_created"],
        last_updated=system_status["last_updated"]
    )

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """Ask a legal question with two-paragraph response system"""
    start_time = datetime.now()
    
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Get LLM
        llm, llm_description = get_llm(request.llm_provider, request.model_name)
        
        # Get memory context from recent conversations
        memory_context = ""
        if conversation_memory:
            recent_qa = list(conversation_memory)[-3:]  # Last 3 Q&A pairs
            memory_context = "\n".join([f"Q: {qa['question']}\nA: {qa['answer'][:200]}..." for qa in recent_qa])
        
        # PARAGRAPH 1: Internal Database Response
        internal_context = "No document context available."
        sources_used = []
        
        if retriever is not None:
            try:
                docs = await asyncio.to_thread(retriever.invoke, request.question)
                if docs:
                    internal_context = "\n---\n".join([doc.page_content for doc in docs[:5]])
                    sources_used = list(set([doc.metadata.get('source', 'Unknown') for doc in docs]))
            except Exception as e:
                logger.error(f"Retrieval error: {e}")
        
        # Generate internal database response
        internal_prompt = create_internal_database_prompt_template()
        internal_formatted_prompt = internal_prompt.format(
            memory_context=memory_context,
            context=internal_context,
            question=request.question
        )
        
        internal_response = await asyncio.to_thread(llm.invoke, internal_formatted_prompt)
        internal_answer = internal_response.content if hasattr(internal_response, 'content') else str(internal_response)
        
        # PARAGRAPH 2: Web Search Response
        web_results = []
        web_context = "No web search results available."
        web_answer = "No additional information available from web search."
        
        if request.use_web_search and tavily_client:
            try:
                web_results = await web_search_tavily(request.question, request.max_search_results)
                if web_results:
                    web_context = "\n".join([f"- {r.title}: {r.content[:200]}" for r in web_results[:3]])
                    
                    # Generate web search response
                    web_prompt = create_web_search_prompt_template()
                    web_formatted_prompt = web_prompt.format(
                        memory_context=memory_context,
                        web_results=web_context,
                        question=request.question
                    )
                    
                    web_response = await asyncio.to_thread(llm.invoke, web_formatted_prompt)
                    web_answer = web_response.content if hasattr(web_response, 'content') else str(web_response)
            except Exception as e:
                logger.error(f"Web search error: {e}")
                web_answer = "Unable to retrieve additional information from web search."
        
        # Combine both responses
        combined_answer = f"**Based on Internal Documents:**\n\n{internal_answer}\n\n**Additional Information from Web Search:**\n\n{web_answer}"
        
        # Store in conversation memory
        conversation_memory.append({
            "question": request.question,
            "answer": combined_answer,
            "timestamp": datetime.now().isoformat()
        })
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return QuestionResponse(
            answer=combined_answer,
            internal_database_answer=internal_answer,
            web_search_answer=web_answer,
            status="success",
            llm_used=llm_description,
            sources_used=sources_used[:3],
            web_search_results=web_results[:3],
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/bulk-questions")
async def process_bulk_questions(questions: List[str], llm_provider: str = "groq"):
    """Process multiple questions - using fast defaults"""
    if not questions:
        raise HTTPException(status_code=400, detail="No questions provided")
    
    results = []
    for question in questions[:5]:  # Limit to 5 questions for bulk
        try:
            request = QuestionRequest(
                question=question,
                llm_provider=llm_provider,
                use_web_search=False  # No web search for bulk
            )
            result = await ask_question(request)
            results.append({"question": question, "result": result})
        except Exception as e:
            results.append({"question": question, "error": str(e)})
    
    return {"processed": len(results), "results": results}

@app.get("/search-capabilities")
async def get_search_capabilities():
    """Get information about search capabilities"""
    return {
        "web_search_enabled": tavily_client is not None,
        "retrieval_method": "Simple Similarity Search",
        "supported_documents": [".pdf", ".docx", ".txt"],
        "embedding_model": "all-MiniLM-L6-v2 (Fast)",
        "default_llm": "Groq (llama-3.3-70b-versatile)",
        "memory_enabled": True,
        "memory_size": len(conversation_memory),
        "optimizations": [
            "Two-paragraph response system",
            "Conversation memory context",
            "Internal database + web search",
            "Simplified chunking",
            "No compression retriever",
            "Smaller embedding model",
            "Reduced chunk count"
        ]
    }

@app.post("/clear-memory")
async def clear_conversation_memory():
    """Clear conversation memory"""
    global conversation_memory
    conversation_memory.clear()
    return {"message": "Conversation memory cleared successfully", "status": "success"}

@app.get("/memory-status")
async def get_memory_status():
    """Get conversation memory status"""
    return {
        "memory_size": len(conversation_memory),
        "max_memory": conversation_memory.maxlen,
        "recent_questions": [qa["question"] for qa in list(conversation_memory)[-5:]]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8000,
        log_level="info",
        reload=True
    )