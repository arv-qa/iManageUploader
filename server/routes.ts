import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, metadataSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported') as any, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Check database connection
      const dbHealthy = await storage.healthCheck();

      const healthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        database: dbHealthy ? "connected" : "disconnected",
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      };

      res.status(200).json(healthStatus);
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Authentication endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      // Mock authentication - in real implementation, validate with iManage API
      let user = await storage.getUserByUsername(loginData.username);
      
      if (!user) {
        // Create user if doesn't exist (mock scenario)
        user = await storage.createUser({
          username: loginData.username,
          password: loginData.password, // In real app, hash this
          serverUrl: loginData.serverUrl
        });
      }
      
      // Generate mock token
      const token = `mock_token_${randomUUID()}`;
      await storage.updateUserToken(user.id, token);
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          serverUrl: user.serverUrl
        },
        token
      });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Authentication failed" 
      });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Find user by token (mock implementation)
    const users = await Promise.all(
      Array.from({ length: 100 }, (_, i) => storage.getUser(`user-${i}`))
    );
    const user = users.find(u => u?.accessToken === token);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({
      id: user.id,
      username: user.username,
      serverUrl: user.serverUrl
    });
  });

  // Get workspaces
  app.get("/api/workspaces", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Mock user ID - in real implementation, extract from token
      const workspaces = await storage.getWorkspaces("mock-user-id");
      res.json(workspaces);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch workspaces" 
      });
    }
  });

  // Get workspace metadata fields
  app.get("/api/workspaces/:id/metadata", async (req, res) => {
    try {
      const workspace = await storage.getWorkspace(req.params.id);
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      
      res.json(workspace.metadataFields || []);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch metadata fields" 
      });
    }
  });

  // Create upload session
  app.post("/api/upload/session", async (req, res) => {
    try {
      const { workspaceId, totalFiles, metadata } = req.body;
      
      const session = await storage.createUploadSession({
        userId: "mock-user-id", // In real implementation, extract from token
        workspaceId,
        status: "pending",
        totalFiles,
        completedFiles: 0,
        failedFiles: 0,
        metadata
      });
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create upload session" 
      });
    }
  });

  // Upload files
  app.post("/api/upload/:sessionId/files", upload.array('files'), async (req, res) => {
    try {
      const { sessionId } = req.params;
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files provided" });
      }

      const session = await storage.getUploadSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Upload session not found" });
      }

      // Create file records
      const fileRecords: any[] = [];
      for (const file of files) {
        const fileRecord = await storage.createUploadedFile({
          sessionId,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          status: "pending"
        });
        fileRecords.push(fileRecord);
      }

      // Simulate upload process
      await storage.updateUploadSessionStatus(sessionId, "uploading");
      
      // Mock upload simulation with delays
      setTimeout(async () => {
        let completed = 0;
        for (const fileRecord of fileRecords) {
          // Simulate some files failing
          const shouldFail = Math.random() < 0.1; // 10% failure rate
          
          if (shouldFail) {
            await storage.updateFileStatus(fileRecord.id, "failed", "Network timeout");
            await storage.updateUploadSessionProgress(sessionId, completed, session.failedFiles + 1);
          } else {
            await storage.updateFileStatus(fileRecord.id, "completed");
            completed++;
            await storage.updateUploadSessionProgress(sessionId, completed, session.failedFiles);
          }
          
          // Small delay between files
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await storage.updateUploadSessionStatus(sessionId, "completed");
      }, 1000);

      res.json({
        message: "Upload started",
        sessionId,
        fileCount: files.length
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  // Get upload progress
  app.get("/api/upload/:sessionId/progress", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getUploadSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Upload session not found" });
      }

      const files = await storage.getSessionFiles(sessionId);
      const progress = session.totalFiles > 0 ? 
        Math.round((session.completedFiles / session.totalFiles) * 100) : 0;

      res.json({
        sessionId,
        totalFiles: session.totalFiles,
        completedFiles: session.completedFiles,
        failedFiles: session.failedFiles,
        progress,
        status: session.status,
        files: files.map(f => ({
          id: f.id,
          fileName: f.fileName,
          status: f.status,
          errorMessage: f.errorMessage
        }))
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch progress" 
      });
    }
  });

  // Retry failed uploads
  app.post("/api/upload/:sessionId/retry", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getUploadSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Upload session not found" });
      }

      const files = await storage.getSessionFiles(sessionId);
      const failedFiles = files.filter(f => f.status === 'failed');

      // Reset failed files to pending and simulate retry
      for (const file of failedFiles) {
        await storage.updateFileStatus(file.id, "pending");
      }

      await storage.updateUploadSessionStatus(sessionId, "uploading");
      await storage.updateUploadSessionProgress(sessionId, session.completedFiles, 0);

      // Simulate retry with better success rate
      setTimeout(async () => {
        let newlyCompleted = 0;
        let stillFailed = 0;
        
        for (const file of failedFiles) {
          const shouldFail = Math.random() < 0.05; // 5% failure rate on retry
          
          if (shouldFail) {
            await storage.updateFileStatus(file.id, "failed", "Persistent connection error");
            stillFailed++;
          } else {
            await storage.updateFileStatus(file.id, "completed");
            newlyCompleted++;
          }
          
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        await storage.updateUploadSessionProgress(
          sessionId, 
          session.completedFiles + newlyCompleted, 
          stillFailed
        );
        
        const finalStatus = stillFailed > 0 ? "completed" : "completed";
        await storage.updateUploadSessionStatus(sessionId, finalStatus);
      }, 500);

      res.json({ message: "Retry started" });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Retry failed" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
