---
sidebar_position: 9
---

# Troubleshooting

Solutions to common issues with Periodix-Planner.

## 🔍 General Troubleshooting

### Check Developer Console

The Developer Console shows errors and warnings:

1. Open Developer Console: **Ctrl/Cmd + Shift + I**
2. Look for errors related to "Periodix-Planner"
3. Note error messages for reference
4. Check if errors occur during specific actions

### Verify Plugin is Enabled

1. Go to **Settings** → **Community plugins**
2. Verify **Periodix-Planner** is listed
3. Ensure it's **enabled** (toggle is on)
4. If not enabled, enable it and restart Obsidian

### Restart Obsidian

Many issues are resolved by restarting:
1. Close Obsidian completely
2. Wait a few seconds
3. Reopen Obsidian
4. Check if issue persists

## 📅 Note Generation Issues

### Notes Not Being Generated

**Symptoms:**
- Notes don't appear in folders
- Auto-generation doesn't work
- Manual generation fails

**Solutions:**

1. **Check Auto-Generation Settings**
   - Go to **Settings** → **Periodix-Planner** → **Generation**
   - Verify **Auto-generate future periods** is enabled
   - Check generation rules

2. **Verify Folder Paths**
   - Go to **Settings** → **Periodix-Planner** → **Folders**
   - Ensure folder paths are correct
   - Check that folders exist or can be created

3. **Try Manual Generation**
   - Use command: **"Generate all periods for today"**
   - Check if manual generation works
   - Review error messages in console

### Wrong Note Names

**Symptoms:**
- Notes have incorrect names
- Format doesn't match settings
- Names don't sort correctly

**Solutions:**

1. **Check Naming Settings**
   - Go to **Settings** → **Periodix-Planner** → **Naming**
   - Verify format strings are correct
   - Test format syntax

2. **Verify Date Calculations**
   - Check date/time settings
   - Ensure timezone is correct
   - Verify date calculations

3. **Regenerate Notes**
   - Delete incorrectly named notes
   - Regenerate with correct settings
   - Verify new names are correct

## ⏱️ Time Budget Issues

### Time Budget Block Not Rendering

**Symptoms:**
- Code block shows as plain text
- No visualization appears
- Block is empty

**Solutions:**

1. **Check Code Block Language**
   - Ensure language is `periodic-planner`
   - Format: ` ```periodic-planner `
   - Not: ` ```periodic-planner` or ` ```periodic planner `

### Get Help

If issues persist:

1. **Check Documentation**
   - Review relevant documentation pages
   - Check FAQ for similar issues
   - Review troubleshooting sections

2. **Search GitHub Issues**
   - Search existing issues
   - Check if issue is known
   - Review solutions

3. **Open New Issue**
   - Provide detailed description
   - Include error messages
   - Share relevant settings
   - Include steps to reproduce

---

**Still having issues?** [Open an issue on GitHub](https://github.com/Real1tyy/Periodix-Planner/issues) with details about your problem.
