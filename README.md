# Veridic AI - Legal Compliance Assistant

A modern AI-powered legal compliance system that combines internal document analysis with real-time web search to provide comprehensive legal guidance for company law, corporate governance, and compliance matters.

## 🚀 Features

### Core Capabilities

- **Two-Paragraph Response System**: Answers from internal documents + web search
- **Conversation Memory**: Maintains context across chat sessions
- **Document Analysis**: Processes PDF, DOCX, and text files
- **Real-time Web Search**: Supplements answers with current information
- **Plain Text Display**: Clean, readable responses without markdown formatting
- **Multi-Model AI**: Supports OpenAI, Groq, and Google Gemini

### Technical Features

- **FastAPI Backend**: High-performance Python API
- **Next.js Frontend**: Modern React-based user interface
- **RAG System**: Retrieval Augmented Generation with FAISS vector search
- **Memory Management**: Conversation context with configurable history
- **CORS Support**: Cross-origin requests enabled
- **Docker Support**: Containerized deployment ready

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │    │   FastAPI API   │    │   AI Models     │
│   (Port 3000)   │◄──►│   (Port 8000)   │◄──►│   (OpenAI/Groq) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Document DB   │
                       │   (FAISS)       │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Web Search    │
                       │   (Tavily)      │
                       └─────────────────┘
```

## 📦 Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git

### Quick Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Law-Agent
   ```

2. **Run the automated setup script**

   ```bash
   chmod +x setup-veridic-ai.sh
   ./setup-veridic-ai.sh
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Start the system**
   ```bash
   ./start-veridic-ai.sh
   ```

### Manual Setup

#### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your API keys

# Start backend
python main.py
```

#### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# AI Model API Keys
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Web Search
TAVILY_API_KEY=your_tavily_api_key_here
```

### API Keys Setup

1. **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Groq**: Get your API key from [Groq Console](https://console.groq.com/keys)
3. **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **Tavily**: Get your API key from [Tavily](https://tavily.com/)

## 🚀 Usage

### Starting the System

1. **Full System** (Backend + Frontend):

   ```bash
   ./start-veridic-ai.sh
   ```

2. **Backend Only**:

   ```bash
   ./start-backend.sh
   ```

3. **Frontend Only**:
   ```bash
   ./start-frontend.sh
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Chat Interface**: http://localhost:3000/dashboard
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/status

### Using the Chat Interface

1. **Navigate to Chat**: Go to http://localhost:3000/dashboard
2. **Ask Questions**: Type your legal questions in the chat interface
3. **View Responses**: Get two-paragraph responses:
   - **Internal Documents**: Based on your uploaded legal documents
   - **Web Search**: Additional current information from the web
4. **Memory Context**: The system remembers previous conversations
5. **Export Chat**: Download your conversation history

## 📁 Project Structure

```
Law-Agent/
├── app/                    # Next.js frontend
│   ├── dashboard/         # Chat interface
│   ├── features/          # Features page
│   ├── pricing/           # Pricing page
│   └── ...
├── components/            # React components
│   ├── dashboard/         # Chat components
│   └── ui/               # UI components
├── hooks/                # React hooks
├── lib/                  # Utilities and API
├── company_documents/    # Legal documents (PDF/DOCX)
├── main.py              # FastAPI backend
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
├── setup-veridic-ai.sh  # Automated setup script
└── README.md           # This file
```

## 🔌 API Endpoints

### Core Endpoints

- `POST /ask` - Ask legal questions
- `GET /status` - System status
- `GET /memory-status` - Conversation memory status
- `POST /clear-memory` - Clear conversation memory

### Document Management

- `POST /upload` - Upload documents
- `GET /documents` - List uploaded documents
- `DELETE /documents/{id}` - Delete document

### System Information

- `GET /search-capabilities` - Available search features
- `POST /bulk-questions` - Process multiple questions

## 🛠️ Development

### Backend Development

```bash
# Activate virtual environment
source venv/bin/activate

# Install development dependencies
pip install -r requirements.txt

# Run with auto-reload
python main.py
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run individual services
docker-compose up backend
docker-compose up frontend
```

## 🔒 Security

- **API Key Protection**: All API keys stored in environment variables
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Input Validation**: All inputs validated and sanitized
- **Memory Management**: Conversation history limited to prevent memory leaks

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**:

   - Check if port 8000 is available
   - Verify Python virtual environment is activated
   - Check API keys in `.env` file

2. **Frontend not connecting**:

   - Ensure backend is running on port 8000
   - Check CORS configuration
   - Verify API URL in frontend configuration

3. **Memory issues**:
   - Clear conversation memory using `/clear-memory` endpoint
   - Restart the backend service

### Logs and Debugging

- **Backend logs**: Check terminal output when running `python main.py`
- **Frontend logs**: Check browser console for errors
- **API testing**: Use http://localhost:8000/docs for API testing

## 📈 Performance

- **Response Time**: Typically 3-5 seconds per query
- **Memory Usage**: Optimized with conversation history limits
- **Document Processing**: Supports files up to 10MB
- **Concurrent Users**: Supports multiple simultaneous users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the troubleshooting section above
- Review the API documentation at http://localhost:8000/docs
- Open an issue in the repository

## 🔄 Version History

- **v2.1.0** - Two-paragraph response system, memory context, simplified UI
- **v2.0.0** - Next.js frontend, FastAPI backend, RAG system
- **v1.0.0** - Initial Streamlit-based version

---

**Veridic AI** - Making legal compliance accessible, reliable, and intelligent. ⚖️🤖
