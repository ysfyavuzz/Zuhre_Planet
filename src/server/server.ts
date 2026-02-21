import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './context';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws'; // WebSocket için

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT as string) : 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:80', 'https://yourdomain.com'], // Frontend URL'niz
  credentials: true
}));
app.use(express.json());

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Basic route for health check
app.get('/health', (req, res) => {
  res.status(200).send('API is healthy');
});

// HTTP server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Handle WebSocket messages here
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`tRPC endpoint: http://localhost:${port}/trpc`);
  console.log(`WebSocket endpoint: ws://localhost:${port}/ws`);
});
