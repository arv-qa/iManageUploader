# 📤 iManage Uploader

**Modern, enterprise-grade bulk document upload solution for iManage Work**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./VERSION)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](./Dockerfile)

> **🎉 Initial Release v1.0.0** - Production-ready bulk document upload solution with comprehensive documentation and enterprise features.

---

## 🌟 **Overview**

iManage Uploader is a comprehensive web application designed to streamline bulk document uploads to iManage Work. Built with modern technologies and enterprise requirements in mind, it provides a professional, user-friendly interface for efficient document management.

### **✨ Key Features**

- 🔐 **Secure iManage Integration** - Direct authentication with iManage Work servers
- 📁 **Smart Workspace Management** - Browse, search, and select workspaces with ease
- 📤 **Bulk File Upload** - Upload multiple documents simultaneously with drag & drop
- 🏷️ **Dynamic Metadata** - Automatic form generation based on workspace requirements
- 📊 **Real-time Progress** - Live upload tracking with file-by-file status updates
- 🎨 **Modern UI** - Professional, responsive interface built with React 18
- 🐳 **Docker Ready** - Complete containerization for easy deployment
- 📚 **Complete Documentation** - Comprehensive guides for users and developers

---

## 🚀 **Quick Start**

### **Option 1: Automated Setup (Recommended)**

**Windows:**
```cmd
# Download and run the setup script
setup.bat
```

**Unix/Linux/Mac:**
```bash
# Download and run the setup script
chmod +x setup.sh
./setup.sh
```

### **Option 2: Docker Deployment**

```bash
# Clone the repository
git clone https://github.com/arv-qa/iManageUploader.git
cd iManageUploader

# Start with Docker Compose
docker-compose up -d

# Access at http://localhost:5000
```

### **Option 3: Manual Installation**

```bash
# Prerequisites: Node.js 18+, PostgreSQL
npm install
cp .env.example .env
# Configure your .env file
npm run db:push
npm run dev
```

---

## 📚 **Documentation**

### **📖 User Guides**
- **[Installation Guide](./INSTALLATION_GUIDE.md)** - Complete setup instructions for all skill levels
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Solutions to common issues and problems
- **[UI Preview](./UI_PREVIEW.html)** - Interactive preview of the application interface

### **🔧 Technical Documentation**
- **[API Documentation](./API_DOCUMENTATION.html)** - Complete API reference and endpoints
- **[Development Guide](./DEVELOPMENT.html)** - Developer setup and contribution guidelines
- **[Release Notes](./RELEASE_NOTES.md)** - Detailed information about this release

### **📋 Project Information**
- **[Changelog](./CHANGELOG.md)** - Version history and changes
- **[Version](./VERSION)** - Current version information

---

## 🏗️ **Architecture**

### **Frontend Stack**
- **React 18** with TypeScript for type-safe component development
- **Tailwind CSS** for modern, responsive styling
- **TanStack Query** for efficient server state management
- **Vite** for fast development and optimized builds

### **Backend Stack**
- **Node.js 18+** with Express.js framework
- **TypeScript** throughout for enhanced reliability
- **PostgreSQL** with Drizzle ORM for robust data management
- **Comprehensive API** with full error handling

### **DevOps & Deployment**
- **Docker** containerization with multi-stage builds
- **GitHub Actions** CI/CD pipeline
- **Environment-specific** configuration management

---

## 🎯 **Use Cases**

### **Perfect For:**
- **Legal Firms** - Bulk upload of case documents, contracts, and legal briefs
- **Corporate Legal** - Policy documents, compliance files, and procedures
- **Document Migration** - Transfer from legacy systems to iManage Work
- **Team Collaboration** - Shared document upload workflows

### **Supported File Types:**
- **Documents**: PDF, DOC, DOCX, TXT
- **Spreadsheets**: XLS, XLSX, CSV
- **Size Limit**: Up to 50MB per file
- **Batch Upload**: Multiple files simultaneously

---

## 🔒 **Security & Compliance**

### **Enterprise Security**
- Secure authentication with iManage Work integration
- Session-based security with automatic timeout
- Input validation and sanitization throughout
- Secure file handling with automatic cleanup

### **Compliance Ready**
- GDPR compliant data handling
- SOC 2 compatible security practices
- Enterprise audit trail support
- Configurable retention policies

---

## 📊 **System Requirements**

### **Server Requirements**
- **Node.js**: 18.0 or higher
- **Database**: PostgreSQL 12 or higher
- **Memory**: 2GB RAM minimum, 4GB recommended
- **Storage**: 10GB available space

### **Client Requirements**
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Enabled
- **Network**: Stable internet connection for iManage Work access

### **iManage Work Compatibility**
- **iManage Work**: 10.0 or higher
- **API Access**: iManage Work API enabled
- **Authentication**: iManage Work user credentials required

---

## 🛠️ **Development**

### **Getting Started**
```bash
# Clone the repository
git clone https://github.com/arv-qa/iManageUploader.git
cd iManageUploader

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Configure your .env file

# Set up database
npm run db:push

# Start development server
npm run dev
```

### **Available Scripts**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Development Guide](./DEVELOPMENT.html) for detailed information on:

- Setting up the development environment
- Code style and conventions
- Testing procedures
- Pull request process

---

## 📞 **Support**

### **Documentation Resources**
- **[Installation Guide](./INSTALLATION_GUIDE.md)** - Step-by-step setup instructions
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[API Documentation](./API_DOCUMENTATION.html)** - Technical reference

### **Community Support**
- **GitHub Issues** - Report bugs and request features
- **Documentation** - Comprehensive self-service resources
- **Code Examples** - Sample configurations and use cases

### **Enterprise Support**
Professional support available for enterprise deployments, including:
- Custom integration and configuration services
- Training and onboarding assistance
- Priority technical support

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- iManage Work API documentation team
- Beta testers who provided valuable feedback
- Open-source community for excellent libraries and tools
- Enterprise users who shared their workflow requirements

---

## 🔗 **Links**

- **[GitHub Repository](https://github.com/arv-qa/iManageUploader)**
- **[Issue Tracker](https://github.com/arv-qa/iManageUploader/issues)**
- **[Release Notes](./RELEASE_NOTES.md)**
- **[Changelog](./CHANGELOG.md)**

---

**Ready to streamline your iManage Work document uploads? Get started with our [Installation Guide](./INSTALLATION_GUIDE.md)!**
