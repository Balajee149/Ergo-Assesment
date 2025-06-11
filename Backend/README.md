# Backend - Ergo Code Assessment ✅ COMPLETED

This is the backend portion of the Ergo Code Assessment, built with Node.js, Express, and TypeScript.

## 📋 Task Overview

All **2 TODO comments** and the **BONUS WebSocket Chat System** have been successfully implemented.

### ✅ Completed Tasks

#### **Core TODOs (2/2 Completed)**

1. **✅ TODO 1: POST /projects Endpoint**
   - Implemented complete project creation API endpoint
   - Added comprehensive input validation
   - Integrated UUID generation for unique project IDs
   - Added proper error handling and status codes
   - Returns created project with generated ID

2. **✅ TODO 2: GET /projects Endpoint**
   - Implemented project retrieval API endpoint
   - Returns array of all stored projects
   - Added proper error handling and status codes
   - Supports the frontend project listing functionality

#### **✅ BONUS Task: WebSocket Chat System**
- **Real-time Server**: WebSocket server on port 8080
- **Multi-client Support**: Handles multiple concurrent connections
- **Message Broadcasting**: Real-time message distribution to all clients
- **Chat History**: Stores and sends message history to new connections
- **User Management**: Unique user ID generation and tracking
- **Error Handling**: Comprehensive WebSocket error management
- **Connection Management**: Proper connection/disconnection handling

## 🚀 API Endpoints Implemented

### **REST API Endpoints**

#### **POST /projects**
- **Purpose**: Create a new project
- **Request Body**: 
  ```json
  {
    "project": {
      "name": "Project Name",
      "description": "Project Description"
    }
  }
  ```
- **Response**: 
  ```json
  {
    "id": "uuid-generated-id",
    "name": "Project Name",
    "description": "Project Description"
  }
  ```
- **Status Codes**: 
  - `201` - Project created successfully
  - `400` - Invalid input data
  - `500` - Internal server error

#### **GET /projects**
- **Purpose**: Retrieve all projects
- **Request Body**: None required
- **Response**: 
  ```json
  [
    {
      "id": "uuid-1",
      "name": "Project 1",
      "description": "Description 1"
    },
    {
      "id": "uuid-2", 
      "name": "Project 2",
      "description": "Description 2"
    }
  ]
  ```
- **Status Codes**:
  - `200` - Success
  - `500` - Internal server error

### **WebSocket Chat System (BONUS)**

#### **WebSocket Server: ws://localhost:8080**

**Message Types Supported:**

1. **Incoming Messages (Client → Server)**
   ```json
   {
     "type": "chat_message",
     "message": "Hello everyone!"
   }
   ```

2. **Outgoing Messages (Server → Client)**
   ```json
   // Chat History
   {
     "type": "chat_history",
     "messages": [/* array of messages */]
   }
   
   // New Message Broadcast
   {
     "type": "new_message",
     "message": {
       "id": "uuid",
       "message": "Hello!",
       "timestamp": "2025-06-12T10:30:00Z",
       "userId": "user-uuid"
     }
   }
   
   // System Messages
   {
     "type": "system_message",
     "message": "Welcome to the chat!"
   }
   
   // Error Messages
   {
     "type": "error",
     "message": "Invalid message format"
   }
   ```



## 📁 Project Structure

```
src/
├── models/              # TypeScript interfaces
│   └── project.interface.ts
├── app.ts              # Main server application
└── package.json        # Dependencies and scripts
```

## 🔧 Server Configuration

### **CORS Configuration**
- **Origin**: `*` (Allow all origins)
- **Methods**: `GET`, `POST`
- **Credentials**: Enabled

### **Middleware**
- **express.json()**: JSON body parsing
- **cors()**: Cross-origin resource sharing

### **Ports**
- **HTTP Server**: `3000`
- **WebSocket Server**: `8080`


## 🧪 Testing the API

### **Test Project Creation**
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{"project":{"name":"Test Project","description":"Test Description"}}'
```

### **Test Project Retrieval**
```bash
curl http://localhost:3000/projects
```

### **Test WebSocket Chat**
1. Connect to `ws://localhost:8080`
2. Send: `{"type":"chat_message","message":"Hello!"}`
3. Receive real-time messages from other connected clients


---