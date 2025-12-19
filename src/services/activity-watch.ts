import type { DateTime } from "luxon";
import type { App } from "obsidian";
import { requestUrl } from "obsidian";

/**
 * Response from ActivityWatch bucket listing
 */
export interface ActivityWatchBucket {
	id: string;
	name: string;
	type: string;
	client: string;
	hostname: string;
	created: string;
	last_updated: string;
}

/**
 * ActivityWatch event structure
 */
export interface ActivityWatchEvent {
	id?: number;
	timestamp: string;
	duration: number;
	data: Record<string, unknown>;
}

/**
 * Query result from ActivityWatch
 */
export interface ActivityWatchQueryResult {
	[key: string]: ActivityWatchEvent[];
}

/**
 * Aggregated app data for pie chart
 */
export interface AppTimeData {
	app: string;
	duration: number; // in seconds
}

/**
 * Service for interacting with ActivityWatch REST API
 */
export class ActivityWatchService {
	private apiUrl: string;
	private app: App;

	constructor(app: App, apiUrl: string) {
		this.app = app;
		this.apiUrl = apiUrl.replace(/\/$/, "");
	}

	/**
	 * List all available buckets from ActivityWatch
	 */
	async listBuckets(): Promise<Record<string, ActivityWatchBucket>> {
		const url = `${this.apiUrl}/api/0/buckets/`;
		const response = await requestUrl({
			url,
			method: "GET",
		});
		return response.json;
	}

	/**
	 * Get the window watcher bucket ID for the current hostname
	 */
	async getWindowBucketId(): Promise<string | null> {
		const buckets = await this.listBuckets();
		const bucketIds = Object.keys(buckets);

		// Find the window watcher bucket (typically aw-watcher-window_<hostname>)
		const windowBucket = bucketIds.find((id) => id.startsWith("aw-watcher-window_"));

		return windowBucket ?? null;
	}

	/**
	 * Get the AFK watcher bucket ID for the current hostname
	 */
	async getAfkBucketId(): Promise<string | null> {
		const buckets = await this.listBuckets();
		const bucketIds = Object.keys(buckets);

		// Find the AFK watcher bucket (typically aw-watcher-afk_<hostname>)
		const afkBucket = bucketIds.find((id) => id.startsWith("aw-watcher-afk_"));

		return afkBucket ?? null;
	}

	/**
	 * Query ActivityWatch for data in a specific time period
	 */
	async queryTimeperiod(timeperiods: string[], query: string[]): Promise<ActivityWatchQueryResult[]> {
		const url = `${this.apiUrl}/api/0/query`;
		const response = await requestUrl({
			url,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				timeperiods,
				query,
			}),
		});
		return response.json;
	}

	/**
	 * Get aggregated app usage data for a specific day
	 */
	async getDailyAppUsage(date: DateTime): Promise<AppTimeData[]> {
		// Get bucket IDs
		const windowBucketId = await this.getWindowBucketId();
		const afkBucketId = await this.getAfkBucketId();

		if (!windowBucketId || !afkBucketId) {
			throw new Error("Could not find required ActivityWatch buckets");
		}

		// Create ISO 8601 time interval for the day
		const startOfDay = date.startOf("day");
		const endOfDay = date.endOf("day");
		const timeperiod = `${startOfDay.toISO()}/${endOfDay.toISO()}`;

		// Build query to get app usage, filtered by AFK status
		const query = [
			`window = query_bucket("${windowBucketId}");`,
			`afk = query_bucket("${afkBucketId}");`,
			`afk = filter_keyvals(afk, "status", ["not-afk"]);`,
			`window = filter_period_intersect(window, afk);`,
			`merged = merge_events_by_keys(window, ["app"]);`,
			`RETURN = merged;`,
		];

		const results = await this.queryTimeperiod([timeperiod], query);

		// Parse results and aggregate by app
		const appData: Map<string, number> = new Map();

		if (results.length > 0 && results[0].RETURN) {
			for (const event of results[0].RETURN) {
				const app = (event.data.app as string) ?? "Unknown";
				const duration = event.duration;
				appData.set(app, (appData.get(app) ?? 0) + duration);
			}
		}

		// Convert to array and sort by duration
		return Array.from(appData.entries())
			.map(([app, duration]) => ({ app, duration }))
			.sort((a, b) => b.duration - a.duration);
	}

	/**
	 * Format duration in seconds to human-readable format
	 */
	static formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	}

	/**
	 * Generate a pie chart in markdown format using Obsidian's dataview or raw markdown
	 * This creates a simple markdown table that can be visualized
	 */
	static generatePieChartMarkdown(appData: AppTimeData[]): string {
		if (appData.length === 0) {
			return "No activity data available for this day.";
		}

		const totalSeconds = appData.reduce((sum, item) => sum + item.duration, 0);
		const totalHours = (totalSeconds / 3600).toFixed(2);

		let markdown = `**Total Active Time:** ${totalHours} hours\n\n`;
		markdown += "| Application | Time | Percentage |\n";
		markdown += "|-------------|------|------------|\n";

		for (const item of appData) {
			const percentage = ((item.duration / totalSeconds) * 100).toFixed(1);
			const timeStr = ActivityWatchService.formatDuration(item.duration);
			markdown += `| ${item.app} | ${timeStr} | ${percentage}% |\n`;
		}

		return markdown;
	}
}
