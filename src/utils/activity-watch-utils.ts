import { DateTime } from "luxon";
import type { App, TFile } from "obsidian";
import { PERIOD_TYPES } from "../constants";
import { ActivityWatchService } from "../services/activity-watch";
import type { PeriodicPlannerSettings } from "../types";

/**
 * Check if a file already has the ActivityWatch heading
 */
export async function hasActivityWatchHeading(app: App, file: TFile, heading: string): Promise<boolean> {
	const content = await app.vault.read(file);
	return content.includes(heading);
}

/**
 * Check if a date is in the past (not today or future)
 */
export function isInPast(date: DateTime): boolean {
	const today = DateTime.now().startOf("day");
	return date < today;
}

/**
 * Inject ActivityWatch content into a daily note
 */
export async function injectActivityWatchContent(
	app: App,
	file: TFile,
	date: DateTime,
	settings: PeriodicPlannerSettings
): Promise<void> {
	const { activityWatch } = settings;

	// Early exit if ActivityWatch is disabled
	if (!activityWatch.enabled) {
		return;
	}

	// Check if file already has ActivityWatch content
	if (await hasActivityWatchHeading(app, file, activityWatch.heading)) {
		return;
	}

	// Only process past dates (not today or future)
	if (!isInPast(date)) {
		return;
	}

	try {
		// Fetch ActivityWatch data
		const awService = new ActivityWatchService(app, activityWatch.apiUrl);
		const appData = await awService.getDailyAppUsage(date);

		// Generate markdown content
		const chartMarkdown = ActivityWatchService.generatePieChartMarkdown(appData);
		const content = `\n${activityWatch.heading}\n\n${chartMarkdown}\n`;

		// Append to file
		const currentContent = await app.vault.read(file);
		await app.vault.modify(file, currentContent + content);

		console.log(`ActivityWatch data injected into ${file.path}`);
	} catch (error) {
		console.error(`Failed to inject ActivityWatch data for ${file.path}:`, error);
	}
}

/**
 * Process all daily notes in the vault to inject ActivityWatch content
 */
export async function processAllDailyNotesForActivityWatch(app: App, settings: PeriodicPlannerSettings): Promise<void> {
	if (!settings.activityWatch.enabled) {
		return;
	}

	const dailyFolder = settings.directories.dailyFolder;
	const allFiles = app.vault.getMarkdownFiles();
	const dailyFiles = allFiles.filter((file) => file.path.startsWith(dailyFolder));

	console.log(`Processing ${dailyFiles.length} daily notes for ActivityWatch integration...`);

	for (const file of dailyFiles) {
		try {
			// Parse date from frontmatter
			const cache = app.metadataCache.getFileCache(file);
			const frontmatter = cache?.frontmatter;

			if (!frontmatter) continue;

			// Check if this is a daily note
			const periodType = frontmatter[settings.properties.periodTypeProp];
			if (periodType !== PERIOD_TYPES.DAILY) continue;

			// Get the period start date
			const periodStartStr = frontmatter[settings.properties.periodStartProp];
			if (!periodStartStr) continue;

			const date = DateTime.fromISO(periodStartStr);
			if (!date.isValid) continue;

			// Inject ActivityWatch content
			await injectActivityWatchContent(app, file, date, settings);
		} catch (error) {
			console.error(`Error processing ${file.path}:`, error);
		}
	}

	console.log("ActivityWatch processing complete.");
}
