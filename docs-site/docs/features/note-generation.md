---
sidebar_position: 4
---

# Automatic Note Generation

Periodix-Planner automatically generates periodic notes for all time periods, ensuring you always have the notes you need when you need them.

## 🎯 Overview

The plugin generates notes for:

- **Daily notes** - Generated for today and tomorrow
- **Weekly notes** - Generated for this week and next
- **Monthly notes** - Generated for this month and next
- **Quarterly notes** - Generated for this quarter and next
- **Yearly notes** - Generated for this year and next

## ⚙️ Generation Modes

### Auto-Generation

Automatic generation when Obsidian opens:

1. Go to **Settings** → **Periodix-Planner** → **Generation** tab
2. Enable **Auto-generate future periods**
3. The plugin will automatically create notes on startup

**Configuration:**
- Generate next period in advance
- Respect existing notes (won't overwrite)
- Configurable generation rules

## 📝 Generated Note Structure

Each generated note includes:

### Frontmatter Properties

```yaml
---
previous: "[[2025-01-14]]"
next: "[[2025-01-16]]"
week: "[[2025-W03]]"
month: "[[2025-01]]"
quarter: "[[2025-Q1]]"
year: "[[2025]]"
hours_available: 24
---
```

### Navigation Links

- **previous** - Link to previous period of same type
- **next** - Link to next period of same type
- **parent** - Link to parent period (e.g., week for daily notes)
- **ancestors** - Links to all ancestor periods (month, quarter, year)

### Time Budget Block

A time budget code block is automatically added:

````markdown
```periodic-planner

```
````

You can add allocations to this block, or use the allocation editor.

## 📁 File Organization

Notes are organized in configured folders:

```
Periodic/
├── Daily/
│   ├── 2025-01-15.md
│   └── 2025-01-16.md
├── Weekly/
│   ├── 2025-W03.md
│   └── 2025-W04.md
├── Monthly/
│   ├── 2025-01.md
│   └── 2025-02.md
├── Quarterly/
│   ├── 2025-Q1.md
│   └── 2025-Q2.md
└── Yearly/
    └── 2025.md
```

## 🎨 Naming Formats

Customize note names in **Settings** → **Naming**:

- **Daily**: `YYYY-MM-DD` (e.g., `2025-01-15`)
- **Weekly**: `YYYY-[W]WW` (e.g., `2025-W03`)
- **Monthly**: `YYYY-MM` (e.g., `2025-01`)
- **Quarterly**: `YYYY-[Q]Q` (e.g., `2025-Q1`)
- **Yearly**: `YYYY` (e.g., `2025`)

## 🔄 Generation Behavior

### Existing Notes

- **Won't overwrite** existing notes
- **Updates frontmatter** if note exists but properties are missing
- **Adds time budget block** if missing
- **Preserves** your content

### Missing Notes

- **Creates** note if it doesn't exist
- **Generates** all required frontmatter
- **Adds** time budget block
- **Creates** folder structure if needed

### Next Period Generation

The plugin always generates the **next period** in advance:

- Today's note + tomorrow's note
- This week's note + next week's note
- This month's note + next month's note
- This quarter's note + next quarter's note
- This year's note + next year's note

---

**Related:** Learn about [Note Interconnection](/features/note-interconnection) and [Configuration](/configuration).
