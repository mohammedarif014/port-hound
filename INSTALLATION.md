# PortHound - Installation & Setup Guide

## 📦 What's Included

The PortHound.zip file contains a complete, ready-to-run web application:

```
PortHound/
├── index.html              # Main application (OPEN THIS!)
├── README.md              # Full documentation
├── QUICKSTART.md          # Quick start guide
├── css/
│   ├── styles.css         # Main styles
│   └── animations.css     # Animations
└── js/
    ├── scanner.js         # Core logic
    ├── verification.js    # Verification engine
    └── ui.js             # UI helpers
```

## 🚀 Installation Steps

### Step 1: Extract the ZIP File

**Windows:**
1. Right-click `PortHound.zip`
2. Select "Extract All..."
3. Choose destination folder
4. Click "Extract"

**macOS:**
1. Double-click `PortHound.zip`
2. It will automatically extract to a folder

**Linux:**
```bash
unzip PortHound.zip
cd PortHound
```

### Step 2: Open in VS Code (Recommended)

1. **Install VS Code** (if not installed)
   - Download from: https://code.visualstudio.com/

2. **Open Project**
   - Launch VS Code
   - File → Open Folder
   - Select the `PortHound` folder

3. **Install Live Server Extension**
   - Click Extensions icon (or Ctrl+Shift+X)
   - Search "Live Server"
   - Install "Live Server" by Ritwick Dey

4. **Run the Application**
   - Right-click `index.html` in VS Code
   - Select "Open with Live Server"
   - Browser opens automatically at `http://localhost:5500`

### Step 3: Alternative Methods

**Method A: Direct Browser Open**
```
1. Navigate to PortHound folder
2. Double-click index.html
3. Opens in default browser
```

**Method B: Python HTTP Server**
```bash
cd PortHound
python3 -m http.server 8000
# Open browser to http://localhost:8000
```

**Method C: Node.js HTTP Server**
```bash
cd PortHound
npx http-server -p 8000
# Open browser to http://localhost:8000
```

## ✅ Verify Installation

After opening, you should see:
- ✅ Header with "PortHound" logo
- ✅ Target input field
- ✅ Four scan mode cards
- ✅ Launch button at bottom

## 🎯 First Scan

Try this to test:
```
1. Enter target: "scanme.nmap.org"
2. Select: "Multi-Pass Verification"
3. Click: "Launch PortHound Scanner"
4. Watch the scan progress
5. Review results
```

## 📁 Project Structure Explained

### Core Files
- **index.html** - Main page (start here!)
- **README.md** - Complete documentation
- **QUICKSTART.md** - Quick reference

### CSS Files
- **styles.css** - All visual styling
- **animations.css** - Smooth animations

### JavaScript Files
- **scanner.js** - Scanning logic & modes
- **verification.js** - Confidence scoring & reports
- **ui.js** - User interface helpers

## 🔧 Configuration (Optional)

### Customize Scan Modes

Edit `js/scanner.js` to modify scan configurations:

```javascript
const scanModes = {
    'multi-pass': {
        phases: [
            // Add or modify phases here
        ]
    }
};
```

### Customize Vulnerabilities

Edit `js/scanner.js` vulnerability database:

```javascript
const vulnerabilityDatabase = {
    80: [
        // Add vulnerabilities for port 80
    ]
};
```

### Customize Styling

Edit `css/styles.css` to change colors:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    /* Modify colors here */
}
```

## 🌐 Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Not Supported:**
- ❌ Internet Explorer (any version)

## 📱 Mobile Support

PortHound is responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🐛 Troubleshooting

### Issue: Page doesn't load properly

**Solution:**
1. Check browser is supported
2. Try different browser
3. Clear browser cache
4. Open browser console (F12) for errors

### Issue: Styles not loading

**Solution:**
1. Ensure all CSS files extracted correctly
2. Check css/ folder exists
3. Verify file paths in index.html

### Issue: JavaScript errors

**Solution:**
1. Ensure all JS files extracted correctly
2. Check js/ folder exists
3. Open browser console (F12)
4. Look for missing file errors

### Issue: Can't export reports

**Solution:**
1. Check browser allows file downloads
2. Try different browser
3. Check popup blockers
4. Grant download permissions

## 🔒 Security Notes

### Client-Side Only
- All code runs in your browser
- No data sent to external servers
- No installation of system tools

### Simulation Mode
- This version simulates Nmap scans
- For demonstration and learning
- Real scanning requires backend

### Production Use
For real scanning, you need:
1. Backend server (Node.js/Python)
2. Actual Nmap installation
3. Proper authentication
4. Security measures

## 📚 Learning Resources

### Read First
1. QUICKSTART.md - Basic usage
2. README.md - Full documentation
3. Code comments - Implementation details

### Practice
1. Run sample scans
2. Try different modes
3. Compare results
4. Export reports
5. Study confidence scores

## 🎓 Educational Use

Perfect for learning:
- Web application development
- Security scanning concepts
- Nmap techniques
- UI/UX design
- JavaScript programming

## 📞 Getting Help

1. **Check Documentation**
   - README.md for details
   - QUICKSTART.md for basics

2. **Browser Console**
   - Press F12
   - Check Console tab
   - Look for error messages

3. **Code Review**
   - JS files have comments
   - Study the implementation
   - Understand the logic

## 🔄 Updates

To update PortHound:
1. Download new version
2. Extract to new folder
3. Copy your customizations
4. Replace old version

## 💡 Tips

- **Use Live Server** for best experience
- **Keep browser updated** for compatibility
- **Read QUICKSTART.md** for quick reference
- **Check console** if issues occur
- **Study the code** to learn more

## ✨ Next Steps

1. ✅ Extract ZIP file
2. ✅ Open in VS Code
3. ✅ Install Live Server
4. ✅ Open with Live Server
5. ✅ Run first scan
6. ✅ Read documentation
7. ✅ Explore features
8. ✅ Customize as needed

## 🎉 You're Ready!

PortHound is now installed and ready to use.

**Start scanning responsibly!**

---

**Need Help?** Open QUICKSTART.md or README.md

**Having Issues?** Check browser console (F12)

**Want to Learn?** Study the code and comments