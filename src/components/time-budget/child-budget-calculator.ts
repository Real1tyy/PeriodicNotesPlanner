import type { App, TFile } from "obsidian";
import type { PeriodType } from "../../constants";
import type { PeriodIndex } from "../../core/period-index";
import type { Category, IndexedPeriodNote, TimeAllocation } from "../../types";
import type { CategoryBudgetInfo, ChildBudgetResult } from "./parent-budget-tracker";

export async function getChildBudgetsFromIndex(
	_app: App,
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

	const categoryNameToId = new Map<string, string>();
	for (const category of categories) {
		categoryNameToId.set(category.name, category.id);
	}

	const budgets = new Map<string, CategoryBudgetInfo>();
	for (const allocation of currentAllocations) {
		budgets.set(allocation.categoryId, {
			categoryId: allocation.categoryId,
			total: allocation.hours,
			allocated: 0,
			remaining: allocation.hours,
		});
	}

	const allChildren: IndexedPeriodNote[] = [
		...(children.quarters ?? []),
		...(children.months ?? []),
		...(children.weeks ?? []),
		...(children.days ?? []),
	];

	for (const child of allChildren) {
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
