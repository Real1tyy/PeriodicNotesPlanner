import { ItemView, type WorkspaceLeaf } from "obsidian";
import type PeriodicPlannerPlugin from "../../main";
import { cls } from "../../utils/css";
import { PeriodBasesView } from "./period-bases-view";

export const VIEW_TYPE_PERIOD_BASES = "periodic-planner-bases-view";

export class PeriodBasesItemView extends ItemView {
	private basesView: PeriodBasesView | null = null;

	constructor(
		leaf: WorkspaceLeaf,
		private plugin: PeriodicPlannerPlugin
	) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_PERIOD_BASES;
	}

	getDisplayText(): string {
		return "Period Tasks";
	}

	getIcon(): string {
		return "list-checks";
	}

	async onOpen(): Promise<void> {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass(cls("period-bases-view-content"));

		this.basesView = new PeriodBasesView(this.app, this.contentEl, this.plugin.settingsStore, this.plugin.periodIndex);

		this.registerEvent(
			this.app.workspace.on("file-open", async () => {
				if (this.basesView) {
					await this.basesView.updateActiveFile();
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", async () => {
				if (this.basesView) {
					await this.basesView.updateActiveFile();
				}
			})
		);

		await this.basesView.render();
	}

	async onClose(): Promise<void> {
		if (this.basesView) {
			this.basesView.destroy();
			this.basesView = null;
		}
	}
}
