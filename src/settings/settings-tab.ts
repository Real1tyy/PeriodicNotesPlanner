import { type App, PluginSettingTab } from "obsidian";
import type PeriodicPlannerPlugin from "../main";
import { cls, toggleCls } from "../utils/css";
import { BasesSettings } from "./bases-settings";
import { CategorySettings } from "./category-settings";
import { GenerationSettings } from "./generation-settings";
import { IntegrationSettings } from "./integration-settings";
import { PeriodicSettings } from "./periodic-settings";
import { PropertySettings } from "./property-settings";

type TabId = "periodic" | "properties" | "categories" | "generation" | "integrations" | "bases";

export class PeriodicPlannerSettingsTab extends PluginSettingTab {
	private activeTab: TabId = "periodic";
	private contentEl: HTMLElement | null = null;

	private periodicSettings: PeriodicSettings;
	private propertySettings: PropertySettings;
	private categorySettings: CategorySettings;
	private generationSettings: GenerationSettings;
	private integrationSettings: IntegrationSettings;
	private basesSettings: BasesSettings;

	constructor(app: App, plugin: PeriodicPlannerPlugin) {
		super(app, plugin);

		this.periodicSettings = new PeriodicSettings(plugin.settingsStore);
		this.propertySettings = new PropertySettings(plugin.settingsStore);
		this.categorySettings = new CategorySettings(plugin.settingsStore);
		this.generationSettings = new GenerationSettings(plugin.settingsStore);
		this.integrationSettings = new IntegrationSettings(plugin.settingsStore, app);
		this.basesSettings = new BasesSettings(plugin.settingsStore);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("p", {
			text: "Configure your periodic note generation, time budgeting, and hierarchical planning system.",
			cls: "setting-item-description",
		});

		// Tab navigation
		this.createTabNavigation(containerEl);

		// Content area
		this.contentEl = containerEl.createDiv({ cls: cls("settings-content") });
		this.renderActiveTab();

		const linksContainer = containerEl.createDiv({ cls: cls("settings-support-container") });
		linksContainer.createEl("a", {
			text: "Support the development",
			href: "https://matejvavroproductivity.com/support/",
			cls: cls("settings-support-link"),
		});
	}

	private createTabNavigation(containerEl: HTMLElement): void {
		const tabsContainer = containerEl.createDiv({ cls: cls("settings-tabs") });

		const tabs: { id: TabId; label: string; icon: string }[] = [
			{ id: "periodic", label: "Periodic Settings", icon: "calendar" },
			{ id: "categories", label: "Categories", icon: "tag" },
			{ id: "properties", label: "Properties", icon: "list" },
			{ id: "generation", label: "Generation", icon: "play" },
			{ id: "integrations", label: "Integrations", icon: "plug" },
			{ id: "bases", label: "Bases", icon: "database" },
		];

		for (const tab of tabs) {
			const tabEl = tabsContainer.createEl("button", {
				text: tab.label,
				cls: cls("tab") + (this.activeTab === tab.id ? ` ${cls("active")}` : ""),
			});

			tabEl.addEventListener("click", () => {
				this.activeTab = tab.id;
				this.updateTabStyles(tabsContainer);
				this.renderActiveTab();
			});
		}
	}

	private updateTabStyles(tabsContainer: HTMLElement): void {
		const tabs = tabsContainer.querySelectorAll(`.${cls("tab")}`);
		const tabIds: TabId[] = ["periodic", "categories", "properties", "generation", "integrations", "bases"];

		tabs.forEach((tab, index) => {
			toggleCls(tab as HTMLElement, "active", tabIds[index] === this.activeTab);
		});
	}

	private renderActiveTab(): void {
		if (!this.contentEl) return;
		this.contentEl.empty();

		switch (this.activeTab) {
			case "periodic":
				this.periodicSettings.display(this.contentEl);
				break;
			case "categories":
				this.categorySettings.display(this.contentEl);
				break;
			case "properties":
				this.propertySettings.display(this.contentEl);
				break;
			case "generation":
				this.generationSettings.display(this.contentEl);
				break;
			case "integrations":
				this.integrationSettings.display(this.contentEl);
				break;
			case "bases":
				this.basesSettings.display(this.contentEl);
				break;
		}
	}
}
