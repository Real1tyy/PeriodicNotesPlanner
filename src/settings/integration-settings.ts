import type { App } from "obsidian";
import { Notice, Setting } from "obsidian";
import { SETTINGS_DEFAULTS } from "../constants";
import type { SettingsStore } from "../core/settings-store";
import { processAllDailyNotesForActivityWatch } from "../utils/activity-watch";

export class IntegrationSettings {
	constructor(
		private settingsStore: SettingsStore,
		private app: App
	) {}

	display(containerEl: HTMLElement): void {
		new Setting(containerEl).setName("Integrations").setHeading();

		containerEl.createEl("p", {
			text: "Configure third-party integrations to enhance your periodic planning workflow.",
			cls: "setting-item-description",
		});

		new Setting(containerEl).setName("ActivityWatch").setHeading();

		containerEl.createEl("p", {
			text: "Connect to ActivityWatch to automatically track and visualize your computer usage in daily notes. ActivityWatch data is only added to past daily notes.",
			cls: "setting-item-description",
		});

		new Setting(containerEl)
			.setName("Enable ActivityWatch")
			.setDesc("Enable ActivityWatch integration for daily notes")
			.addToggle((toggle) => {
				toggle.setValue(this.settingsStore.currentSettings.activityWatch.enabled).onChange(async (value) => {
					await this.settingsStore.updateSettings((s) => ({
						...s,
						activityWatch: {
							...s.activityWatch,
							enabled: value,
						},
					}));
				});
			});

		new Setting(containerEl)
			.setName("ActivityWatch API URL")
			.setDesc("The URL of your ActivityWatch server (default: http://localhost:5600)")
			.addText((text) => {
				text
					.setPlaceholder(SETTINGS_DEFAULTS.ACTIVITY_WATCH_URL)
					.setValue(this.settingsStore.currentSettings.activityWatch.apiUrl)
					.onChange(async (value) => {
						await this.settingsStore.updateSettings((s) => ({
							...s,
							activityWatch: {
								...s.activityWatch,
								apiUrl: value || SETTINGS_DEFAULTS.ACTIVITY_WATCH_URL,
							},
						}));
					});
			});

		new Setting(containerEl)
			.setName("ActivityWatch heading")
			.setDesc("The heading to use for ActivityWatch sections in daily notes")
			.addText((text) => {
				text
					.setPlaceholder(SETTINGS_DEFAULTS.ACTIVITY_WATCH_HEADING)
					.setValue(this.settingsStore.currentSettings.activityWatch.heading)
					.onChange(async (value) => {
						await this.settingsStore.updateSettings((s) => ({
							...s,
							activityWatch: {
								...s.activityWatch,
								heading: value || SETTINGS_DEFAULTS.ACTIVITY_WATCH_HEADING,
							},
						}));
					});
			});

		new Setting(containerEl).setName("Actions").setHeading();

		new Setting(containerEl)
			.setName("Process all daily notes")
			.setDesc(
				"Scan all past daily notes and add ActivityWatch data to notes that don't have it yet. This will not affect today's note or future notes."
			)
			.addButton((button) => {
				button.setButtonText("Process now").onClick(async () => {
					const settings = this.settingsStore.currentSettings;

					if (!settings.activityWatch.enabled) {
						new Notice("ActivityWatch integration is disabled. Enable it first.");
						return;
					}

					button.setDisabled(true);
					button.setButtonText("Processing...");

					try {
						await processAllDailyNotesForActivityWatch(this.app, settings);
						new Notice("ActivityWatch data processing complete!");
					} catch (error) {
						console.error("Error processing daily notes:", error);
						new Notice(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
					} finally {
						button.setDisabled(false);
						button.setButtonText("Process now");
					}
				});
			});
	}
}
