import type { TFile } from "obsidian";
import type { PeriodType } from "../../constants";
import type { PeriodIndex } from "../../core/period-index";
import type { Category, TimeAllocation } from "../../types";
import { PERIOD_CONFIG } from "../../types";
import { buildCategoryNameToIdMap, type CategoryBudgetInfo } from "./parent-budget-tracker";

export interface ChildBudgetResult {
	budgets: Map<string, CategoryBudgetInfo>;
	totalChildrenAllocated: number;
}

function getDirectChildrenKey(periodType: PeriodType): keyof import("../../types").PeriodChildren | null {
	const directChildType = PERIOD_CONFIG[periodType].children[0];
	if (!directChildType) return null;
	return PERIOD_CONFIG[directChildType].childrenKey;
}

export async function getChildBudgetsFromIndex(
	file: TFile,
	periodType: PeriodType,
	currentAllocations: TimeAllocation[],
	periodIndex: PeriodIndex,
	categories: Category[]
): Promise<ChildBudgetResult> {
	const emptyResult: ChildBudgetResult = {
		budgets: new Map(),
		totalChildrenAllocated: 0,
	};

	if (periodType === "daily") {
		return emptyResult;
	}

	const children = periodIndex.getChildrenForFile(file);
	if (!children) {
		return emptyResult;
	}

	const directChildrenKey = getDirectChildrenKey(periodType);
	if (!directChildrenKey) {
		return emptyResult;
	}

	const directChildren = children[directChildrenKey] ?? [];

	const categoryNameToId = buildCategoryNameToIdMap(categories);

	const budgets = new Map<string, CategoryBudgetInfo>();
	for (const allocation of currentAllocations) {
		budgets.set(allocation.categoryId, {
			categoryId: allocation.categoryId,
			total: allocation.hours,
			allocated: 0,
			remaining: allocation.hours,
		});
	}

	for (const child of directChildren) {
		for (const [categoryName, hours] of child.categoryAllocations) {
			const categoryId = categoryNameToId.get(categoryName);
			if (categoryId) {
				const budget = budgets.get(categoryId);
				if (budget) {
					budget.allocated += hours;
				}
			}
		}
	}

	const totalChildrenAllocated = Array.from(budgets.values()).reduce((sum, budget) => {
		budget.remaining = budget.total - budget.allocated;
		return sum + budget.allocated;
	}, 0);

	return { budgets, totalChildrenAllocated };
}
