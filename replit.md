# Overview

This is an iManage Bulk Upload Desktop Client built as a modern web application using React, TypeScript, and Express. The application enables users to authenticate with iManage servers, select workspaces, configure document metadata, and perform bulk file uploads with real-time progress tracking. The system follows a full-stack architecture with a React frontend, Express backend, and PostgreSQL database for session management and file tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark mode)

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with proper error handling and request logging middleware
- **File Processing**: Multer middleware for handling multipart file uploads with size limits (50MB) and type validation
- **Authentication**: Session-based authentication with mock implementation (ready for iManage OAuth2 integration)
- **Data Storage**: In-memory storage implementation with interface-based design for easy database migration

## Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Design**: Well-structured tables for users, workspaces, upload sessions, and uploaded files
- **Database**: Neon PostgreSQL (serverless) configured through environment variables
- **Migration System**: Drizzle Kit for database schema migrations and management

## Authentication and Authorization
- **Strategy**: Designed for iManage Work API integration with OAuth2/basic auth support
- **Session Management**: Express sessions with secure token storage
- **User Management**: User creation and authentication flow with server URL configuration
- **Token Handling**: Access token storage and refresh capability for iManage API calls

## Key Design Patterns
- **Component Architecture**: Modular React components with clear separation of concerns
- **Type Safety**: Full TypeScript coverage with shared schemas between frontend and backend
- **Error Handling**: Comprehensive error boundaries and user feedback through toast notifications
- **Progressive Enhancement**: Step-by-step workflow with clear user guidance and progress tracking
- **Responsive Design**: Mobile-first approach with adaptive layouts using Tailwind breakpoints

## File Upload System
- **Workflow**: Multi-step process including authentication, workspace selection, file selection, metadata configuration, and upload execution
- **Progress Tracking**: Real-time upload progress with session-based tracking and retry capabilities
- **File Validation**: Client and server-side validation for file types and sizes
- **Metadata Management**: Dynamic form generation based on workspace-specific metadata fields

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight React routing
- **express**: Node.js web application framework
- **drizzle-orm**: TypeScript ORM for database operations
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver

## UI and Styling
- **@radix-ui/react-***: Headless UI component primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **lucide-react**: Icon library

## Form and Validation
- **react-hook-form**: Performance forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod

## File Processing
- **multer**: Node.js middleware for handling multipart/form-data
- **connect-pg-simple**: PostgreSQL session store for Express

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Future Integration Requirements
- **iManage Work API**: Enterprise document management system integration
- **OAuth2 Provider**: Authentication service integration
- **PostgreSQL Database**: Production database deployment (Drizzle configured for easy migration from in-memory storage)