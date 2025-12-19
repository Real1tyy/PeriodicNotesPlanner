---
sidebar_position: 7
---

# Configuration

Periodix-Planner offers comprehensive configuration options to customize the plugin to your workflow and preferences.

## Settings Overview

Access settings via **Settings** → **Periodix-Planner**. The settings are organized into tabs:

- **Folders** - Configure where notes are stored
- **Naming** - Customize note naming formats
- **Time budget** - Set available hours per period
- **Categories** - Define time investment categories
- **Properties** - Customize frontmatter property names
- **Generation** - Control auto-generation behavior

## Folders Tab

Configure where periodic notes are stored in your vault.

| Setting | Description | Default |
|---------|-------------|---------|
| **Daily Folder** | Where daily notes are stored | `Periodic/Daily` |
| **Weekly Folder** | Where weekly notes are stored | `Periodic/Weekly` |
| **Monthly Folder** | Where monthly notes are stored | `Periodic/Monthly` |
| **Quarterly Folder** | Where quarterly notes are stored | `Periodic/Quarterly` |
| **Yearly Folder** | Where yearly notes are stored | `Periodic/Yearly` |

**Note:** Folders are created automatically if they don't exist.

[Learn more about note generation](/features/note-generation)

## Naming Tab

Customize how periodic notes are named using [Luxon format tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).

| Period | Setting | Default Format | Example |
|--------|---------|----------------|---------|
| Daily | **Daily Format** | `YYYY-MM-DD` | `2025-01-15` |
| Weekly | **Weekly Format** | `YYYY-[W]WW` | `2025-W03` |
| Monthly | **Monthly Format** | `YYYY-MM` | `2025-01` |
| Quarterly | **Quarterly Format** | `YYYY-[Q]Q` | `2025-Q1` |
| Yearly | **Yearly Format** | `YYYY` | `2025` |

**Common format tokens:**
- `YYYY` - 4-digit year
- `MM` - 2-digit month
- `DD` - 2-digit day
- `[W]WW` - Week number with "W" prefix
- `[Q]Q` - Quarter number with "Q" prefix

## Time Budget Tab

Configure available hours for each period type and inheritance behavior.

| Setting | Description | Default |
|---------|-------------|---------|
| **Hours per Week** | Base weekly hour budget for planning | `40` |
| **Automatically inherit parent percentages** | Auto-fill child periods with parent's allocation distribution | `false` |

**Hours calculations:**
- Monthly = Weekly × 4.33
- Quarterly = Monthly × 3
- Yearly = Quarterly × 4

Enable auto-inherit to fill child periods based on parent percentages. [Learn more](/features/time-budgeting#auto-inherit-parent-percentages)

## Categories Tab

Define your time investment categories for budget tracking.

**Adding categories:**
1. Click **Add Category**
2. Enter category name
3. Choose color (hex format)
4. Click **Save**

**Managing categories:**
- Click category to edit
- Delete removes category from all allocations

[Learn more about categories](/features/categories)

## Properties Tab

Customize frontmatter property names used for note interconnection.

| Setting | Description | Default |
|---------|-------------|---------|
| **Previous Property** | Property name for previous period link | `Previous` |
| **Next Property** | Property name for next period link | `Next` |
| **Parent Property** | Property name for parent period link | `Parent` |
| **Week Property** | Property name for week link | `Week` |
| **Month Property** | Property name for month link | `Month` |
| **Quarter Property** | Property name for quarter link | `Quarter` |
| **Year Property** | Property name for year link | `Year` |
| **Hours Available Property** | Property name for available hours | `Hours Available` |

[Learn more about note interconnection](/features/note-interconnection)

## Generation Tab

Control automatic note generation behavior.

| Setting | Description | Default |
|---------|-------------|---------|
| **Auto-generate future periods** | Automatically generate notes on startup | `true` |
| **Generate next period in advance** | Always generate next period | `true` |

When enabled, the plugin generates notes when Obsidian opens and creates next periods automatically while respecting existing notes.

[Learn more about note generation](/features/note-generation)

---

**Next:** Check out the [FAQ](/faq) for common questions about configuration.
