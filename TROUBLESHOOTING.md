# 🔧 iManage Uploader - Troubleshooting Guide

**Quick solutions to common problems you might encounter**

---

## 🚨 Installation Issues

### "npm is not recognized" or "node is not recognized"

**Problem:** Windows can't find Node.js or npm commands.

**Solutions:**
1. **Reinstall Node.js:**
   - Download from [nodejs.org](https://nodejs.org)
   - Choose LTS version
   - ✅ **Make sure to check "Add to PATH" during installation**
   - Restart your computer after installation

2. **Manual PATH fix:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"
   - In "System Variables", find "Path" and click "Edit"
   - Add: `C:\Program Files\nodejs\`
   - Restart Command Prompt

**Verify:** Open new Command Prompt and run `node --version`

---

### "Permission denied" (Mac/Linux)

**Problem:** Don't have permission to install packages globally.

**Solutions:**
1. **Use sudo (temporary fix):**
   ```bash
   sudo npm install
   ```

2. **Fix npm permissions (recommended):**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## 🗄️ Database Issues

### "Database connection failed"

**Problem:** Can't connect to PostgreSQL database.

**Check these in order:**

1. **Is PostgreSQL running?**
   - Windows: Check Services (services.msc) for "postgresql" service
   - Mac: `brew services list | grep postgresql`
   - Linux: `sudo systemctl status postgresql`

2. **Does the database exist?**
   - Open pgAdmin
   - Look for `imanage_uploader` database
   - If missing: Right-click "Databases" → "Create" → "Database"

3. **Is the password correct in .env file?**
   ```
   DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/imanage_uploader
   ```
   - Replace `YOUR_ACTUAL_PASSWORD` with your real PostgreSQL password

4. **Try connecting manually:**
   ```bash
   psql -h localhost -U postgres -d imanage_uploader
   ```

---

### "relation does not exist" errors

**Problem:** Database tables haven't been created.

**Solution:**
```bash
npm run db:push
```

If this fails, check database connection first.

---

## 🌐 Application Issues

### "Port 5000 is already in use"

**Problem:** Another application is using port 5000.

**Solutions:**
1. **Find what's using the port:**
   - Windows: `netstat -ano | findstr :5000`
   - Mac/Linux: `lsof -i :5000`

2. **Use a different port:**
   - Edit `.env` file
   - Add or change: `PORT=3000`
   - Access app at `http://localhost:3000`

3. **Kill the process using port 5000:**
   - Windows: `taskkill /PID [PID_NUMBER] /F`
   - Mac/Linux: `kill -9 [PID_NUMBER]`

---

### Application starts but shows blank page

**Problem:** Frontend not loading properly.

**Solutions:**
1. **Clear browser cache:**
   - Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

2. **Check browser console:**
   - Press `F12` to open developer tools
   - Look for error messages in Console tab

3. **Try different browser:**
   - Chrome, Firefox, Safari, Edge

4. **Check if all dependencies installed:**
   ```bash
   npm install
   ```

---

### "Cannot find module" errors

**Problem:** Missing dependencies or corrupted installation.

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules & del package-lock.json  # Windows

npm install
```

---

## 🔐 Login Issues

### "Authentication failed" with demo credentials

**Problem:** Demo server might be down or credentials changed.

**Solutions:**
1. **Try these demo credentials:**
   - Server: `https://demo.imanage.com`
   - Username: `demo`
   - Password: `demo`

2. **Check server URL format:**
   - Must start with `http://` or `https://`
   - No trailing slash

3. **Use your real iManage server:**
   - Replace demo URL with your actual iManage server
   - Use your real credentials

---

## 🔄 Performance Issues

### Application is very slow

**Solutions:**
1. **Check system resources:**
   - Close unnecessary applications
   - Ensure at least 4GB RAM available

2. **Database performance:**
   - Restart PostgreSQL service
   - Check disk space (need at least 1GB free)

3. **Network issues:**
   - Check internet connection
   - Try different network if possible

---

## 🛠️ Development Issues

### TypeScript errors

**Problem:** Code compilation errors.

**Solution:**
```bash
npm run check
```

Look at the error messages and fix the TypeScript issues, or contact support.

---

### Build fails

**Problem:** Application won't build for production.

**Solutions:**
1. **Clean build:**
   ```bash
   npm run build
   ```

2. **Check for errors:**
   - Look at the error output
   - Usually TypeScript or dependency issues

---

## 📱 Browser Issues

### Application doesn't work in Internet Explorer

**Problem:** IE is not supported.

**Solution:** Use a modern browser:
- Chrome (recommended)
- Firefox
- Safari
- Microsoft Edge

---

### Upload fails in browser

**Problem:** File uploads don't work.

**Solutions:**
1. **Check file size:**
   - Maximum file size is 50MB
   - Try with smaller files first

2. **Check file type:**
   - Supported: PDF, Word, Excel, Text, CSV
   - Try with a simple .txt file first

3. **Disable browser extensions:**
   - Ad blockers might interfere
   - Try in incognito/private mode

---

## 🆘 Getting More Help

### Step-by-step debugging:

1. **Check the terminal/command prompt** where you ran `npm run dev`
   - Look for error messages
   - Red text usually indicates errors

2. **Check browser developer tools:**
   - Press F12
   - Look in Console tab for errors
   - Look in Network tab for failed requests

3. **Restart everything:**
   - Stop the application (Ctrl+C)
   - Close terminal/command prompt
   - Restart PostgreSQL service
   - Open new terminal and try again

4. **Verify installation:**
   ```bash
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show 8.x.x or higher
   git --version     # Should show version number
   ```

### Still having issues?

1. **Check the logs:**
   - Look in the terminal where you ran `npm run dev`
   - Error messages usually explain what's wrong

2. **Try the setup script:**
   - Windows: Run `scripts\setup.bat`
   - Mac/Linux: Run `./scripts/setup.sh`

3. **Start fresh:**
   - Delete the entire application folder
   - Re-download from GitHub
   - Follow installation guide again

---

## 📞 Emergency Checklist

If nothing works, try this complete reset:

```bash
# 1. Stop the application
# Press Ctrl+C in the terminal

# 2. Delete everything and start over
cd ..
rm -rf iManageUploader  # Mac/Linux
rmdir /s iManageUploader  # Windows

# 3. Re-download
git clone https://github.com/arv-qa/iManageUploader.git
cd iManageUploader

# 4. Fresh install
npm install

# 5. Configure database
# Copy .env.example to .env
# Update database password

# 6. Setup database
npm run db:push

# 7. Start application
npm run dev
```

**Remember:** Most issues are caused by:
1. Incorrect database password in `.env` file
2. PostgreSQL not running
3. Node.js not properly installed
4. Missing dependencies

Take your time, read error messages carefully, and don't hesitate to start fresh if needed!
