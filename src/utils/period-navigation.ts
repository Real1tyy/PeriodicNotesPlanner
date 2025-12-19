import type { PeriodType } from "../constants";
import { ORDERED_PERIOD_TYPES, PERIOD_CONFIG } from "../types/config";
import type { PeriodChildren } from "../types/period";
import type { GenerationSettings } from "../types/schemas";

/**
 * Get all enabled period types based on settings, ordered from largest to smallest.
 */
export function getEnabledPeriodTypes(settings: GenerationSettings): PeriodType[] {
	return ORDERED_PERIOD_TYPES.filter((periodType) => isPeriodTypeEnabled(periodType, settings));
}

export function isPeriodTypeEnabled(periodType: PeriodType, settings: GenerationSettings): boolean {
	switch (periodType) {
		case "yearly":
			return settings.enableYearly;
		case "quarterly":
			return settings.enableQuarterly;
		case "monthly":
			return settings.enableMonthly;
		case "weekly":
			return settings.enableWeekly;
		case "daily":
			return settings.enableDaily;
		default:
			return false;
	}
}

/**
 * Get the direct parent period type for a given period type, skipping disabled periods.
 * Returns null if no enabled parent exists.
 */
export function getEnabledParentPeriodType(periodType: PeriodType, settings: GenerationSettings): PeriodType | null {
	const enabledTypes = getEnabledPeriodTypes(settings);
	const currentIndex = enabledTypes.indexOf(periodType);

	if (currentIndex === -1 || currentIndex === 0) {
		return null;
	}

	return enabledTypes[currentIndex - 1];
}

/**
 * Get the direct child period type for a given period type, skipping disabled periods.
 * Returns null if no enabled child exists.
 */
export function getEnabledChildPeriodType(periodType: PeriodType, settings: GenerationSettings): PeriodType | null {
	const enabledTypes = getEnabledPeriodTypes(settings);
	const currentIndex = enabledTypes.indexOf(periodType);

	if (currentIndex === -1 || currentIndex === enabledTypes.length - 1) {
		return null;
	}

	return enabledTypes[currentIndex + 1];
}

/**
 * Get all ancestor period types (parents, grandparents, etc.) that are enabled.
 * Returns them ordered from immediate parent to most distant ancestor.
 */
export function getEnabledAncestorPeriodTypes(periodType: PeriodType, settings: GenerationSettings): PeriodType[] {
	const enabledTypes = getEnabledPeriodTypes(settings);
	const currentIndex = enabledTypes.indexOf(periodType);

	if (currentIndex === -1) {
		return [];
	}

	return enabledTypes.slice(0, currentIndex);
}

/**
 * Get all descendant period types (children, grandchildren, etc.) that are enabled.
 * Returns them ordered from immediate child to most distant descendant.
 */
export function getEnabledDescendantPeriodTypes(periodType: PeriodType, settings: GenerationSettings): PeriodType[] {
	const enabledTypes = getEnabledPeriodTypes(settings);
	const currentIndex = enabledTypes.indexOf(periodType);

	if (currentIndex === -1) {
		return [];
	}

	return enabledTypes.slice(currentIndex + 1);
}

/**
 * Get the children key for the direct enabled child of a period type.
 * Returns null if no enabled child exists.
 */
export function getEnabledChildrenKey(
	periodType: PeriodType,
	settings: GenerationSettings
): keyof PeriodChildren | null {
	const childType = getEnabledChildPeriodType(periodType, settings);
	if (!childType) return null;

	return PERIOD_CONFIG[childType].childrenKey;
}

/**
 * Get the link key for a period type if it's enabled and has a link key.
 * Returns null if the period type is disabled or has no link key.
 */
export function getEnabledLinkKey(periodType: PeriodType, settings: GenerationSettings): string | null {
	if (!isPeriodTypeEnabled(periodType, settings)) {
		return null;
	}

	const linkKey = PERIOD_CONFIG[periodType].linkKey;
	return typeof linkKey === "string" ? linkKey : null;
}
