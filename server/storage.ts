import { 
  type User, 
  type InsertUser, 
  type Workspace, 
  type InsertWorkspace,
  type UploadSession,
  type InsertUploadSession,
  type UploadedFile,
  type InsertUploadedFile,
  type AuthResponse,
  type MetadataField
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserToken(userId: string, token: string): Promise<void>;
  
  // Workspace management
  getWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  
  // Upload session management
  createUploadSession(session: InsertUploadSession): Promise<UploadSession>;
  getUploadSession(id: string): Promise<UploadSession | undefined>;
  updateUploadSessionProgress(id: string, completed: number, failed: number): Promise<void>;
  updateUploadSessionStatus(id: string, status: string): Promise<void>;
  
  // File management
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  updateFileStatus(id: string, status: string, errorMessage?: string): Promise<void>;
  getSessionFiles(sessionId: string): Promise<UploadedFile[]>;

  // Health check
  healthCheck(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private workspaces: Map<string, Workspace>;
  private uploadSessions: Map<string, UploadSession>;
  private uploadedFiles: Map<string, UploadedFile>;

  constructor() {
    this.users = new Map();
    this.workspaces = new Map();
    this.uploadSessions = new Map();
    this.uploadedFiles = new Map();
    
    // Initialize with mock workspaces
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockWorkspaces: Workspace[] = [
      {
        id: "ws-legal-001",
        name: "Legal Documents",
        description: "Corporate legal matter files",
        userId: null,
        metadataFields: [
          { name: "documentType", label: "Document Type", type: "select", required: true, options: ["contract", "invoice", "report", "correspondence"] },
          { name: "matterNumber", label: "Matter Number", type: "text", required: true },
          { name: "clientName", label: "Client Name", type: "text", required: true },
          { name: "author", label: "Author", type: "text", required: false },
          { name: "description", label: "Description", type: "textarea", required: false }
        ] as MetadataField[]
      },
      {
        id: "ws-hr-001",
        name: "HR Documents",
        description: "Human resources files and policies",
        userId: null,
        metadataFields: [
          { name: "documentType", label: "Document Type", type: "select", required: true, options: ["policy", "handbook", "form", "report"] },
          { name: "department", label: "Department", type: "text", required: true },
          { name: "author", label: "Author", type: "text", required: false }
        ] as MetadataField[]
      },
      {
        id: "ws-finance-001",
        name: "Financial Reports",
        description: "Quarterly and annual financial documents",
        userId: null,
        metadataFields: [
          { name: "reportType", label: "Report Type", type: "select", required: true, options: ["quarterly", "annual", "budget", "audit"] },
          { name: "period", label: "Period", type: "text", required: true },
          { name: "author", label: "Author", type: "text", required: false }
        ] as MetadataField[]
      },
      {
        id: "ws-marketing-001",
        name: "Marketing Assets",
        description: "Brand assets and marketing materials",
        userId: null,
        metadataFields: [
          { name: "assetType", label: "Asset Type", type: "select", required: true, options: ["brand", "campaign", "collateral", "presentation"] },
          { name: "campaign", label: "Campaign", type: "text", required: false },
          { name: "author", label: "Author", type: "text", required: false }
        ] as MetadataField[]
      }
    ];

    mockWorkspaces.forEach(workspace => {
      this.workspaces.set(workspace.id, workspace);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      accessToken: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserToken(userId: string, token: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.accessToken = token;
      this.users.set(userId, user);
    }
  }

  async getWorkspaces(userId: string): Promise<Workspace[]> {
    // Return all mock workspaces for any authenticated user
    return Array.from(this.workspaces.values());
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const id = randomUUID();
    const newWorkspace: Workspace = {
      ...workspace,
      id,
      description: workspace.description || null,
      userId: workspace.userId || null,
      metadataFields: workspace.metadataFields || null
    };
    this.workspaces.set(id, newWorkspace);
    return newWorkspace;
  }

  async createUploadSession(session: InsertUploadSession): Promise<UploadSession> {
    const id = randomUUID();
    const uploadSession: UploadSession = {
      ...session,
      id,
      createdAt: new Date(),
      status: session.status || "pending",
      completedFiles: session.completedFiles || 0,
      failedFiles: session.failedFiles || 0,
      userId: session.userId || null,
      workspaceId: session.workspaceId || null,
      metadata: session.metadata || null
    };
    this.uploadSessions.set(id, uploadSession);
    return uploadSession;
  }

  async getUploadSession(id: string): Promise<UploadSession | undefined> {
    return this.uploadSessions.get(id);
  }

  async updateUploadSessionProgress(id: string, completed: number, failed: number): Promise<void> {
    const session = this.uploadSessions.get(id);
    if (session) {
      session.completedFiles = completed;
      session.failedFiles = failed;
      this.uploadSessions.set(id, session);
    }
  }

  async updateUploadSessionStatus(id: string, status: string): Promise<void> {
    const session = this.uploadSessions.get(id);
    if (session) {
      session.status = status as any;
      this.uploadSessions.set(id, session);
    }
  }

  async createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile> {
    const id = randomUUID();
    const uploadedFile: UploadedFile = {
      ...file,
      id,
      uploadedAt: null,
      status: file.status || "pending",
      sessionId: file.sessionId || null,
      errorMessage: file.errorMessage || null
    };
    this.uploadedFiles.set(id, uploadedFile);
    return uploadedFile;
  }

  async updateFileStatus(id: string, status: string, errorMessage?: string): Promise<void> {
    const file = this.uploadedFiles.get(id);
    if (file) {
      file.status = status as any;
      file.errorMessage = errorMessage || null;
      if (status === 'completed') {
        file.uploadedAt = new Date();
      }
      this.uploadedFiles.set(id, file);
    }
  }

  async getSessionFiles(sessionId: string): Promise<UploadedFile[]> {
    return Array.from(this.uploadedFiles.values()).filter(file => file.sessionId === sessionId);
  }

  async healthCheck(): Promise<boolean> {
    try {
      // For in-memory storage, just check if the maps are accessible
      return this.users instanceof Map &&
             this.workspaces instanceof Map &&
             this.uploadSessions instanceof Map &&
             this.uploadedFiles instanceof Map;
    } catch (error) {
      return false;
    }
  }
}

export const storage = new MemStorage();
