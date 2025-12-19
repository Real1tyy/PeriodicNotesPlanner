---
sidebar_position: 2
---

# Time Budgeting

![Time budgeting screenshot](/img/features/time-budgeting.png)

The time budgeting system allows you to allocate and track time across categories with hierarchical tracking from yearly down to daily periods.

## Overview

Time budgets flow down through the hierarchy:

```
Yearly (10,000 hours)
├── Quarterly (2,500 hours)
│   ├── Monthly (833 hours)
│   │   ├── Weekly (208 hours)
│   │   │   └── Daily (24 hours)
```

Each level tracks total hours available, allocated hours per category, remaining hours, and parent budget status.

## Setup

**Configure base hours:** Set your weekly hours in Settings → Time budget. The plugin automatically calculates monthly, quarterly, and yearly hours. [Learn more](/configuration#time-budget-tab)

**Define categories:** Add your time investment categories (Work, Health, Learning, etc.) with custom colors. [Learn more](/features/categories)

## Allocating Time

1. Open any periodic note
2. Click **Edit allocations** button
3. Use the allocation editor to distribute hours across categories

[Learn more about the Allocation Editor](/features/allocation-editor)

## Budget Tracking

**Visual indicators:**
- 🟢 Green - Within budget
- 🟡 Yellow - Approaching limit (80-100%)
- 🔴 Red - Over budget or exceeds parent allocation

**Parent budget tracking:** Child periods (daily, weekly, monthly, quarterly) are tracked against their parent period's budget. Warnings appear when allocations exceed parent limits.

**Remaining hours:** The allocation editor shows allocated hours, remaining hours, and allocation percentage.

## Hierarchical Budget Flow

Time budgets cascade through the hierarchy:

1. **Yearly → Quarterly:** Set yearly budgets, allocate quarterly portions, track remaining
2. **Quarterly → Monthly:** Monthly allocations tracked against quarterly limits
3. **Monthly → Weekly:** Weekly allocations tracked against monthly limits
4. **Weekly → Daily:** Daily allocations tracked against weekly limits

Warnings appear when child allocations exceed parent budgets.

## Visual Statistics

The time budget block displays pie charts and allocation tables showing category distribution, allocated hours, percentages, and parent budget status.

[Learn more about Visual Statistics](/features/visual-statistics)

## Advanced Features

### Auto-Inherit Parent Percentages {#auto-inherit-parent-percentages}

Automatically fill child periods based on the parent period's percentage distribution.

- **Enable globally:** Settings → Time budget → "Automatically inherit parent percentages"
- **Manual per-note:** Click "Fill parent" button in the Allocation Editor

Example: If parent is 50/30/20, child gets the same 50/30/20 split of its own total hours.

### Fill from Parent {#fill-from-parent}

Per-category option in the Allocation Editor that calculates percentages based on the parent's category budget instead of the child's total hours. Mix and match: some categories can follow the parent, others can be independent.

---

**Related:** [Allocation Editor](/features/allocation-editor) • [Visual Statistics](/features/visual-statistics) • [Configuration](/configuration#time-budget-tab)
