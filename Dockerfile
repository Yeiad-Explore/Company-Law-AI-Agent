# Company Law AI Agent - Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p company_documents pdfs

# Expose ports
EXPOSE 8000 8501

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting Company Law AI Agent..."\n\
echo "Backend: http://localhost:8000"\n\
echo "Frontend: http://localhost:8501"\n\
echo "API Docs: http://localhost:8000/docs"\n\
echo ""\n\
echo "Starting FastAPI backend..."\n\
python main.py &\n\
echo "Starting Streamlit frontend..."\n\
streamlit run streamlit_app.py --server.port 8501 --server.address 0.0.0.0\n\
' > start.sh && chmod +x start.sh

# Default command
CMD ["./start.sh"]
