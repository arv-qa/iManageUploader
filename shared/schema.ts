import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  serverUrl: text("server_url").notNull(),
  accessToken: text("access_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: varchar("user_id").references(() => users.id),
  metadataFields: jsonb("metadata_fields").$type<MetadataField[]>(),
});

export const uploadSessions = pgTable("upload_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  workspaceId: varchar("workspace_id").references(() => workspaces.id),
  status: text("status", { enum: ['pending', 'uploading', 'completed', 'failed'] }).notNull().default('pending'),
  totalFiles: integer("total_files").notNull(),
  completedFiles: integer("completed_files").notNull().default(0),
  failedFiles: integer("failed_files").notNull().default(0),
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => uploadSessions.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  status: text("status", { enum: ['pending', 'uploading', 'completed', 'failed'] }).notNull().default('pending'),
  errorMessage: text("error_message"),
  uploadedAt: timestamp("uploaded_at"),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  serverUrl: true,
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
});

export const insertUploadSessionSchema = createInsertSchema(uploadSessions).omit({
  id: true,
  createdAt: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).omit({
  id: true,
  uploadedAt: true,
});

export const loginSchema = z.object({
  serverUrl: z.string().url("Please enter a valid server URL"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const metadataSchema = z.object({
  documentType: z.string().optional(),
  matterNumber: z.string().optional(),
  clientName: z.string().optional(),
  author: z.string().optional(),
  description: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;
export type InsertUploadSession = z.infer<typeof insertUploadSessionSchema>;
export type UploadSession = typeof uploadSessions.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;
export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type DocumentMetadata = z.infer<typeof metadataSchema>;

export interface MetadataField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UploadProgress {
  sessionId: string;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  currentFile?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}
