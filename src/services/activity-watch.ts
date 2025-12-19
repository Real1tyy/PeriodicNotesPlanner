import type { DateTime } from "luxon";
import type { App } from "obsidian";
import { requestUrl } from "obsidian";

export interface ActivityWatchBucket {
	id: string;
	name: string;
	type: string;
	client: string;
	hostname: string;
	created: string;
	last_updated: string;
}

export interface ActivityWatchEvent {
	id?: number;
	timestamp: string;
	duration: number;
	data: Record<string, unknown>;
}

export interface ActivityWatchQueryResult {
	[key: string]: ActivityWatchEvent[];
}

export interface AppTimeData {
	app: string;
	duration: number;
}
export class ActivityWatchService {
	private apiUrl: string;
	private app: App;

	constructor(app: App, apiUrl: string) {
		this.app = app;
		this.apiUrl = apiUrl.replace(/\/$/, "");
	}

	async listBuckets(): Promise<Record<string, ActivityWatchBucket>> {
		const url = `${this.apiUrl}/api/0/buckets/`;

		try {
			const response = await requestUrl({
				url,
				method: "GET",
			});
			return response.json;
		} catch (error) {
			console.error("[ActivityWatch] Failed to fetch buckets from", url);
			throw error;
		}
	}

	async getWindowBucketId(): Promise<string | null> {
		const buckets = await this.listBuckets();
		const bucketIds = Object.keys(buckets);
		const windowBucket = bucketIds.find((id) => id.startsWith("aw-watcher-window_"));

		if (!windowBucket) {
			console.warn("[ActivityWatch] No window watcher bucket found. Available:", bucketIds.join(", "));
		}

		return windowBucket ?? null;
	}

	async getAfkBucketId(): Promise<string | null> {
		const buckets = await this.listBuckets();
		const bucketIds = Object.keys(buckets);
		const afkBucket = bucketIds.find((id) => id.startsWith("aw-watcher-afk_"));

		if (!afkBucket) {
			console.warn("[ActivityWatch] No AFK watcher bucket found. Available:", bucketIds.join(", "));
		}

		return afkBucket ?? null;
	}

	async queryTimeperiod(timeperiods: string[], query: string[]): Promise<ActivityWatchQueryResult[]> {
		const url = `${this.apiUrl}/api/0/query`;

		try {
			const response = await requestUrl({
				url,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ timeperiods, query }),
			});

			return response.json;
		} catch (error) {
			console.error("[ActivityWatch] Query failed:", error);
			throw error;
		}
	}

	async getDailyAppUsage(date: DateTime): Promise<AppTimeData[]> {
		const windowBucketId = await this.getWindowBucketId();
		const afkBucketId = await this.getAfkBucketId();

		if (!windowBucketId || !afkBucketId) {
			throw new Error(`Could not find required ActivityWatch buckets (window: ${windowBucketId}, afk: ${afkBucketId})`);
		}

		const startOfDay = date.startOf("day");
		const startOfNextDay = date.plus({ days: 1 }).startOf("day");
		const timeperiod = `${startOfDay.toISO()}/${startOfNextDay.toISO()}`;

		const query = [
			`window = query_bucket("${windowBucketId}");`,
			`afk = query_bucket("${afkBucketId}");`,
			`afk = filter_keyvals(afk, "status", ["not-afk"]);`,
			`window = filter_period_intersect(window, afk);`,
			`merged = merge_events_by_keys(window, ["app"]);`,
			`RETURN = merged;`,
		];

		const results = await this.queryTimeperiod([timeperiod], query);
		const appData: Map<string, number> = new Map();

		if (results.length > 0) {
			const resultData = results[0];
			let events: ActivityWatchEvent[] = [];

			if (Array.isArray(resultData)) {
				events = resultData;
			} else if (resultData.RETURN && Array.isArray(resultData.RETURN)) {
				events = resultData.RETURN;
			}

			for (const event of events) {
				const app = (event.data.app as string) ?? "Unknown";
				const duration = event.duration;
				appData.set(app, (appData.get(app) ?? 0) + duration);
			}
		}

		return Array.from(appData.entries())
			.map(([app, duration]) => ({ app, duration }))
			.sort((a, b) => b.duration - a.duration);
	}

	static formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	}

	static generatePieChartMarkdown(appData: AppTimeData[]): string {
		if (appData.length === 0) {
			return "No activity data available for this day.";
		}

		const totalSeconds = appData.reduce((sum, item) => sum + item.duration, 0);
		const totalHours = (totalSeconds / 3600).toFixed(2);

		let markdown = `**Total Active Time:** ${totalHours} hours (${Math.floor(totalSeconds)} seconds)\n\n`;
		markdown += "```\n";

		for (const item of appData) {
			const paddedApp = item.app.padEnd(30, " ");
			const seconds = Math.floor(item.duration);
			markdown += `${paddedApp} ${seconds}s\n`;
		}

		markdown += "```";

		return markdown;
	}
}
