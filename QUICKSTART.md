# PortHound - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Open the Application

**Option A: Direct Open (Simplest)**
1. Navigate to the PortHound folder
2. Double-click `index.html`
3. Your default browser will open the application

**Option B: VS Code Live Server (Recommended for Development)**
1. Open PortHound folder in VS Code
2. Install "Live Server" extension (if not installed)
3. Right-click `index.html` → "Open with Live Server"

**Option C: Python Simple Server**
```bash
# In PortHound folder
python -m http.server 8000
# Then open http://localhost:8000 in browser
```

### Step 2: Configure Your Scan

1. **Enter Target**
   - Type IP address: `192.168.1.1`
   - Or domain name: `example.com`

2. **Choose Scan Mode** (Click one)
   - 🔄 Multi-Pass Verification (Best accuracy)
   - ✅ Cross-Validation (Multiple techniques)
   - ⏱️ Timing Correlation (Speed-based verification)
   - 🔍 Comprehensive (Everything combined)

3. **Advanced Options** (Optional)
   - Click "⚙️ Advanced Options"
   - Enable/disable specific features
   - Recommended: Keep defaults

### Step 3: Run & Review

1. **Launch Scan**
   - Click "🚀 Launch PortHound Scanner"
   - Watch real-time progress
   - Monitor terminal output

2. **Review Results**
   - Check confidence score
   - Review detailed findings
   - See color-coded severity levels

3. **Export Report**
   - Click "💾 Export HTML" for formatted report
   - Click "📄 Export JSON" for data
   - Click "📊 Export CSV" for spreadsheet

## 📊 Understanding Results

### Confidence Levels
- **90-100%**: ✅ Confirmed - Trust this finding
- **75-89%**: ⚠️ High - Likely valid, verify if critical
- **60-74%**: ⚠️ Medium - Manual check recommended
- **Below 60%**: ❌ Low - Probably false positive

### Severity Colors
- 🔴 **CRITICAL** (9.0-10.0 CVSS) - Immediate action required
- 🟠 **HIGH** (7.0-8.9 CVSS) - Urgent remediation needed
- 🟡 **MEDIUM** (4.0-6.9 CVSS) - Schedule fixes
- 🔵 **LOW** (2.0-3.9 CVSS) - Nice to fix
- 🟢 **INFO** (0-1.9 CVSS) - Informational only

### Finding Categories
- ✅ **Confirmed**: Detected in 3+ verification methods
- ⚠️ **Potential**: Detected in 2+ methods, needs review
- ❌ **False Positive**: Low confidence, single detection

## 🎯 Example Workflow

### Scenario: Scanning Your Web Server

```
Target: 192.168.1.100
Mode: Multi-Pass Verification
Time: ~5 minutes

Results:
- Port 80: HTTP SQL Injection (CRITICAL, 95% confidence) ✅
- Port 443: SSL Weak Ciphers (MEDIUM, 88% confidence) ✅
- Port 22: SSH Open (INFO, 72% confidence) ⚠️
- Port 8080: HTTP (INFO, 45% confidence) ❌

Action Items:
1. Fix SQL injection immediately (confirmed)
2. Update SSL ciphers (high confidence)
3. Manually verify SSH finding
4. Ignore port 8080 (false positive)
```

## ⚡ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Start scan
- `Esc` - Stop scan (if running)

## 💡 Tips for Best Results

1. **Use Multi-Pass Mode** for important scans
2. **Run multiple times** for critical targets
3. **Check confidence scores** before acting
4. **Manual verification** for critical findings
5. **Compare results** over time

## ⚠️ Important Reminders

### Legal
- ✅ Only scan systems you own
- ✅ Get written permission for client systems
- ❌ Never scan without authorization
- ❌ Unauthorized scanning is illegal

### Technical
- This is a **simulation version**
- Real scanning requires **backend integration**
- Use for **learning and demonstration**
- **Production use** needs server-side Nmap

## 🐛 Troubleshooting

### Scan won't start
- Check you entered a valid target
- Try a different browser
- Check console for errors (F12)

### Results look wrong
- Try a different scan mode
- Check your internet connection
- Verify target is reachable

### Export not working
- Check browser allows downloads
- Try a different export format
- Check browser console (F12)

## 📚 Learn More

- Read full README.md for details
- Check scan methodology in docs
- Review Nmap command reference
- Study verification techniques

## 🎓 Next Steps

1. **Learn the basics** - Run sample scans
2. **Understand modes** - Try each mode
3. **Read reports** - Study exported reports
4. **Compare methods** - See how modes differ
5. **Master interpretation** - Learn to read confidence scores

## 📞 Need Help?

- Check README.md for detailed docs
- Review code comments in JS files
- Open browser console (F12) for debugging
- Look for error messages in terminal output

---

**Happy Hunting! 🔍**

Remember: Use responsibly and legally!