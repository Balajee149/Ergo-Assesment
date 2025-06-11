import express from 'express';
import cors from 'cors';
import { IProject } from './models/project.interface';
import { v4 as uuid } from 'uuid';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { ChatMessage } from './models/ChatInterface';

const app = express();
const PORT = 3000;
const WS_PORT = 8080;

// List of projects
const projects: IProject[] = [];

// BONUS: Chat system interfaces and storage


/**
 * In-memory storage for chat messages
 * Will be destroyed on server restart
 */
const chatMessages: ChatMessage[] = [];

// Setup cors and express.json()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Create HTTP server
const server = createServer(app);

/**
 * BONUS: WebSocket server for real-time chat system
 * Handles multiple concurrent connections and message broadcasting
 */
const wss = new WebSocketServer({ port: WS_PORT });

/**
 * WebSocket connection handler
 * Manages client connections, message broadcasting, and chat history
 */
wss.on('connection', (ws: WebSocket) => {
  const userId = uuid();
  console.log(`New chat user connected: ${userId}`);

  // Send user ID to client
  ws.send(JSON.stringify({
    type: 'user_connected',
    userId: userId
  }));

  // Send existing chat history to newly connected user
  ws.send(JSON.stringify({
    type: 'chat_history',
    messages: chatMessages
  }));

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system_message',
    message: 'Welcome to the chat! You are now connected.'
  }));

  /**
   * Handle incoming messages from clients
   */
  ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      
      if (parsedData.type === 'chat_message') {
        // Validate message content
        if (!parsedData.message || typeof parsedData.message !== 'string') {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
          return;
        }

        // Create new message object
        const newMessage: ChatMessage = {
          id: uuid(),
          message: parsedData.message.trim(),
          timestamp: new Date(),
          userId: userId
        };

        // Store message in memory
        chatMessages.push(newMessage);

        // Broadcast to all connected clients
        wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'new_message',
              message: newMessage
            }));
          }
        });

        console.log(`Message from ${userId}: ${newMessage.message}`);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });

  /**
   * Handle client disconnection
   */
  ws.on('close', () => {
    console.log(`Chat user disconnected: ${userId}`);
  });

  /**
   * Handle WebSocket errors
   */
  ws.on('error', (error: any) => {
    console.error(`WebSocket error for user ${userId}:`, error);
  });
});

app.get('/', (_req, res) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

/**
 * Creates a new project
 * @route POST /projects
 * @param {Object} req.body.project - The project data containing name and description
 * @returns {IProject} The newly created project with generated ID
 */
app.post('/projects', (req, res) => {
  /**
   * TODO: Complete the method for creating a new project
   * The response should contain an object of type IProject
   * 
   * Hint: Utilize the `projects` to store the newly generated of project
   * Hint: Utilize the `uuid` npm package to generate the unique ids for the project
   */
  try {
    const { project } = req.body;

    // Validate input data
    if (!project || !project.name?.trim() || !project.description?.trim()) {
      res.status(400).json({ 
        error: 'Invalid project data. Name and description are required.' 
      });
      return;
    }

    // Create new project with generated ID
    const newProject: IProject = {
      id: uuid(),
      name: project.name.trim(),
      description: project.description.trim()
    };

    // Store in our projects array
    projects.push(newProject);

    // Return the created project
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating project' 
    });
  }
});

/**
 * Retrieves all projects
 * @route GET /projects
 * @returns {IProject[]} Array of all projects
 */
app.get('/projects', (req, res) => {
  /**
   * TODO: Complete the method for returning the current list of projects
   * The responese should contain a list of IProject
   * 
   * Hint: Utilize the `projects` to retrieve the list of projects
   */
  try {
    // Return the list of projects
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching projects' 
    });
  }
});

// Start the server - MOVED TO THE END
