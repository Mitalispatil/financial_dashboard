**🔧 Setup Instructions**

**1. Install Dependencies**

  **For backend:**
    - cd backend
    - npm install
    
  **For frontend:**
    - cd frontend
    - npm install
    
**2. Environment Variables**

   Create .env files in both backend/ and frontend/ folders:

   **Backend .env:**
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      
   **Frontend .env:**
      REACT_APP_API_URL=http://localhost:5000/api

      
**3. Run the Application**

**Backend:**
    cd backend
    npm run dev


**Frontend:**
    cd frontend
    npm start
