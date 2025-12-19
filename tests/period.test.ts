import { DateTime } from "luxon";
import type { TFile } from "obsidian";
import { describe, expect, it } from "vitest";
import type { IndexedPeriodNote } from "../src/types";
import { categoryAllocationsEqual, noteDataChanged } from "../src/utils/period";

describe("Index Utils", () => {
	describe("categoryAllocationsEqual", () => {
		it("should return true for empty maps", () => {
			const a = new Map<string, number>();
			const b = new Map<string, number>();
			expect(categoryAllocationsEqual(a, b)).toBe(true);
		});

		it("should return true for identical maps", () => {
			const a = new Map([
				["cat1", 10],
				["cat2", 20],
			]);
			const b = new Map([
				["cat1", 10],
				["cat2", 20],
			]);
			expect(categoryAllocationsEqual(a, b)).toBe(true);
		});

		it("should return true for maps with same values in different order", () => {
			const a = new Map([
				["cat1", 10],
				["cat2", 20],
			]);
			const b = new Map([
				["cat2", 20],
				["cat1", 10],
			]);
			expect(categoryAllocationsEqual(a, b)).toBe(true);
		});

		it("should return true for values within tolerance (0.01)", () => {
			const a = new Map([["cat1", 10.0]]);
			const b = new Map([["cat1", 10.009]]);
			expect(categoryAllocationsEqual(a, b)).toBe(true);
		});

		it("should return false for different sizes", () => {
			const a = new Map([
				["cat1", 10],
				["cat2", 20],
			]);
			const b = new Map([["cat1", 10]]);
			expect(categoryAllocationsEqual(a, b)).toBe(false);
		});

		it("should return false for different keys", () => {
			const a = new Map([["cat1", 10]]);
			const b = new Map([["cat2", 10]]);
			expect(categoryAllocationsEqual(a, b)).toBe(false);
		});

		it("should return false for values outside tolerance", () => {
			const a = new Map([["cat1", 10.0]]);
			const b = new Map([["cat1", 10.02]]);
			expect(categoryAllocationsEqual(a, b)).toBe(false);
		});

		it("should return false when category exists in one but not the other", () => {
			const a = new Map([
				["cat1", 10],
				["cat2", 20],
			]);
			const b = new Map([
				["cat1", 10],
				["cat3", 20],
			]);
			expect(categoryAllocationsEqual(a, b)).toBe(false);
		});

		it("should handle maps with multiple categories correctly", () => {
			const a = new Map([
				["cat1", 10],
				["cat2", 20],
				["cat3", 30],
			]);
			const b = new Map([
				["cat1", 10],
				["cat2", 20],
				["cat3", 30],
			]);
			expect(categoryAllocationsEqual(a, b)).toBe(true);
		});

		it("should detect differences in multiple categories", () => {
			const a = new Map([
				["cat1", 10],
				["cat2", 20],
				["cat3", 30],
			]);
			const b = new Map([
				["cat1", 10],
				["cat2", 21],
				["cat3", 30],
			]);
			expect(categoryAllocationsEqual(a, b)).toBe(false);
		});
	});

	describe("noteDataChanged", () => {
		const createMockNote = (overrides: Partial<IndexedPeriodNote> = {}): IndexedPeriodNote => ({
			file: {} as TFile,
			filePath: "test.md",
			periodType: "daily",
			periodStart: DateTime.now(),
			periodEnd: DateTime.now(),
			noteName: "Test",
			mtime: Date.now(),
			hoursAvailable: 24,
			hoursSpent: 0,
			parentLinks: {},
			categoryAllocations: new Map([
				["cat1", 10],
				["cat2", 14],
			]),
			...overrides,
		});

		it("should return true when old note is undefined", () => {
			const newNote = createMockNote();
			expect(noteDataChanged(undefined, newNote)).toBe(true);
		});

		it("should return false when notes are identical", () => {
			const oldNote = createMockNote();
			const newNote = createMockNote();
			expect(noteDataChanged(oldNote, newNote)).toBe(false);
		});

		describe("category allocations changes", () => {
			it("should detect added category", () => {
				const oldNote = createMockNote({
					categoryAllocations: new Map([["cat1", 10]]),
				});
				const newNote = createMockNote({
					categoryAllocations: new Map([
						["cat1", 10],
						["cat2", 20],
					]),
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should detect removed category", () => {
				const oldNote = createMockNote({
					categoryAllocations: new Map([
						["cat1", 10],
						["cat2", 20],
					]),
				});
				const newNote = createMockNote({
					categoryAllocations: new Map([["cat1", 10]]),
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should detect changed hours", () => {
				const oldNote = createMockNote({
					categoryAllocations: new Map([["cat1", 10]]),
				});
				const newNote = createMockNote({
					categoryAllocations: new Map([["cat1", 15]]),
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should not detect changes within tolerance", () => {
				const oldNote = createMockNote({
					categoryAllocations: new Map([["cat1", 10.0]]),
				});
				const newNote = createMockNote({
					categoryAllocations: new Map([["cat1", 10.005]]),
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});
		});

		describe("hours available changes", () => {
			it("should detect hours available change", () => {
				const oldNote = createMockNote({ hoursAvailable: 24 });
				const newNote = createMockNote({ hoursAvailable: 20 });
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should not detect hours available change within tolerance", () => {
				const oldNote = createMockNote({ hoursAvailable: 24.0 });
				const newNote = createMockNote({ hoursAvailable: 24.005 });
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});

			it("should detect hours available change outside tolerance", () => {
				const oldNote = createMockNote({ hoursAvailable: 24.0 });
				const newNote = createMockNote({ hoursAvailable: 24.02 });
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});
		});

		describe("parent links changes", () => {
			it("should detect added parent link", () => {
				const oldNote = createMockNote({
					parentLinks: {},
				});
				const newNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]" },
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should detect removed parent link", () => {
				const oldNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]" },
				});
				const newNote = createMockNote({
					parentLinks: {},
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should detect changed parent link", () => {
				const oldNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]" },
				});
				const newNote = createMockNote({
					parentLinks: { parent: "[[2025-W02]]" },
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should detect added week link", () => {
				const oldNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]" },
				});
				const newNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]", week: "[[2025-W01]]" },
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should not detect changes when parent links are identical", () => {
				const oldNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]", week: "[[2025-W01]]" },
				});
				const newNote = createMockNote({
					parentLinks: { parent: "[[2025-W01]]", week: "[[2025-W01]]" },
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});
		});

		describe("combined changes", () => {
			it("should detect changes when multiple fields change", () => {
				const oldNote = createMockNote({
					hoursAvailable: 24,
					categoryAllocations: new Map([["cat1", 10]]),
					parentLinks: { parent: "[[2025-W01]]" },
				});
				const newNote = createMockNote({
					hoursAvailable: 20,
					categoryAllocations: new Map([["cat1", 15]]),
					parentLinks: { parent: "[[2025-W02]]" },
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(true);
			});

			it("should not detect changes when all fields are identical", () => {
				const oldNote = createMockNote({
					hoursAvailable: 24,
					categoryAllocations: new Map([
						["cat1", 10],
						["cat2", 14],
					]),
					parentLinks: { parent: "[[2025-W01]]", week: "[[2025-W01]]" },
				});
				const newNote = createMockNote({
					hoursAvailable: 24,
					categoryAllocations: new Map([
						["cat1", 10],
						["cat2", 14],
					]),
					parentLinks: { parent: "[[2025-W01]]", week: "[[2025-W01]]" },
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});
		});

		describe("edge cases", () => {
			it("should handle notes with empty category allocations", () => {
				const oldNote = createMockNote({
					categoryAllocations: new Map(),
				});
				const newNote = createMockNote({
					categoryAllocations: new Map(),
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});

			it("should handle notes with empty parent links", () => {
				const oldNote = createMockNote({
					parentLinks: {},
				});
				const newNote = createMockNote({
					parentLinks: {},
				});
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});

			it("should handle notes with zero hours available", () => {
				const oldNote = createMockNote({ hoursAvailable: 0 });
				const newNote = createMockNote({ hoursAvailable: 0 });
				expect(noteDataChanged(oldNote, newNote)).toBe(false);
			});
		});
	});
});
