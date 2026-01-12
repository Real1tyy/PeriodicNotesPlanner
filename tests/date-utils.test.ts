import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { PERIOD_TYPES } from "../src/constants";
import {
	createPeriodInfo,
	formatDateWithoutTimezone,
	formatPeriodDateRange,
	formatPeriodIntervalForBases,
	formatPeriodName,
	getAncestorPeriodTypes,
	getEndOfPeriod,
	getNextPeriod,
	getParentPeriodType,
	getPreviousPeriod,
	getStartOfPeriod,
	isSamePeriod,
	parseLinkToDateTime,
	parsePeriodName,
} from "../src/utils/date-utils";

describe("Date Utilities", () => {
	const testDate = DateTime.fromISO("2025-06-15T14:30:00"); // Mid-year, mid-month, mid-week

	describe("formatPeriodName", () => {
		it("should format daily names correctly", () => {
			const result = formatPeriodName(testDate, "dd-MM-yyyy");
			expect(result).toBe("15-06-2025");
		});

		it("should format weekly names correctly", () => {
			const result = formatPeriodName(testDate, "WW-kkkk");
			expect(result).toBe("24-2025");
		});

		it("should format monthly names correctly", () => {
			const result = formatPeriodName(testDate, "M-yyyy");
			expect(result).toBe("6-2025");
		});

		it("should format quarterly names correctly", () => {
			const result = formatPeriodName(testDate, "'Q'q-yyyy");
			expect(result).toBe("Q2-2025");
		});

		it("should format yearly names correctly", () => {
			const result = formatPeriodName(testDate, "yyyy");
			expect(result).toBe("2025");
		});
	});

	describe("getStartOfPeriod", () => {
		it("should get start of day", () => {
			const result = getStartOfPeriod(testDate, PERIOD_TYPES.DAILY);
			expect(result.hour).toBe(0);
			expect(result.minute).toBe(0);
			expect(result.day).toBe(15);
		});

		it("should get start of week", () => {
			const result = getStartOfPeriod(testDate, PERIOD_TYPES.WEEKLY);
			// Week starts on Monday in Luxon by default
			expect(result.weekday).toBe(1);
		});

		it("should get start of month", () => {
			const result = getStartOfPeriod(testDate, PERIOD_TYPES.MONTHLY);
			expect(result.day).toBe(1);
			expect(result.month).toBe(6);
		});

		it("should get start of quarter", () => {
			const result = getStartOfPeriod(testDate, PERIOD_TYPES.QUARTERLY);
			expect(result.month).toBe(4); // Q2 starts in April
			expect(result.day).toBe(1);
		});

		it("should get start of year", () => {
			const result = getStartOfPeriod(testDate, PERIOD_TYPES.YEARLY);
			expect(result.month).toBe(1);
			expect(result.day).toBe(1);
		});
	});

	describe("getEndOfPeriod", () => {
		it("should get end of day", () => {
			const result = getEndOfPeriod(testDate, PERIOD_TYPES.DAILY);
			expect(result.hour).toBe(23);
			expect(result.minute).toBe(59);
		});

		it("should get end of month", () => {
			const result = getEndOfPeriod(testDate, PERIOD_TYPES.MONTHLY);
			expect(result.day).toBe(30); // June has 30 days
		});

		it("should get end of year", () => {
			const result = getEndOfPeriod(testDate, PERIOD_TYPES.YEARLY);
			expect(result.month).toBe(12);
			expect(result.day).toBe(31);
		});
	});

	describe("getNextPeriod", () => {
		it("should get next day", () => {
			const result = getNextPeriod(testDate, PERIOD_TYPES.DAILY);
			expect(result.day).toBe(16);
		});

		it("should get next week", () => {
			const result = getNextPeriod(testDate, PERIOD_TYPES.WEEKLY);
			expect(result.weekNumber).toBe(testDate.weekNumber + 1);
		});

		it("should get next month", () => {
			const result = getNextPeriod(testDate, PERIOD_TYPES.MONTHLY);
			expect(result.month).toBe(7);
		});

		it("should get next quarter", () => {
			const result = getNextPeriod(testDate, PERIOD_TYPES.QUARTERLY);
			expect(result.quarter).toBe(3);
		});

		it("should get next year", () => {
			const result = getNextPeriod(testDate, PERIOD_TYPES.YEARLY);
			expect(result.year).toBe(2026);
		});
	});

	describe("getPreviousPeriod", () => {
		it("should get previous day", () => {
			const result = getPreviousPeriod(testDate, PERIOD_TYPES.DAILY);
			expect(result.day).toBe(14);
		});

		it("should get previous month", () => {
			const result = getPreviousPeriod(testDate, PERIOD_TYPES.MONTHLY);
			expect(result.month).toBe(5);
		});

		it("should get previous year", () => {
			const result = getPreviousPeriod(testDate, PERIOD_TYPES.YEARLY);
			expect(result.year).toBe(2024);
		});
	});

	describe("getParentPeriodType", () => {
		it("should return weekly for daily", () => {
			expect(getParentPeriodType(PERIOD_TYPES.DAILY)).toBe(PERIOD_TYPES.WEEKLY);
		});

		it("should return monthly for weekly", () => {
			expect(getParentPeriodType(PERIOD_TYPES.WEEKLY)).toBe(PERIOD_TYPES.MONTHLY);
		});

		it("should return quarterly for monthly", () => {
			expect(getParentPeriodType(PERIOD_TYPES.MONTHLY)).toBe(PERIOD_TYPES.QUARTERLY);
		});

		it("should return yearly for quarterly", () => {
			expect(getParentPeriodType(PERIOD_TYPES.QUARTERLY)).toBe(PERIOD_TYPES.YEARLY);
		});

		it("should return null for yearly", () => {
			expect(getParentPeriodType(PERIOD_TYPES.YEARLY)).toBeNull();
		});
	});

	describe("getAncestorPeriodTypes", () => {
		it("should return all ancestors for daily", () => {
			const ancestors = getAncestorPeriodTypes(PERIOD_TYPES.DAILY);
			expect(ancestors).toEqual([
				PERIOD_TYPES.WEEKLY,
				PERIOD_TYPES.MONTHLY,
				PERIOD_TYPES.QUARTERLY,
				PERIOD_TYPES.YEARLY,
			]);
		});

		it("should return partial ancestors for monthly", () => {
			const ancestors = getAncestorPeriodTypes(PERIOD_TYPES.MONTHLY);
			expect(ancestors).toEqual([PERIOD_TYPES.QUARTERLY, PERIOD_TYPES.YEARLY]);
		});

		it("should return empty array for yearly", () => {
			const ancestors = getAncestorPeriodTypes(PERIOD_TYPES.YEARLY);
			expect(ancestors).toEqual([]);
		});
	});

	describe("createPeriodInfo", () => {
		it("should create period info with correct properties", () => {
			const info = createPeriodInfo(testDate, PERIOD_TYPES.DAILY, "dd-MM-yyyy");

			expect(info.type).toBe(PERIOD_TYPES.DAILY);
			expect(info.name).toBe("15-06-2025");
			expect(info.start).toBeDefined();
			expect(info.end).toBeDefined();
			expect(info.dateTime.day).toBe(15);
		});

		it("should normalize to start of period", () => {
			const info = createPeriodInfo(testDate, PERIOD_TYPES.MONTHLY, "M-yyyy");

			// Should be normalized to start of month
			expect(info.dateTime.day).toBe(1);
		});
	});

	describe("isSamePeriod", () => {
		it("should return true for same day", () => {
			const dt1 = DateTime.fromISO("2025-06-15T10:00:00");
			const dt2 = DateTime.fromISO("2025-06-15T18:00:00");
			expect(isSamePeriod(dt1, dt2, PERIOD_TYPES.DAILY)).toBe(true);
		});

		it("should return false for different days", () => {
			const dt1 = DateTime.fromISO("2025-06-15T10:00:00");
			const dt2 = DateTime.fromISO("2025-06-16T10:00:00");
			expect(isSamePeriod(dt1, dt2, PERIOD_TYPES.DAILY)).toBe(false);
		});

		it("should return true for same month", () => {
			const dt1 = DateTime.fromISO("2025-06-01T10:00:00");
			const dt2 = DateTime.fromISO("2025-06-30T10:00:00");
			expect(isSamePeriod(dt1, dt2, PERIOD_TYPES.MONTHLY)).toBe(true);
		});
	});

	describe("parsePeriodName", () => {
		it("should parse valid daily name", () => {
			const result = parsePeriodName("15-06-2025", "dd-MM-yyyy");
			expect(result).not.toBeNull();
			expect(result?.day).toBe(15);
			expect(result?.month).toBe(6);
			expect(result?.year).toBe(2025);
		});

		it("should return null for invalid name", () => {
			const result = parsePeriodName("invalid", "dd-MM-yyyy");
			expect(result).toBeNull();
		});
	});

	describe("formatPeriodDateRange", () => {
		it("should format daily period", () => {
			const start = DateTime.fromISO("2025-06-15");
			const end = DateTime.fromISO("2025-06-15");
			const result = formatPeriodDateRange("daily", start, end);
			expect(result).toBe("Sun, Jun 15");
		});

		it("should format weekly period", () => {
			const start = DateTime.fromISO("2025-06-09");
			const end = DateTime.fromISO("2025-06-15");
			const result = formatPeriodDateRange("weekly", start, end);
			expect(result).toBe("Jun 9 - Jun 15");
		});

		it("should format monthly period", () => {
			const start = DateTime.fromISO("2025-06-01");
			const end = DateTime.fromISO("2025-06-30");
			const result = formatPeriodDateRange("monthly", start, end);
			expect(result).toBe("June 2025");
		});

		it("should format quarterly period", () => {
			const start = DateTime.fromISO("2025-04-01");
			const end = DateTime.fromISO("2025-06-30");
			const result = formatPeriodDateRange("quarterly", start, end);
			expect(result).toBe("Q2 2025");
		});

		it("should format yearly period", () => {
			const start = DateTime.fromISO("2025-01-01");
			const end = DateTime.fromISO("2025-12-31");
			const result = formatPeriodDateRange("yearly", start, end);
			expect(result).toBe("2025");
		});
	});

	describe("parseLinkToDateTime", () => {
		it("should parse daily link with simple filename", () => {
			const result = parseLinkToDateTime("15-06-2025", "dd-MM-yyyy");
			expect(result).not.toBeNull();
			expect(result?.day).toBe(15);
			expect(result?.month).toBe(6);
			expect(result?.year).toBe(2025);
		});

		it("should parse daily link with folder path", () => {
			const result = parseLinkToDateTime("Periodic/Daily/15-06-2025", "dd-MM-yyyy");
			expect(result).not.toBeNull();
			expect(result?.day).toBe(15);
			expect(result?.month).toBe(6);
			expect(result?.year).toBe(2025);
		});

		it("should parse daily link with .md extension", () => {
			const result = parseLinkToDateTime("15-06-2025.md", "dd-MM-yyyy");
			expect(result).not.toBeNull();
			expect(result?.day).toBe(15);
			expect(result?.month).toBe(6);
			expect(result?.year).toBe(2025);
		});

		it("should parse weekly link", () => {
			const result = parseLinkToDateTime("24-2025", "WW-kkkk");
			expect(result).not.toBeNull();
			expect(result?.weekNumber).toBe(24);
			expect(result?.year).toBe(2025);
		});

		it("should parse weekly link with nested path", () => {
			const result = parseLinkToDateTime("Periodic/Weekly/24-2025.md", "WW-kkkk");
			expect(result).not.toBeNull();
			expect(result?.weekNumber).toBe(24);
			expect(result?.year).toBe(2025);
		});

		it("should parse monthly link", () => {
			const result = parseLinkToDateTime("6-2025", "M-yyyy");
			expect(result).not.toBeNull();
			expect(result?.month).toBe(6);
			expect(result?.year).toBe(2025);
		});

		it("should parse quarterly link", () => {
			const result = parseLinkToDateTime("Q2-2025", "'Q'q-yyyy");
			expect(result).not.toBeNull();
			expect(result?.quarter).toBe(2);
			expect(result?.year).toBe(2025);
		});

		it("should parse yearly link", () => {
			const result = parseLinkToDateTime("2025", "yyyy");
			expect(result).not.toBeNull();
			expect(result?.year).toBe(2025);
		});

		it("should parse yearly link with nested path", () => {
			const result = parseLinkToDateTime("Yearly/2025/2025.md", "yyyy");
			expect(result).not.toBeNull();
			expect(result?.year).toBe(2025);
		});

		it("should return null for invalid link target", () => {
			const result = parseLinkToDateTime("invalid-date", "dd-MM-yyyy");
			expect(result).toBeNull();
		});

		it("should return null for mismatched format", () => {
			const result = parseLinkToDateTime("15-06-2025", "yyyy-MM-dd");
			expect(result).toBeNull();
		});

		it("should handle empty string", () => {
			const result = parseLinkToDateTime("", "dd-MM-yyyy");
			expect(result).toBeNull();
		});

		it("should extract filename from complex nested path", () => {
			const result = parseLinkToDateTime("Periodic/Daily/2025/June/15-06-2025.md", "dd-MM-yyyy");
			expect(result).not.toBeNull();
			expect(result?.day).toBe(15);
			expect(result?.month).toBe(6);
			expect(result?.year).toBe(2025);
		});
	});

	describe("formatDateWithoutTimezone", () => {
		it("should format date without timezone and milliseconds", () => {
			const dt = DateTime.fromISO("2026-01-12T14:30:45.123+01:00");
			const result = formatDateWithoutTimezone(dt);
			expect(result).toBe("2026-01-12T14:30:45");
		});

		it("should format date with seconds but no milliseconds", () => {
			const dt = DateTime.fromISO("2026-01-12T14:30:45.999+01:00");
			const result = formatDateWithoutTimezone(dt);
			expect(result).toBe("2026-01-12T14:30:45");
		});

		it("should format date at midnight", () => {
			const dt = DateTime.fromISO("2026-01-12T00:00:00.000+01:00");
			const result = formatDateWithoutTimezone(dt);
			expect(result).toBe("2026-01-12T00:00:00");
		});

		it("should format date at end of day", () => {
			const dt = DateTime.fromISO("2026-01-12T23:59:59.999+01:00");
			const result = formatDateWithoutTimezone(dt);
			expect(result).toBe("2026-01-12T23:59:59");
		});

		it("should format date with UTC timezone", () => {
			const dt = DateTime.fromISO("2026-01-12T14:30:45.123Z");
			const result = formatDateWithoutTimezone(dt);
			const expected = `${dt.year}-${String(dt.month).padStart(2, "0")}-${String(dt.day).padStart(2, "0")}T${String(dt.hour).padStart(2, "0")}:${String(dt.minute).padStart(2, "0")}:${String(dt.second).padStart(2, "0")}`;
			expect(result).toBe(expected);
		});

		it("should format date with negative timezone offset", () => {
			const dt = DateTime.fromISO("2026-01-12T14:30:45.123-05:00");
			const result = formatDateWithoutTimezone(dt);
			const expected = `${dt.year}-${String(dt.month).padStart(2, "0")}-${String(dt.day).padStart(2, "0")}T${String(dt.hour).padStart(2, "0")}:${String(dt.minute).padStart(2, "0")}:${String(dt.second).padStart(2, "0")}`;
			expect(result).toBe(expected);
		});

		it("should format date with one minute subtracted", () => {
			const dt = DateTime.fromISO("2026-01-12T00:00:00.000+01:00");
			const minusOne = dt.minus({ minutes: 1 });
			const result = formatDateWithoutTimezone(minusOne);
			expect(result).toBe("2026-01-11T23:59:00");
		});

		it("should handle date crossing day boundary", () => {
			const dt = DateTime.fromISO("2026-01-12T00:00:00.000+01:00");
			const minusOne = dt.minus({ minutes: 1 });
			const result = formatDateWithoutTimezone(minusOne);
			expect(result).toBe("2026-01-11T23:59:00");
		});

		it("should handle date crossing month boundary", () => {
			const dt = DateTime.fromISO("2026-02-01T00:00:00.000+01:00");
			const minusOne = dt.minus({ minutes: 1 });
			const result = formatDateWithoutTimezone(minusOne);
			expect(result).toBe("2026-01-31T23:59:00");
		});

		it("should handle date crossing year boundary", () => {
			const dt = DateTime.fromISO("2026-01-01T00:00:00.000+01:00");
			const minusOne = dt.minus({ minutes: 1 });
			const result = formatDateWithoutTimezone(minusOne);
			expect(result).toBe("2025-12-31T23:59:00");
		});

		it("should preserve seconds in output", () => {
			const dt = DateTime.fromISO("2026-01-12T14:30:45.123+01:00");
			const result = formatDateWithoutTimezone(dt);
			expect(result).toMatch(/:\d{2}$/);
			expect(result.split(":")[2]).toBe("45");
		});

		it("should throw error for invalid date", () => {
			const dt = DateTime.invalid("test");
			expect(() => formatDateWithoutTimezone(dt)).toThrow("Failed to format date");
		});
	});

	describe("formatPeriodIntervalForBases", () => {
		it("should format period interval with one minute subtracted from both start and end", () => {
			const periodStart = DateTime.fromISO("2026-01-12T00:00:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T23:59:59.999+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-11T23:59:00");
			expect(result.end).toBe("2026-01-12T23:59:00");
		});

		it("should handle same start and end time", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T14:30:00.000+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-12T14:29:00");
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle period crossing day boundary", () => {
			const periodStart = DateTime.fromISO("2026-01-12T00:00:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-13T00:00:00.000+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-11T23:59:00");
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle period crossing month boundary", () => {
			const periodStart = DateTime.fromISO("2026-02-01T00:00:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-02-01T23:59:59.999+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-31T23:59:00");
			expect(result.end).toBe("2026-02-01T23:59:00");
		});

		it("should handle period crossing year boundary", () => {
			const periodStart = DateTime.fromISO("2026-01-01T00:00:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-01T23:59:59.999+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2025-12-31T23:59:00");
			expect(result.end).toBe("2026-01-01T23:59:00");
		});

		it("should handle UTC timezone", () => {
			const periodStart = DateTime.fromISO("2026-01-12T00:00:00.000Z");
			const periodEnd = DateTime.fromISO("2026-01-12T23:59:59.999Z");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			const expectedStartDt = periodStart.minus({ minutes: 1 });
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.start).toBe(formatDateWithoutTimezone(expectedStartDt));
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle negative timezone offset", () => {
			const periodStart = DateTime.fromISO("2026-01-12T00:00:00.000-05:00");
			const periodEnd = DateTime.fromISO("2026-01-12T23:59:59.999-05:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			const expectedStartDt = periodStart.minus({ minutes: 1 });
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.start).toBe(formatDateWithoutTimezone(expectedStartDt));
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle period with milliseconds", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:45.123+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T15:30:45.456+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-12T14:29:45");
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle period at exact minute boundaries", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T15:30:00.000+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-12T14:29:00");
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle very short period (one minute)", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T14:31:00.000+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-12T14:29:00");
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should handle period with seconds", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:45.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T15:30:45.000+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).toBe("2026-01-12T14:29:45");
			const expectedEndDt = periodEnd.plus({ minutes: 1 }).startOf("minute").minus({ minutes: 1 });
			expect(result.end).toBe(formatDateWithoutTimezone(expectedEndDt));
		});

		it("should return object with start and end properties", () => {
			const periodStart = DateTime.fromISO("2026-01-12T00:00:00.000+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T23:59:59.999+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result).toHaveProperty("start");
			expect(result).toHaveProperty("end");
			expect(typeof result.start).toBe("string");
			expect(typeof result.end).toBe("string");
		});

		it("should format dates without timezone in output strings", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:45.123+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T15:30:45.456+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).not.toMatch(/[+-]\d{2}:\d{2}$/);
			expect(result.end).not.toMatch(/[+-]\d{2}:\d{2}$/);
			expect(result.start).not.toMatch(/Z$/);
			expect(result.end).not.toMatch(/Z$/);
		});

		it("should format dates without milliseconds in output strings", () => {
			const periodStart = DateTime.fromISO("2026-01-12T14:30:45.123+01:00");
			const periodEnd = DateTime.fromISO("2026-01-12T15:30:45.456+01:00");
			const result = formatPeriodIntervalForBases(periodStart, periodEnd);

			expect(result.start).not.toMatch(/\.\d{3}$/);
			expect(result.end).not.toMatch(/\.\d{3}$/);
		});
	});
});
