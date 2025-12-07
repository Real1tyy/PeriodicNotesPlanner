import type { App, CachedMetadata, TFile } from "obsidian";
import type { PeriodType } from "../constants";
import type { PropertySettings } from "../types";

export function extractLinkTarget(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const match = value.match(/\[\[([^\]|]+)/);
	return match ? match[1]?.trim() : null;
}

export function getLinkFromFrontmatter(cache: CachedMetadata | null, propName: string): string | null {
	const value = cache?.frontmatter?.[propName] as string | undefined;
	if (!value) return null;
	return extractLinkTarget(value);
}

export function getPeriodTypeFromFrontmatter(cache: CachedMetadata | null, props: PropertySettings): PeriodType | null {
	const periodType = cache?.frontmatter?.[props.periodTypeProp] as PeriodType | undefined;
	return periodType ?? null;
}

export function getParentLinkFromFrontmatter(cache: CachedMetadata | null, props: PropertySettings): string | null {
	return getLinkFromFrontmatter(cache, props.parentProp);
}

export function resolveNoteFile(app: App, linkTarget: string): TFile | null {
	return app.metadataCache.getFirstLinkpathDest(linkTarget, "");
}

export async function openNoteFile(app: App, file: TFile): Promise<void> {
	await app.workspace.getLeaf().openFile(file);
}

export function getActiveFileCache(app: App): { file: TFile; cache: CachedMetadata } | null {
	const file = app.workspace.getActiveFile();
	if (!file) return null;

	const cache = app.metadataCache.getFileCache(file);
	if (!cache) return null;

	return { file, cache };
}

export function extractParentLinksFromFrontmatter(
	frontmatter: Record<string, unknown>,
	props: PropertySettings
): { parent?: string; week?: string; month?: string; quarter?: string; year?: string } {
	return {
		parent: extractLinkTarget(frontmatter[props.parentProp]) ?? undefined,
		week: extractLinkTarget(frontmatter[props.weekProp]) ?? undefined,
		month: extractLinkTarget(frontmatter[props.monthProp]) ?? undefined,
		quarter: extractLinkTarget(frontmatter[props.quarterProp]) ?? undefined,
		year: extractLinkTarget(frontmatter[props.yearProp]) ?? undefined,
	};
}

export function resolveFilePath(linkPath: string): string {
	return linkPath.endsWith(".md") ? linkPath : `${linkPath}.md`;
}
