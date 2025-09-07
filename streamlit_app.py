# streamlit_app.py - Modern Company Law AI Agent Interface
import streamlit as st
import requests
import json
import time
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
from typing import Optional, Dict, List

# FastAPI backend URL
API_URL = "http://localhost:8000"

# Page config with custom theme
st.set_page_config(
    page_title="Company Law AI Agent",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern styling
st.markdown("""
<style>
    /* Main container styling */
    .main > div {
        padding-top: 2rem;
    }
    
    /* Custom header styling */
    .header-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .header-title {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .header-subtitle {
        color: #f0f0f0;
        font-size: 1.2rem;
        font-weight: 300;
    }
    
    /* Chat message styling */
    .user-message {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 18px 18px 5px 18px;
        margin: 1rem 0;
        box-shadow: 0 2px 10px rgba(240, 147, 251, 0.3);
    }
    
    .assistant-message {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 18px 18px 18px 5px;
        margin: 1rem 0;
        box-shadow: 0 2px 10px rgba(79, 172, 254, 0.3);
    }
    
    .message-meta {
        font-size: 0.8rem;
        opacity: 0.8;
        margin-top: 0.5rem;
    }
    
    /* Status cards */
    .status-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        border-left: 4px solid #667eea;
        margin-bottom: 1rem;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    /* Form styling */
    .stSelectbox > div > div {
        border-radius: 8px;
        border: 2px solid #e0e0e0;
    }
    
    .stTextInput > div > div > input {
        border-radius: 8px;
        border: 2px solid #e0e0e0;
        padding: 0.75rem;
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    /* Sidebar styling */
    .css-1d391kg {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    /* Progress and loading animations */
    .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }
    
    .search-indicator {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #ff8a80;
    }
    
    /* Company info card */
    .company-card {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'llm_options' not in st.session_state:
    st.session_state.llm_options = {}
if 'company_info' not in st.session_state:
    st.session_state.company_info = None
if 'system_stats' not in st.session_state:
    st.session_state.system_stats = {}
if 'question_input' not in st.session_state:
    st.session_state.question_input = ""
if 'export_chat' not in st.session_state:
    st.session_state.export_chat = False

# Helper functions
def load_llm_options():
    """Load available LLM options - fallback to defaults since endpoint doesn't exist"""
    return {
        "providers": {
            "openai": {"models": ["gpt-4o", "gpt-4o-mini"], "default": "gpt-4o-mini"},
            "groq": {"models": ["deepseek-r1-distill-llama-70b"], "default": "deepseek-r1-distill-llama-70b"},
            "gemini": {"models": ["gemini-1.5-flash"], "default": "gemini-1.5-flash"}
        }
    }

def get_system_status():
    """Get current system status"""
    try:
        response = requests.get(f"{API_URL}/status", timeout=5)
        if response.status_code == 200:
            return response.json()
    except:
        pass
    return {"status": "error", "message": "Cannot connect to API"}

def create_status_chart(stats):
    """Create system status visualization"""
    if not stats or "documents_loaded" not in stats:
        return None
    
    fig = go.Figure()
    fig.add_trace(go.Indicator(
        mode = "gauge+number+delta",
        value = stats.get("documents_loaded", 0),
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Documents Loaded"},
        gauge = {
            'axis': {'range': [None, 50]},
            'bar': {'color': "darkblue"},
            'steps': [
                {'range': [0, 10], 'color': "lightgray"},
                {'range': [10, 25], 'color': "yellow"},
                {'range': [25, 50], 'color': "green"}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 40
            }
        }
    ))
    
    fig.update_layout(height=300, margin=dict(l=0, r=0, t=50, b=0))
    return fig

# Header Section
st.markdown("""
<div class="header-container">
    <div class="header-title">⚖️ Company Law AI Agent</div>
    <div class="header-subtitle">Your Intelligent Legal Assistant for Corporate Compliance & Governance</div>
</div>
""", unsafe_allow_html=True)

# Sidebar Configuration
with st.sidebar:
    st.markdown("### 🔧 System Configuration")
    
    # System Status Check
    status_data = get_system_status()
    st.session_state.system_stats = status_data
    
    if status_data["status"] == "ready":
        st.markdown('<div class="status-card">✅ <strong>System Ready</strong><br>All systems operational</div>', unsafe_allow_html=True)
        
        # Display system metrics
        col1, col2 = st.columns(2)
        with col1:
            st.markdown(f'<div class="metric-card"><h3>{status_data.get("documents_loaded", 0)}</h3><p>Documents</p></div>', unsafe_allow_html=True)
        with col2:
            st.markdown(f'<div class="metric-card"><h3>{status_data.get("chunks_created", 0)}</h3><p>Chunks</p></div>', unsafe_allow_html=True)
            
    elif status_data["status"] == "not_initialized":
        st.warning("⚠️ System Not Ready")
        st.info("Please add legal documents to the company_documents folder")
    else:
        st.error("❌ API Connection Failed")
        st.error("Make sure the FastAPI server is running on localhost:8000")
    
    st.markdown("---")
    
    # LLM Configuration
    st.markdown("### 🤖 AI Model Selection")
    
    llm_options = load_llm_options()
    st.session_state.llm_options = llm_options
    
    providers = list(llm_options["providers"].keys())
    provider_labels = {
        "openai": "🔵 OpenAI GPT",
        "groq": "🟢 Groq (Fast)",
        "gemini": "🔴 Google Gemini"
    }
    
    selected_provider = st.selectbox(
        "Choose AI Provider:",
        providers,
        format_func=lambda x: provider_labels.get(x, x),
        key="provider_select"
    )
    
    if selected_provider in llm_options["providers"]:
        models = llm_options["providers"][selected_provider]["models"]
        selected_model = st.selectbox(
            "Choose Model:",
            models,
            key="model_select"
        )
    else:
        selected_model = llm_options["providers"][selected_provider]["default"]
    
    # Web search toggle
    use_web_search = st.toggle("🌐 Enable Web Search", value=True, help="Search for latest legal information online")
    
    st.markdown("---")
    
    # Company Information Setup
    st.markdown("### 🏢 Company Information")
    
    with st.expander("Set Company Details", expanded=False):
        company_name = st.text_input("Company Name", placeholder="e.g., ABC Private Limited")
        company_industry = st.selectbox(
            "Industry",
            ["Technology", "Manufacturing", "Healthcare", "Finance", "Retail", "Construction", "Other"]
        )
        company_jurisdiction = st.selectbox(
            "Jurisdiction",
            ["India", "USA", "UK", "Canada", "Australia", "Other"]
        )
        company_type = st.selectbox(
            "Company Type",
            ["Private Limited", "Public Limited", "LLP", "Sole Proprietorship", "Partnership", "Other"]
        )
        
        if st.button("💾 Save Company Info"):
            st.session_state.company_info = {
                "company_name": company_name,
                "industry": company_industry,
                "jurisdiction": company_jurisdiction,
                "company_type": company_type
            }
            st.success("Company information saved!")
    
    # Display current company info
    if st.session_state.company_info:
        st.markdown(f"""
        <div class="company-card">
            <strong>🏢 {st.session_state.company_info['company_name']}</strong><br>
            📊 {st.session_state.company_info['industry']}<br>
            🌍 {st.session_state.company_info['jurisdiction']}<br>
            🏛️ {st.session_state.company_info['company_type']}
        </div>
        """, unsafe_allow_html=True)

# Main Interface
col1, col2 = st.columns([2, 1])

with col1:
    st.markdown("### 💬 Ask Your Legal Question")
    
    # Question categories for quick access
    st.markdown("**Quick Categories:**")
    category_cols = st.columns(4)
    
    with category_cols[0]:
        if st.button("📋 Compliance", use_container_width=True):
            st.session_state.question_input = "What are the annual compliance requirements?"
            st.rerun()
    with category_cols[1]:
        if st.button("👥 Board Matters", use_container_width=True):
            st.session_state.question_input = "What are the requirements for board meetings?"
            st.rerun()
    with category_cols[2]:
        if st.button("📊 Financial", use_container_width=True):
            st.session_state.question_input = "What are the financial reporting obligations?"
            st.rerun()
    with category_cols[3]:
        if st.button("🔄 Corporate Actions", use_container_width=True):
            st.session_state.question_input = "How to increase authorized capital?"
            st.rerun()
    
    # Question input
    question = st.text_area(
        "Your Legal Question:",
        placeholder="e.g., What are the requirements for conducting an Annual General Meeting? What documents need to be filed?",
        height=100,
        key="question_input"
    )
    
    # Advanced options
    with st.expander("🔧 Advanced Options"):
        col_adv1, col_adv2 = st.columns(2)
        with col_adv1:
            max_search_results = st.slider("Max Web Results", 1, 10, 5)
            use_different_llm = st.checkbox("Use different AI model for this question")
        with col_adv2:
            response_language = st.selectbox("Response Language", ["Auto-detect", "English", "Bengali"])
            include_sources = st.checkbox("Include detailed sources", value=True)
    
    # Different LLM selection for specific question
    if use_different_llm:
        col_llm1, col_llm2 = st.columns(2)
        with col_llm1:
            question_provider = st.selectbox("Provider:", providers, key="q_provider")
        with col_llm2:
            if question_provider in llm_options["providers"]:
                q_models = llm_options["providers"][question_provider]["models"]
                question_model = st.selectbox("Model:", q_models, key="q_model")
            else:
                question_model = llm_options["providers"][question_provider]["default"]
    else:
        question_provider = selected_provider
        question_model = selected_model
    
    # Submit button
    submitted = st.button("🚀 Get Legal Advice", type="primary", use_container_width=True)

with col2:
    st.markdown("### 📊 System Overview")
    
    # Create status visualization
    if st.session_state.system_stats and "documents_loaded" in st.session_state.system_stats:
        chart = create_status_chart(st.session_state.system_stats)
        if chart:
            st.plotly_chart(chart, use_container_width=True)
    
    # Recent activity
    st.markdown("### 📈 Recent Activity")
    if st.session_state.chat_history:
        st.metric("Questions Asked", len(st.session_state.chat_history))
        if len(st.session_state.chat_history) > 0:
            last_question = st.session_state.chat_history[-1]
            st.info(f"Last: {last_question['question'][:50]}...")
    else:
        st.info("No questions asked yet")

# Process question
if submitted and question:
    try:
        # Prepare company context
        company_context = st.session_state.company_info if st.session_state.company_info else None
        
        # Show enhanced loading
        with st.container():
            st.markdown('<div class="search-indicator">🔍 Analyzing your question and searching for relevant information...</div>', unsafe_allow_html=True)
            
            progress_text = st.empty()
            progress_bar = st.progress(0)
            
            for i, step in enumerate(["Processing question", "Searching documents", "Web search", "Generating response"]):
                progress_text.text(f"Step {i+1}/4: {step}")
                progress_bar.progress((i + 1) * 25)
                time.sleep(0.5)
        
        # Prepare request payload
        payload = {
            "question": question,
            "llm_provider": question_provider,
            "model_name": question_model,
            "use_web_search": use_web_search,
            "max_search_results": max_search_results,
            "company_context": company_context
        }
        
        # Make API call
        response = requests.post(f"{API_URL}/ask", json=payload, timeout=120)
        
        # Clear progress indicators
        progress_text.empty()
        progress_bar.empty()
        
        if response.status_code == 200:
            result = response.json()
            
            # Add to chat history
            chat_entry = {
                "question": question,
                "answer": result["answer"],
                "llm_used": result.get("llm_used", f"{question_provider} ({question_model})"),
                "timestamp": datetime.now().isoformat(),
                "sources": result.get("sources_used", []),
                "web_results": result.get("web_search_results", []),
                "confidence": result.get("confidence_score", 0.0),
                "processing_time": result.get("processing_time", 0.0)
            }
            
            st.session_state.chat_history.append(chat_entry)
            st.success(f"✅ Response generated in {chat_entry['processing_time']:.2f}s")
            
        else:
            st.error(f"❌ API Error: {response.status_code}")
            if response.text:
                st.error(response.text)
                
    except requests.exceptions.Timeout:
        st.error("⏱️ Request timed out. The AI model is taking longer than expected. Please try again.")
    except Exception as e:
        st.error(f"❌ Unexpected error: {str(e)}")

elif submitted and not question:
    st.warning("⚠️ Please enter a legal question!")

# Chat History Display
if st.session_state.chat_history:
    st.markdown("---")
    st.markdown("### 💬 Conversation History")
    
    # Conversation controls
    col_ctrl1, col_ctrl2, col_ctrl3 = st.columns([1, 1, 2])
    with col_ctrl1:
        if st.button("🗑️ Clear History"):
            st.session_state.chat_history = []
            st.rerun()
    with col_ctrl2:
        if st.button("📥 Export Chat"):
            st.session_state.export_chat = True
    with col_ctrl3:
        st.write("")  # Spacer
    
    # Display conversations
    for i, chat in enumerate(reversed(st.session_state.chat_history)):
        with st.container():
            # User question
            st.markdown(f"""
            <div class="user-message">
                <strong>Q:</strong> {chat['question']}
                <div class="message-meta">Asked at: {chat['timestamp'][:19]}</div>
            </div>
            """, unsafe_allow_html=True)
            
            # AI response
            st.markdown(f"""
            <div class="assistant-message">
                <strong>A:</strong> {chat['answer']}
                <div class="message-meta">
                    🤖 {chat['llm_used']} | ⚡ {chat.get('processing_time', 0):.2f}s | 
                    📊 Confidence: {chat.get('confidence', 0)*100:.0f}%
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # Sources and web results
            if include_sources and (chat.get('sources') or chat.get('web_results')):
                with st.expander(f"📚 Sources & References (Question {len(st.session_state.chat_history) - i})"):
                    if chat.get('sources'):
                        st.markdown("**📄 Document Sources:**")
                        for source in chat['sources'][:5]:
                            st.markdown(f"• {source}")
                    
                    if chat.get('web_results'):
                        st.markdown("**🌐 Web Sources:**")
                        for result in chat['web_results'][:3]:
                            st.markdown(f"• [{result['title']}]({result['url']})")
            
            st.markdown("---")
    
    # Export functionality
    if st.session_state.export_chat:
        chat_export = {
            "export_date": datetime.now().isoformat(),
            "company_info": st.session_state.company_info,
            "conversations": st.session_state.chat_history
        }
        st.download_button(
            "📥 Download Chat History",
            data=json.dumps(chat_export, indent=2),
            file_name=f"legal_chat_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            mime="application/json"
        )
        st.session_state.export_chat = False

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; margin-top: 2rem;">
    <p><strong>Company Law AI Agent v2.0</strong></p>
    <p>🔒 Secure • 🌐 Connected • ⚖️ Legal-focused • 🤖 AI-powered</p>
    <p><em>Always consult with qualified legal professionals for critical matters</em></p>
</div>
""", unsafe_allow_html=True)

# Auto-refresh for real-time updates
if st.checkbox("🔄 Auto-refresh status (5s)", value=False):
    time.sleep(5)
    st.rerun()