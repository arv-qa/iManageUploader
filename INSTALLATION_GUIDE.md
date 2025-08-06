# 🚀 iManage Uploader - Complete Installation Guide

**A step-by-step guide for beginners to install and run the iManage Uploader application on your local computer.**

---

## 📋 What You'll Need

Before we start, you'll need to install some software on your computer. Don't worry - we'll guide you through each step!

### Required Software:
1. **Node.js** - The runtime environment for our application
2. **Git** - To download the code from GitHub
3. **PostgreSQL** - The database to store application data
4. **A Code Editor** (optional but recommended) - VS Code is great for beginners

---

## 🛠️ Step 1: Install Required Software

### 1.1 Install Node.js

**What is Node.js?** It's the engine that runs our application.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (Long Term Support) - it's the most stable
3. Run the installer and follow the setup wizard
4. **Important**: Make sure to check "Add to PATH" during installation

**Verify Installation:**
- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `node --version`
- You should see something like `v18.17.0`

### 1.2 Install Git

**What is Git?** It helps us download and manage code from GitHub.

1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download for your operating system
3. Install with default settings

**Verify Installation:**
- Open Command Prompt/Terminal
- Type: `git --version`
- You should see something like `git version 2.40.0`

### 1.3 Install PostgreSQL

**What is PostgreSQL?** It's our database that stores all the application data.

1. Go to [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Download for your operating system
3. During installation:
   - **Remember the password** you set for the `postgres` user - you'll need it later!
   - Use default port `5432`
   - Install all components

**Verify Installation:**
- The installer should have created a "pgAdmin" application
- Open pgAdmin to make sure PostgreSQL is running

### 1.4 Install VS Code (Optional but Recommended)

**What is VS Code?** A user-friendly code editor that makes it easier to work with code.

1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download and install
3. No special configuration needed

---

## 📥 Step 2: Download the Application

### 2.1 Choose a Location
- Create a folder on your computer where you want to store the application
- Example: `C:\Projects\` (Windows) or `~/Projects/` (Mac/Linux)

### 2.2 Download the Code
1. Open Command Prompt/Terminal
2. Navigate to your chosen folder:
   ```bash
   cd C:\Projects\          # Windows
   cd ~/Projects/           # Mac/Linux
   ```
3. Download the application:
   ```bash
   git clone https://github.com/arv-qa/iManageUploader.git
   ```
4. Enter the application folder:
   ```bash
   cd iManageUploader
   ```

---

## ⚙️ Step 3: Configure the Application

### 3.1 Install Application Dependencies

**What are dependencies?** These are additional code libraries our application needs to work.

1. In the Command Prompt/Terminal (make sure you're in the `iManageUploader` folder):
   ```bash
   npm install
   ```
2. This will take a few minutes - it's downloading and installing everything needed
3. You'll see lots of text scrolling - this is normal!

### 3.2 Set Up the Database

1. **Create the Database:**
   - Open pgAdmin (the PostgreSQL management tool)
   - Connect using the password you set during PostgreSQL installation
   - Right-click on "Databases" → "Create" → "Database"
   - Name it: `imanage_uploader`
   - Click "Save"

2. **Configure Database Connection:**
   - In your application folder, find the file `.env.example`
   - Copy it and rename the copy to `.env`
   - Open the `.env` file in a text editor (or VS Code)
   - Find this line:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/imanage_uploader
     ```
   - Replace `username` with `postgres`
   - Replace `password` with the password you set during PostgreSQL installation
   - Example:
     ```
     DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/imanage_uploader
     ```

### 3.3 Set Up Database Tables

1. In Command Prompt/Terminal (in the application folder):
   ```bash
   npm run db:push
   ```
2. This creates all the necessary tables in your database

---

## 🚀 Step 4: Run the Application

### 4.1 Start the Application
1. In Command Prompt/Terminal:
   ```bash
   npm run dev
   ```
2. You should see messages like:
   ```
   Server running on http://localhost:5000
   ```
3. **Don't close this window** - the application is running!

### 4.2 Open the Application
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: `http://localhost:5000`
3. You should see the iManage Uploader login page!

---

## 🎉 Step 5: Test the Application

### 5.1 First Login
1. On the login page, enter:
   - **Server URL**: `https://demo.imanage.com` (this is a demo server)
   - **Username**: `demo`
   - **Password**: `demo`
2. Click "Login"

### 5.2 Explore the Features
- You should now see the dashboard
- Try uploading a test file (any small document)
- Explore the different sections

---

## 🛑 How to Stop the Application

When you're done using the application:
1. Go back to the Command Prompt/Terminal where the application is running
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. The application will stop

To start it again later, just run `npm run dev` in the application folder.

---

## 🔧 Troubleshooting Common Issues

### Issue: "npm is not recognized"
**Solution:** Node.js wasn't installed properly or not added to PATH
- Reinstall Node.js and make sure to check "Add to PATH"
- Restart your Command Prompt/Terminal

### Issue: "Database connection failed"
**Solution:** Check your database configuration
- Make sure PostgreSQL is running (check pgAdmin)
- Verify the password in your `.env` file is correct
- Make sure the database `imanage_uploader` exists

### Issue: "Port 5000 is already in use"
**Solution:** Another application is using that port
- Close other applications that might be using port 5000
- Or change the port in your `.env` file: `PORT=3000`

### Issue: Application won't start
**Solution:** Try these steps:
1. Delete the `node_modules` folder
2. Run `npm install` again
3. Try starting with `npm run dev`

---

## 📁 Understanding the Application Structure

Here's what the main folders contain:

```
iManageUploader/
├── client/          # The web interface (what you see in the browser)
├── server/          # The backend logic (handles data and file uploads)
├── shared/          # Code shared between client and server
├── .env             # Your configuration file (passwords, database info)
├── package.json     # Lists all the dependencies
└── README.html      # Main documentation
```

---

## 🆘 Getting Help

If you run into problems:

1. **Check the Terminal/Command Prompt** - error messages often explain what's wrong
2. **Verify all software is installed** - run the version commands from Step 1
3. **Check your `.env` file** - make sure database password is correct
4. **Restart everything** - sometimes a fresh start helps:
   - Stop the application (Ctrl+C)
   - Close Command Prompt/Terminal
   - Open a new one and try again

---

## 🎯 Next Steps

Once you have the application running:

1. **Explore the Features** - try uploading different types of files
2. **Read the Documentation** - check out `README.html` for more details
3. **Customize Settings** - modify the `.env` file for your specific needs
4. **Connect to Real iManage** - replace the demo server with your actual iManage server

---

## 📝 Quick Reference Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start application | `npm run dev` |
| Stop application | `Ctrl + C` |
| Set up database | `npm run db:push` |
| Check Node.js version | `node --version` |
| Check Git version | `git --version` |

---

**Congratulations! 🎉** You now have the iManage Uploader running on your local machine. The application is ready to help you upload documents to iManage Work efficiently!

---

## 🔄 Daily Usage

### Starting the Application (After Initial Setup)
1. Open Command Prompt/Terminal
2. Navigate to the application folder:
   ```bash
   cd C:\Projects\iManageUploader    # Windows
   cd ~/Projects/iManageUploader     # Mac/Linux
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open browser and go to: `http://localhost:5000`

### Stopping the Application
- Press `Ctrl + C` in the Command Prompt/Terminal
- Close the browser tab

---

## 🔒 Security Notes

- The `.env` file contains sensitive information (database passwords)
- Never share your `.env` file with others
- For production use, change all default passwords
- The demo credentials are only for testing

---

## 📞 Support Information

- **Documentation**: Check `README.html` for detailed features
- **API Reference**: See `API_DOCUMENTATION.html` for technical details
- **Development Guide**: Read `DEVELOPMENT.html` if you want to modify the code

**Happy uploading! 🚀**
