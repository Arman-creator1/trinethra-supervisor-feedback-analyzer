Trinethra Supervisor Feedback Analyzer

An AI-powered web application that analyzes supervisor feedback transcripts and generates structured insights for psychology interns and evaluators.

This project was built as part of the DeepThought Software Developer Internship Assignment.

Features
Paste supervisor transcript into a clean UI
AI-powered transcript analysis using Ollama
Extracted behavioral evidence
Suggested rubric score
Gap analysis detection
Suggested follow-up questions
Human-review-focused workflow
Local LLM execution (No cloud APIs)
Tech Stack
Frontend
React (JSX)
Vite
Tailwind CSS
Framer Motion
Lucide React Icons
Backend
Node.js
Express.js
CORS
AI / LLM
Ollama
Phi3 Mini Model
Architecture Overview

The application follows a simple frontend-backend AI workflow.

The user pastes a supervisor transcript into the frontend.
The frontend sends the transcript to the Express backend.
The backend sends the transcript to Ollama using the local HTTP API.
The Phi3 Mini model generates structured JSON analysis.
The backend validates and parses the JSON response.
The frontend displays the structured insights.

Workflow:

Frontend (React) → Backend (Express) → Ollama Local LLM → Structured JSON → Frontend Dashboard

Ollama Model Used
Model: phi3:mini

I selected Phi3 Mini because:

It works efficiently on low-memory systems
Faster inference speed during development
Suitable for local execution without GPU
Lightweight while still producing structured outputs

The assignment emphasized local execution and practical product development over large model size.

Setup Instructions
1. Clone Repository
git clone <your-github-repo-link>
cd trinethra-analyzer
2. Install Ollama

Download and install Ollama:

https://ollama.com

3. Pull AI Model
ollama pull phi3:mini
4. Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
5. Backend Setup

Open another terminal:

cd backend
npm install
node server.js

Backend runs on:

http://localhost:5000
API Endpoint
POST /analyze
Request Body
{
  "transcript": "The fellow improved team communication and increased productivity."
}
Design Challenges Tackled
1. Structured Output Reliability

Local LLMs do not always return perfectly formatted JSON. Sometimes the model generated invalid formatting or additional text.

Solution:

Added strict prompt instructions
Forced JSON-only responses
Implemented backend JSON parsing validation
Added fallback handling for invalid responses
2. Human Review Workflow

The assignment emphasized that AI should assist rather than replace human judgment.

Solution:

Designed the system as an AI-assisted workflow
The generated analysis is presented as a draft recommendation
Human reviewers are expected to validate outputs before finalizing decisions
3. Gap Detection

Detecting missing information from transcripts is more difficult than extracting existing information.

Solution:

Prompt engineering was used to explicitly instruct the model to identify missing evaluation areas
Follow-up questions were generated based on detected gaps
AI Hallucination Handling

To reduce hallucinations and improve reliability:

Used structured prompts
Restricted response format to JSON only
Added backend parsing checks
Avoided free-form output generation
Displayed outputs as suggestions instead of final decisions
Future Improvements

If given more time, I would improve:

Editable review workflow for psychology interns
Side-by-side transcript and evidence highlighting
Better rubric scoring explanations
Retry logic for malformed AI responses
Persistent transcript history
Multi-model comparison support
Advanced KPI mapping visualization
Important Note

This application is designed as an AI-assisted analysis system.

The AI generates draft insights, but final evaluation and decision-making should always remain with the human reviewer.

Author

Arman Pramanik
