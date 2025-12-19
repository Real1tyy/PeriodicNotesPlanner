---
sidebar_position: 2
---

# Time Budgeting

![Time budgeting screenshot](/img/features/time-budgeting.png)

The time budgeting system in Periodix-Planner allows you to allocate and track time across categories with hierarchical tracking from yearly down to daily periods.

## 🎯 Overview

Time budgets flow down through the hierarchy:

```
Yearly (10,000 hours)
├── Quarterly (2,500 hours)
│   ├── Monthly (833 hours)
│   │   ├── Weekly (208 hours)
│   │   │   └── Daily (24 hours)
```

Each level tracks:
- **Total hours available** in the period
- **Allocated hours** per category
- **Remaining hours** after allocations
- **Parent budget status** (if over/under parent allocation)

## 📊 Setting Up Time Budgets

### 1. Configure Base Hours

Go to **Settings** → **Periodix-Planner** → **Time budget** tab:

- **Hours per Week**: Base weekly hour budget (default: 40)

The plugin automatically calculates:
- Monthly = Weekly × 4.33
- Quarterly = Monthly × 3
- Yearly = Quarterly × 4

### 2. Define Categories

Go to **Settings** → **Periodix-Planner** → **Categories** tab:

1. Click **Add Category**
2. Enter a name (e.g., "Work", "Health", "Learning")
3. Choose a color for visual identification
4. Repeat for all categories

## 💰 Allocating Time

### Using the Allocation Editor

1. Open any periodic note
2. Click **Edit allocations** button
4. Use the allocation editor to:
   - Set hours for each category
   - Use quick-fill buttons (10%, 25%, 50%, Max)
   - Drag percentage bars
   - Enter custom percentages
   - See parent budget warnings

## 🔍 Budget Tracking

### Visual Indicators

The plugin provides visual feedback on budget status:

- 🟢 **Green** - Within budget, healthy allocation
- 🟡 **Yellow** - Approaching limit (80-100% allocated)
- 🔴 **Red** - Over budget or over parent allocation

### Parent Budget Warnings

When allocating time in child periods, the plugin tracks parent budgets:

- **Quarterly** allocations are tracked against **Yearly** budgets
- **Monthly** allocations are tracked against **Quarterly** budgets
- **Weekly** allocations are tracked against **Monthly** budgets
- **Daily** allocations are tracked against **Weekly** budgets

**Warning indicators:**
- ⚠️ Shows when over parent budget
- Displays parent allocation percentage
- Highlights over-budget items in red

### Remaining Hours

The allocation editor shows:
- **Allocated**: Total hours allocated across all categories
- **Remaining**: Hours still available
- **Percentage**: Allocation percentage of total available

## 📈 Hierarchical Budget Flow

### Yearly → Quarterly

1. Set yearly category budgets (e.g., Work: 2,000 hours)
2. Allocate quarterly portions (e.g., Q1 Work: 500 hours)
3. Plugin tracks remaining yearly budget (1,500 hours left)

### Quarterly → Monthly

1. Quarterly allocation sets the limit for monthly allocations
2. Monthly allocations are tracked against quarterly budget
3. Warnings appear if monthly total exceeds quarterly budget

### Monthly → Weekly

1. Monthly allocation sets the limit for weekly allocations
2. Weekly allocations are tracked against monthly budget
3. Plugin calculates remaining monthly hours

### Weekly → Daily

1. Weekly allocation sets the limit for daily allocations
2. Daily allocations are tracked against weekly budget
3. Visual feedback shows daily progress

## 🎨 Visual Statistics

### Pie Chart

The time budget block displays a pie chart showing:
- Category distribution
- Color-coded segments
- Percentage labels
- Click to enlarge

### Allocation Table

Detailed table showing:
- Category name and color
- Allocated hours
- Percentage of total
- Parent budget status
- Child allocations (if applicable)

### Progress Tracking

- Visual progress bars
- Remaining hours display
- Budget status indicators
- Sortable columns

## 🔧 Advanced Features

### Auto-Inherit Parent Percentages {#auto-inherit-parent-percentages}

Auto-fill empty child periods (weekly/monthly/etc.) based on the **parent period’s percentage split**.

- **Enable**: Settings → **Periodix-Planner** → **Time budget** → **Automatically inherit parent percentages**
- **Manual**: In the Allocation Editor, click **Fill parent** to apply the parent split on demand

Example: Parent is 50/30/20 → child gets the same 50/30/20 of its own total hours.

### Fill from Parent {#fill-from-parent}

Per-category option in the Allocation Editor that changes how percentage actions are calculated:

- When enabled, **10% / 25% / 50% / custom %** use the **parent’s category budget** (not the child’s total)
- Mix and match: some categories can follow the parent, others can be independent

### Editing shortcuts

- **Undo**: Ctrl/Cmd + Z
- **Redo**: Ctrl/Cmd + Shift + Z

---

**Next:** Learn about the [Allocation Editor](/features/allocation-editor) for detailed editing features.
