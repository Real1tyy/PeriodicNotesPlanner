---
sidebar_position: 5
---

# Note Interconnection

![Note interconnection screenshot](/img/features/note-interconnection.png)

All periodic notes in Periodix-Planner are intelligently linked through frontmatter properties, creating a navigable web of time that lets you zoom in and out of your planning horizon effortlessly.

## 🔗 Link Structure

Each periodic note contains links to:

- **Previous period** - Same type, earlier in time
- **Next period** - Same type, later in time
- **Parent period** - The period that contains this one
- **Ancestor periods** - All periods above in the hierarchy

## 📊 Hierarchy

```
Year (2025)
├── Quarter (2025-Q1)
│   ├── Month (2025-01)
│   │   ├── Week (2025-W01)
│   │   │   ├── Day (2025-01-01)
│   │   │   ├── Day (2025-01-02)
│   │   │   └── ...
│   │   └── Week (2025-W02)
│   └── Month (2025-02)
└── Quarter (2025-Q2)
```

## 🔍 Frontmatter Properties

### Daily Note Example

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

### Weekly Note Example

```yaml
---
previous: "[[2025-W02]]"
next: "[[2025-W04]]"
month: "[[2025-01]]"
quarter: "[[2025-Q1]]"
year: "[[2025]]"
hours_available: 168
---
```

### Monthly Note Example

```yaml
---
previous: "[[2024-12]]"
next: "[[2025-02]]"
quarter: "[[2025-Q1]]"
year: "[[2025]]"
hours_available: 730
---
```

## 🧭 Navigation

### Using Commands

**Go to Previous Period**
- Command: "Go to previous period"
- Navigates to the previous period of the same type
- Creates note if it doesn't exist

**Go to Next Period**
- Command: "Go to next period"
- Navigates to the next period of the same type
- Creates note if it doesn't exist

**Go to Parent Period**
- Command: "Go to parent period"
- Navigates to the parent period
- Creates note if it doesn't exist

**Open Current Period**
- Commands: "Open today's daily note", "Open current weekly note", etc.
- Opens or creates the current period note

### Using Links

Click any link in frontmatter to:
- Navigate to that period
- Create the note if it doesn't exist
- Open the note in the current view

## 🔄 Automatic Updates

The plugin automatically:

- **Updates links** when notes are generated
- **Maintains consistency** across all notes
- **Creates missing links** when notes are opened
- **Preserves existing links** when updating frontmatter

## 🎯 Use Cases

### Chronological Navigation

Navigate through time:
- Move forward/backward through days
- Jump to specific weeks
- Review monthly progress
- Plan quarterly goals

### Hierarchical Navigation

Zoom in and out:
- Daily → Weekly → Monthly → Quarterly → Yearly
- See the big picture (yearly)
- Drill down to details (daily)

### Context Switching

Quick context switching:
- See what week a day belongs to
- See what month a week belongs to
- See what quarter a month belongs to
- See what year everything belongs to

---

**Related:** Learn about [Navigation Commands](/features/navigation) and [Note Generation](/features/note-generation).
