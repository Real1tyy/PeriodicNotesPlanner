---
sidebar_position: 11
---

# Bases Integration

Periodix-Planner seamlessly integrates with the [Bases plugin](https://help.obsidian.md/bases) to display tasks and notes filtered by the current period's date range.

## Overview

The Bases integration provides two powerful ways to view your period-specific tasks:

1. **Sidebar View** - Persistent task view that updates automatically as you navigate between periodic notes

Both views automatically filter content from your tasks directory based on the period interval (day, week, month, quarter, or year) of the currently open note.

## Setup

### 1. Configure Tasks Directory

1. Open **Settings** → **Periodix-Planner**
2. Navigate to the **Bases** tab
3. Set **Tasks directory** to your tasks folder path (e.g., `Tasks`, `Projects/Tasks`)

**Important:** The tasks directory must be configured for the Bases integration to work. Leave it empty to disable Bases-related features.

### 2. Configure Date Property

Set the frontmatter property name used for task dates:

- **Date property**: The property name in your task notes (default: `Date`)

Example task note frontmatter:
```yaml
---
Date: 2026-01-15
status: in-progress
tags: [work, project-alpha]
---
```

### 3. Configure Display Properties

Customize which properties appear in the Bases table view:

- **Properties to show**: Comma-separated list of property names (e.g., `text,tags,status`)

The view always shows `file.name` and your configured date property, plus any additional properties you specify.

### How It Works

The sidebar view:

- **Auto-updates** when you switch between periodic notes
- **Filters automatically** based on the current period's date range
- **Shows empty state** when:
  - No periodic note is open
  - Tasks directory is not configured
  - Current file is not a periodic note

## Related Features

- **[Period Children](/features/period-children)** - View child periods (e.g., weeks in a month)
- **[Navigation](/features/navigation)** - Commands for moving between periods
- **[Note Interconnection](/features/note-interconnection)** - How periodic notes link together

---

**Next:** Learn about [Integrations](/integrations) for ActivityWatch and Templater plugins.
