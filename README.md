# Me_Bot – AI Conversational Bot with Voice Interaction

Live Link : https://me-bot-rutx.vercel.app/

Me_Bot is an intelligent conversational agent that allows users to talk with their system through natural speech.  
It listens to your voice, understands the intent using AI (LangChain + OpenAI), and responds back in voice format.  
It also learns and remembers user details to deliver personalized and context-aware responses.

---

## Features
- Real-time voice input using browser-based speech recognition  
- AI-powered text understanding and response generation via LangChain and OpenAI API  
- Text-to-speech output for natural voice replies  
- Contextual memory for continuous, personalized conversations  
- Modular architecture with integrated frontend and backend  
- Scalable design suitable for both web and mobile applications  

---

## Tech Stack
- Next.js (Frontend)  
- Node.js + Express.js (Backend)  
- LangChain  
- OpenAI API  
- Web Speech API (Speech Recognition + Speech Synthesis)  
- MongoDB  
- JWT Authentication  

---

## Project Architecture
```
Me_Bot/
 ┣ backend/
 ┃ ┣ controllers/
 ┃ ┣ routes/
 ┃ ┣ utils/
 ┃ ┗ server.js
 ┣ frontend/
 ┃ ┣ components/
 ┃ ┣ pages/
 ┃ ┣ hooks/
 ┃ ┗ App.js
 ┣ .env
 ┗ README.md
```

**Flow Overview:**
1. The user speaks into the microphone.  
2. The Web Speech API converts voice input to text.  
3. The text query is sent to the backend API.  
4. The backend uses LangChain + OpenAI API to generate a response.  
5. The response text is converted into speech and played back to the user.  
6. User context and history are stored for personalized future conversations.

---

## Installation

### Prerequisites
- Node.js and npm installed  
- OpenAI API key  
- MongoDB database URI  

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Me_Bot.git
cd Me_Bot
```

### 2. Install dependencies
```bash
npm install
cd frontend && npm install
```

### 3. Configure environment variables  
Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Run the backend
```bash
npm run server
```

### 5. Run the frontend
```bash
cd frontend
npm run dev
```

### 6. Visit the app
Open `http://localhost:3000` in your browser.

---

## API Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/voice/query | Accepts transcribed text and returns AI-generated response |
| GET | /api/user/context | Retrieves stored user context |
| POST | /api/auth/login | Authenticates user and generates token |

---

## Example Flow
1. User says: “Hey Me_Bot, what’s the weather like today?”  
2. Me_Bot recognizes speech and converts it to text.  
3. The backend processes the request and queries OpenAI for the answer.  
4. The response is read aloud: “It’s 26°C and partly cloudy in your area.”  

---

## Impact
- Enabled hands-free, human-like AI interaction.  
- Improved accessibility for users preferring voice interfaces.  
- Combined conversational intelligence with real-time speech response for a seamless experience.
