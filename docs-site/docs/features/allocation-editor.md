---
sidebar_position: 3
---

# Allocation Editor

The Allocation Editor is an interactive modal that provides powerful tools for editing time allocations with visual feedback and intuitive controls.

## 🎯 Overview

The Allocation Editor allows you to:

- Set hours for each category
- Use quick-fill buttons for common percentages
- Drag percentage bars to adjust allocations
- Enter custom percentages
- See parent budget warnings
- Track remaining hours
- Undo/redo changes

## 🚀 Opening the Editor

### From Time Budget Block

1. Click the **Edit allocations** button
2. The Allocation Editor modal opens


## 📊 Editor Interface

### Summary Section

At the top of the editor, you'll see:

- **Allocated**: Total hours allocated across all categories
- **Remaining**: Hours still available
- **Total**: Total hours available in the period
- **Status indicators**: Color-coded (green/yellow/red)

### Category List

Each category displays:

- **Color dot**: Visual category identifier
- **Category name**: The name you defined
- **Input field**: Direct hour entry
- **Quick-fill buttons**: 10%, 25%, 50%, Max
- **Custom percentage input**: Enter exact percentage
- **Percentage bar**: Visual representation (draggable)
- **Percentage label**: Shows current allocation percentage
- **Parent budget info**: Shows parent allocation status (if applicable)
- **Child budget info**: Shows child allocations (if applicable)

## 🎮 Interaction Methods

### 1. Direct Input

Type hours directly in the input field:

1. Click the input field
2. Type the number of hours (e.g., `8`)
3. Press Enter or click away
4. Allocation updates automatically

**Features:**
- Supports decimals (e.g., `8.5`)
- Auto-updates on input
- Validates against total available hours

### 2. Quick-Fill Buttons

Click preset percentage buttons:

- **10%** - Allocates 10% of available hours
- **25%** - Allocates 25% of available hours
- **50%** - Allocates 50% of available hours
- **Max** - Allocates maximum available hours

**How it works:**
- Calculates from total available hours
- Respects "Fill from parent" setting
- Updates input field and percentage bar

### 3. Drag Percentage Bar

Drag the percentage bar to adjust allocation:

1. Click and hold on the percentage bar
2. Drag left or right
3. Release to set the value
4. Hours update automatically

**Features:**
- Smooth dragging experience
- Visual feedback during drag
- Works on desktop and touch devices

### 4. Custom Percentage Input

Enter exact percentages:

1. Type percentage in the custom input field (e.g., `35`)
2. Click **Set** or press Enter
3. Allocation updates to that percentage

**Calculation:**
- Based on total available hours
- Respects "Fill from parent" setting
- Rounds to nearest 0.1 hours

## 🔄 Fill from Parent

When a category has a parent budget, you can use the **"Fill from parent"** checkbox:

1. Check the **"Fill from parent"** checkbox
2. Quick-fill buttons and percentage input now calculate from parent budget
3. Useful for maintaining proportional allocation

**Example:**
- Yearly Work budget: 2,000 hours
- Quarterly Work budget: 500 hours
- With "Fill from parent" checked, 50% = 250 hours (from quarterly budget)

## ⚠️ Budget Warnings

### Parent Budget Warnings

When you exceed a parent budget:

- ⚠️ Warning icon appears
- Text shows: `⚠️ Parent: Xh / Yh (Z%)`
- Category item highlighted in red
- Percentage bar shows over-budget status

## ↶ Undo/Redo

### Using Buttons

- Click **↶ Undo** to revert changes
- Click **↷ Redo** to restore changes
- Buttons are disabled when no history available

### Keyboard Shortcuts

- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo

**Features:**
- Tracks all allocation changes
- Maintains separate undo/redo stacks
- Preserves input focus during undo/redo

## 💾 Saving Changes

### Save Allocations

1. Click **Save allocations** button
2. Allocations are written to note frontmatter
3. Modal closes
4. Time budget block updates

### Cancel

1. Click **Cancel** button
2. All changes are discarded
3. Modal closes
4. Original allocations remain unchanged

## 🎨 Visual Feedback

### Percentage Bars

- Color matches category color
- Width represents allocation percentage
- Draggable for easy adjustment
- Updates in real-time

### Summary Indicators

- Color-coded status classes
- Percentage display
- Clear visual hierarchy

---

**Related:** Learn about [Time Budgeting](/features/time-budgeting) and [Visual Statistics](/features/visual-statistics).
