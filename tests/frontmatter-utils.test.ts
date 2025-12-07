import type { CachedMetadata } from "obsidian";
import { describe, expect, it } from "vitest";
import type { PropertySettings } from "../src/types";
import {
	extractLinkTarget,
	extractParentLinksFromFrontmatter,
	getLinkFromFrontmatter,
	getParentLinkFromFrontmatter,
	getPeriodTypeFromFrontmatter,
	resolveFilePath,
} from "../src/utils/frontmatter-utils";

describe("extractLinkTarget", () => {
	it("extracts target from wiki link", () => {
		expect(extractLinkTarget("[[My Note]]")).toBe("My Note");
	});

	it("extracts target from wiki link with alias", () => {
		expect(extractLinkTarget("[[My Note|Alias]]")).toBe("My Note");
	});

	it("extracts target from wiki link with path", () => {
		expect(extractLinkTarget("[[folder/My Note]]")).toBe("folder/My Note");
	});

	it("returns null for non-wiki link", () => {
		expect(extractLinkTarget("plain text")).toBeNull();
	});

	it("returns null for empty string", () => {
		expect(extractLinkTarget("")).toBeNull();
	});

	it("handles link with quotes", () => {
		expect(extractLinkTarget('"[[My Note]]"')).toBe("My Note");
	});
});

describe("getLinkFromFrontmatter", () => {
	const createCache = (frontmatter: Record<string, unknown>): CachedMetadata => ({ frontmatter }) as CachedMetadata;

	it("returns link target from frontmatter property", () => {
		const cache = createCache({ Previous: "[[2025-01-01]]" });
		expect(getLinkFromFrontmatter(cache, "Previous")).toBe("2025-01-01");
	});

	it("returns null when property does not exist", () => {
		const cache = createCache({});
		expect(getLinkFromFrontmatter(cache, "Previous")).toBeNull();
	});

	it("returns null when cache is null", () => {
		expect(getLinkFromFrontmatter(null, "Previous")).toBeNull();
	});

	it("returns null when frontmatter is undefined", () => {
		const cache = {} as CachedMetadata;
		expect(getLinkFromFrontmatter(cache, "Previous")).toBeNull();
	});

	it("returns null when value is not a wiki link", () => {
		const cache = createCache({ Previous: "plain text" });
		expect(getLinkFromFrontmatter(cache, "Previous")).toBeNull();
	});
});

describe("getPeriodTypeFromFrontmatter", () => {
	const props: PropertySettings = {
		previousProp: "Previous",
		nextProp: "Next",
		parentProp: "Parent",
		weekProp: "Week",
		monthProp: "Month",
		quarterProp: "Quarter",
		yearProp: "Year",
		hoursAvailableProp: "Hours Available",
		timeAllocationsProp: "Time Allocations",
		hoursSpentProp: "Hours Spent",
		periodTypeProp: "Period Type",
		periodStartProp: "Period Start",
		periodEndProp: "Period End",
	};

	const createCache = (frontmatter: Record<string, unknown>): CachedMetadata => ({ frontmatter }) as CachedMetadata;

	it("returns period type from frontmatter", () => {
		const cache = createCache({ "Period Type": "daily" });
		expect(getPeriodTypeFromFrontmatter(cache, props)).toBe("daily");
	});

	it("returns null when period type is not set", () => {
		const cache = createCache({});
		expect(getPeriodTypeFromFrontmatter(cache, props)).toBeNull();
	});

	it("returns null when cache is null", () => {
		expect(getPeriodTypeFromFrontmatter(null, props)).toBeNull();
	});
});

describe("getParentLinkFromFrontmatter", () => {
	const props: PropertySettings = {
		previousProp: "Previous",
		nextProp: "Next",
		parentProp: "Parent",
		weekProp: "Week",
		monthProp: "Month",
		quarterProp: "Quarter",
		yearProp: "Year",
		hoursAvailableProp: "Hours Available",
		timeAllocationsProp: "Time Allocations",
		hoursSpentProp: "Hours Spent",
		periodTypeProp: "Period Type",
		periodStartProp: "Period Start",
		periodEndProp: "Period End",
	};

	const createCache = (frontmatter: Record<string, unknown>): CachedMetadata => ({ frontmatter }) as CachedMetadata;

	it("returns parent link from frontmatter", () => {
		const cache = createCache({
			Parent: "[[W01-2025]]",
		});
		expect(getParentLinkFromFrontmatter(cache, props)).toBe("W01-2025");
	});

	it("returns null when parent is not set", () => {
		const cache = createCache({});
		expect(getParentLinkFromFrontmatter(cache, props)).toBeNull();
	});

	it("returns null when cache is null", () => {
		expect(getParentLinkFromFrontmatter(null, props)).toBeNull();
	});
});

describe("extractLinkTarget with non-string values", () => {
	it("returns null for undefined", () => {
		expect(extractLinkTarget(undefined)).toBeNull();
	});

	it("returns null for null", () => {
		expect(extractLinkTarget(null)).toBeNull();
	});

	it("returns null for number", () => {
		expect(extractLinkTarget(123)).toBeNull();
	});

	it("returns null for object", () => {
		expect(extractLinkTarget({ link: "[[Note]]" })).toBeNull();
	});
});

describe("extractParentLinksFromFrontmatter", () => {
	const props: PropertySettings = {
		previousProp: "Previous",
		nextProp: "Next",
		parentProp: "Parent",
		weekProp: "Week",
		monthProp: "Month",
		quarterProp: "Quarter",
		yearProp: "Year",
		hoursAvailableProp: "Hours Available",
		timeAllocationsProp: "Time Allocations",
		hoursSpentProp: "Hours Spent",
		periodTypeProp: "Period Type",
		periodStartProp: "Period Start",
		periodEndProp: "Period End",
	};

	it("extracts all parent links from frontmatter", () => {
		const frontmatter = {
			Parent: "[[2024-W49]]",
			Week: "[[2024-W49]]",
			Month: "[[2024-12]]",
			Quarter: "[[2024-Q4]]",
			Year: "[[2024]]",
		};

		const result = extractParentLinksFromFrontmatter(frontmatter, props);

		expect(result).toEqual({
			parent: "2024-W49",
			week: "2024-W49",
			month: "2024-12",
			quarter: "2024-Q4",
			year: "2024",
		});
	});

	it("returns undefined for missing links", () => {
		const frontmatter = {
			Parent: "[[2024-W49]]",
		};

		const result = extractParentLinksFromFrontmatter(frontmatter, props);

		expect(result).toEqual({
			parent: "2024-W49",
			week: undefined,
			month: undefined,
			quarter: undefined,
			year: undefined,
		});
	});

	it("handles empty frontmatter", () => {
		const result = extractParentLinksFromFrontmatter({}, props);

		expect(result).toEqual({
			parent: undefined,
			week: undefined,
			month: undefined,
			quarter: undefined,
			year: undefined,
		});
	});

	it("handles links with aliases", () => {
		const frontmatter = {
			Parent: "[[2024-W49|Week 49]]",
			Month: "[[2024-12|December]]",
		};

		const result = extractParentLinksFromFrontmatter(frontmatter, props);

		expect(result).toEqual({
			parent: "2024-W49",
			week: undefined,
			month: "2024-12",
			quarter: undefined,
			year: undefined,
		});
	});
});

describe("resolveFilePath", () => {
	it("adds .md extension when missing", () => {
		expect(resolveFilePath("2024-W49")).toBe("2024-W49.md");
	});

	it("preserves .md extension when present", () => {
		expect(resolveFilePath("2024-W49.md")).toBe("2024-W49.md");
	});

	it("handles paths with folders", () => {
		expect(resolveFilePath("folder/2024-W49")).toBe("folder/2024-W49.md");
	});

	it("handles paths with folders and .md extension", () => {
		expect(resolveFilePath("folder/2024-W49.md")).toBe("folder/2024-W49.md");
	});
});
