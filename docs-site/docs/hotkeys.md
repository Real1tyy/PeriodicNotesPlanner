---
sidebar_position: 8
---

# Hotkeys

Periodix-Planner provides command palette commands that can be assigned custom hotkeys in Obsidian. Access these commands via **Command Palette** (Ctrl/Cmd + P) or assign hotkeys in **Settings** → **Hotkeys**.

## Note Generation Commands

### Generate all periods for today

**Command ID:** `periodic-planner:generate-today`

Generates notes for all enabled period types that correspond to the current date (today's daily, this week's weekly, this month's monthly, etc.).

**Behavior:**
- Creates notes that don't exist yet
- Skips notes that already exist
- Shows notification with creation summary

### Generate future periods

**Command ID:** `periodic-planner:generate-periods-ahead`

Runs the auto-generation system to create future period notes based on your "Generate periods ahead" setting.

**Behavior:**
- Generates notes X periods into the future (configured in Generation settings)
- Respects enabled period types
- Shows summary of created, existing, and failed notes

## Navigation Commands

### Go to previous period

**Command ID:** `periodic-planner:go-to-previous`

Navigates to the previous period note from the currently open periodic note.

**Behavior:**
- Uses the `Previous` property from frontmatter
- Creates the note if it doesn't exist
- Only available when viewing a periodic note

### Go to next period

**Command ID:** `periodic-planner:go-to-next`

Navigates to the next period note from the currently open periodic note.

**Behavior:**
- Uses the `Next` property from frontmatter
- Creates the note if it doesn't exist
- Only available when viewing a periodic note

### Go to parent period

**Command ID:** `periodic-planner:go-to-parent`

Navigates to the parent period note from the currently open periodic note.

**Behavior:**
- Uses the `Parent` property from frontmatter
- Creates the note if it doesn't exist
- Only available when viewing a periodic note with a parent
- Example: From daily note → weekly note, from weekly → monthly, etc.

### Go to child period

**Command ID:** `periodic-planner:go-to-child`

Navigates to a child period note from the currently open periodic note.

**Behavior:**
- Opens the most relevant child period
- If viewing the current period, opens the current child (e.g., today from this week)
- If viewing a past/future period, opens the first child
- Only available when viewing a periodic note with children
- Example: From weekly note → daily note, from monthly → weekly, etc.

## Quick Open Commands

Opens or creates notes for the specified period type.

**Behavior:**
- Generates the note if it doesn't exist
- Opens the note in the current pane

| Command | Command ID | Period |
|---------|-----------|---------|
| Open today's daily note | `periodic-planner:open-daily` | Today |
| Open yesterday's daily note | `periodic-planner:open-yesterday` | Yesterday |
| Open current weekly note | `periodic-planner:open-weekly` | Current week |
| Open current monthly note | `periodic-planner:open-monthly` | Current month |
| Open current quarterly note | `periodic-planner:open-quarterly` | Current quarter |
| Open current yearly note | `periodic-planner:open-yearly` | Current year |

## PDF Commands

**Note:** PDF commands are only available when **Enable PDF commands** is enabled in the Generation settings tab.

Opens the PDF version of notes for the specified period type in a new detached window.

**Behavior:**
- Generates the note if it doesn't exist
- Opens the PDF version (`.md.pdf`) in a detached window
- Shows error if PDF doesn't exist

| Command | Command ID | Period |
|---------|-----------|---------|
| Open today's daily note (PDF) | `periodic-planner:open-daily-pdf` | Today |
| Open yesterday's daily note (PDF) | `periodic-planner:open-yesterday-pdf` | Yesterday |
| Open current weekly note (PDF) | `periodic-planner:open-weekly-pdf` | Current week |
| Open current monthly note (PDF) | `periodic-planner:open-monthly-pdf` | Current month |
| Open current quarterly note (PDF) | `periodic-planner:open-quarterly-pdf` | Current quarter |
| Open current yearly note (PDF) | `periodic-planner:open-yearly-pdf` | Current year |

## Task Management Commands

### Show child periods

**Command ID:** `periodic-planner:show-children`

Opens a modal showing all child periods with their associated Bases tasks.

**Behavior:**
- Only available when viewing a periodic note with children
- Not available for daily notes
- Shows tasks filtered by child period date ranges
- Provides quick navigation to child notes

### Open Period Tasks sidebar

**Command ID:** `periodic-planner:open-period-bases-sidebar`

Opens the Period Tasks sidebar view for the currently open periodic note.

**Behavior:**
- Opens in right sidebar by default
- Shows Bases-filtered tasks for the current period
- Updates automatically when switching notes

---

**Next:** Learn about [integrations](/integrations) with other plugins.
