// Store active connections with cleanup
const connections = new Map<string, { controller: ReadableStreamDefaultController; lastActivity: number }>();
const MAX_CONNECTIONS = 1000; // Limit concurrent connections
const CONNECTION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Cleanup inactive connections
setInterval(() => {
  const now = Date.now();
  connections.forEach((connection, userId) => {
    if (now - connection.lastActivity > CONNECTION_TIMEOUT) {
      try {
        connection.controller.close();
      } catch (error) {
        console.error('Error closing inactive connection:', error);
      }
      connections.delete(userId);
    }
  });
}, 5 * 60 * 1000); // Check every 5 minutes

// Function to send notification to a specific agent
export function sendNotificationToAgent(agentId: string, notification: any) {
  const connection = connections.get(agentId);
  if (connection) {
    try {
      const data = `data: ${JSON.stringify(notification)}\n\n`;
      connection.controller.enqueue(new TextEncoder().encode(data));
      connection.lastActivity = Date.now();
    } catch (error) {
      console.error('Error sending notification to agent:', error);
      connections.delete(agentId);
    }
  }
}

// Function to send notification to all agents
export function sendNotificationToAllAgents(notification: any) {
  const failedConnections: string[] = [];
  
  connections.forEach((connection, userId) => {
    try {
      const data = `data: ${JSON.stringify(notification)}\n\n`;
      connection.controller.enqueue(new TextEncoder().encode(data));
      connection.lastActivity = Date.now();
    } catch (error) {
      console.error('Error sending notification to user:', userId, error);
      failedConnections.push(userId);
    }
  });
  
  // Clean up failed connections
  failedConnections.forEach(userId => connections.delete(userId));
}

// Function to add a connection
export function addConnection(userId: string, controller: ReadableStreamDefaultController): boolean {
  // Check connection limit
  if (connections.size >= MAX_CONNECTIONS) {
    console.warn('Maximum connections reached');
    return false;
  }
  
  connections.set(userId, {
    controller,
    lastActivity: Date.now()
  });
  
  return true;
}

// Function to remove a connection
export function removeConnection(userId: string) {
  connections.delete(userId);
}

// Function to get connection stats
export function getConnectionStats() {
  return {
    activeConnections: connections.size,
    maxConnections: MAX_CONNECTIONS
  };
} 