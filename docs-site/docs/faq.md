---
sidebar_position: 8
---

# Frequently Asked Questions

Common questions about Periodix-Planner and their answers.

## 📦 Installation

### How do I install Periodix-Planner?

See the [Installation Guide](/installation) for detailed instructions. The plugin can be installed via:

- Community Plugins (once approved)
- BRAT (for beta versions)
- Manual installation from GitHub releases

### Is Periodix-Planner available in Community Plugins?

Periodix-Planner is currently in development. Once ready, it will be submitted for Community Plugins approval. For now, use BRAT or manual installation.

### Can I use BRAT to install?

Yes! BRAT is the recommended method for early access. See the [Installation Guide](/installation) for BRAT setup instructions.

## ⚙️ Configuration

### Where are my notes stored?

Notes are stored in folders you configure in **Settings** → **Periodix-Planner** → **Folders** tab. Default folders are:

- `Periodic/Daily`
- `Periodic/Weekly`
- `Periodic/Monthly`
- `Periodic/Quarterly`
- `Periodic/Yearly`

### Can I change the note naming format?

Yes! Go to **Settings** → **Periodix-Planner** → **Naming** tab to customize format strings for each period type.

### How do I set up categories?

Go to **Settings** → **Periodix-Planner** → **Categories** tab, then click **Add Category** to create new categories with custom names and colors.

### Can I customize frontmatter property names?

Yes! Go to **Settings** → **Periodix-Planner** → **Properties** tab to customize all property names.

## 📅 Note Generation

### How does auto-generation work?

When enabled, the plugin automatically generates periodic notes when you open Obsidian. It creates the current period and next period for each type (daily, weekly, monthly, quarterly, yearly).

### Will the plugin overwrite my existing notes?

No! The plugin never overwrites existing notes. It only:

- Creates new notes if they don't exist
- Updates frontmatter if properties are missing
- Adds time budget blocks if missing

### Can I disable auto-generation?

Yes! Go to **Settings** → **Periodix-Planner** → **Generation** tab and disable **Auto-generate future periods**.

### How do I generate notes manually?

Use the command **"Generate all periods for today"** from the command palette (Ctrl/Cmd + P).

## ⏱️ Time Budgeting

### What happens if I exceed the available hours?

The plugin shows warnings:

- **Red** when over budget
- **Parent budget warnings** when exceeding parent allocation

### How does parent budget tracking work?

When you allocate time in a child period (e.g., weekly), the plugin tracks it against the parent period's budget (e.g., monthly). If you exceed the parent budget, warnings appear.

## 🔗 Navigation

### How do I navigate between periods?

Use commands from the command palette:

- **Go to previous period**
- **Go to next period**
- **Go to parent period**
- **Open current [period] note**

### Can I assign hotkeys to navigation commands?

Yes! Go to **Settings** → **Hotkeys**, search for "Periodix-Planner", and assign hotkeys to any command.

### Do links work if notes don't exist?

Yes! When you click a link or use a navigation command, the plugin automatically creates the target note if it doesn't exist.

## 🤝 Support

### Where can I get help?

- **Documentation**: Check this documentation site
- **GitHub Issues**: [Open an issue](https://github.com/Real1tyy/Periodix-Planner/issues)
- **Troubleshooting**: See the [Troubleshooting Guide](/troubleshooting)

### How do I report a bug?

1. Go to [GitHub Issues](https://github.com/Real1tyy/Periodix-Planner/issues)
2. Click **New Issue**
3. Select **Bug Report**
4. Provide details about the issue

### Can I request a feature?

Yes! Open a [feature request](https://github.com/Real1tyy/Periodix-Planner/issues) on GitHub with:

- Clear description
- Use case
- Examples if applicable

---

**Still have questions?** Check the [Troubleshooting Guide](/troubleshooting) or [open an issue on GitHub](https://github.com/Real1tyy/Periodix-Planner/issues).
