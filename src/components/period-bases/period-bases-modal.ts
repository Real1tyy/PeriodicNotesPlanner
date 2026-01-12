import { type App, Component, MarkdownRenderer, Modal } from "obsidian";
import { PERIOD_TYPE_LABELS } from "../../constants";
import type { IndexedPeriodNote } from "../../types";
import type { BasesViewSettings } from "../../types/schemas";
import { cls } from "../../utils/css";
import { formatPeriodIntervalForBases } from "../../utils/date-utils";

export class PeriodBasesModal extends Modal {
	private component: Component;

	constructor(
		app: App,
		private periodNote: IndexedPeriodNote,
		private settings: BasesViewSettings
	) {
		super(app);
		this.component = new Component();
		this.component.load();
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass(cls("period-bases-modal"));

		const title = `Tasks: ${PERIOD_TYPE_LABELS[this.periodNote.periodType]} - ${this.periodNote.noteName}`;
		contentEl.createEl("h2", { text: title });

		const markdownContainer = contentEl.createDiv({
			cls: cls("bases-markdown-container"),
		});

		void this.renderBasesView(markdownContainer);
	}

	onClose(): void {
		this.component.unload();
		this.contentEl.empty();
	}

	private async renderBasesView(container: HTMLElement): Promise<void> {
		const { tasksDirectory, dateProperty, propertiesToShow } = this.settings;

		const orderSection = this.buildOrderSection(propertiesToShow, dateProperty);

		const { start: startDateWithoutTz, end: endDateWithoutTz } = formatPeriodIntervalForBases(
			this.periodNote.periodStart,
			this.periodNote.periodEnd
		);

		const basesMarkdown = `
\`\`\`base
views:
  - type: table
    name: ${PERIOD_TYPE_LABELS[this.periodNote.periodType]} Tasks${orderSection}
    filters:
      and:
        - file.inFolder("${tasksDirectory}")
        - ${dateProperty} > "${startDateWithoutTz}"
        - ${dateProperty} < "${endDateWithoutTz}"
    sort:
      - ${dateProperty}: desc
\`\`\`
`;

		await MarkdownRenderer.render(this.app, basesMarkdown, container, this.periodNote.filePath, this.component);
	}

	private buildOrderSection(propertiesToShow: string, dateProperty: string): string {
		const properties = new Set<string>();

		properties.add("file.name");
		properties.add(dateProperty);
		if (propertiesToShow && propertiesToShow.trim() !== "") {
			const userProperties = propertiesToShow
				.split(",")
				.map((p) => p.trim())
				.filter((p) => p.length > 0);
			for (const prop of userProperties) {
				properties.add(prop);
			}
		}
		const orderArray = Array.from(properties)
			.map((prop) => `      - ${prop}`)
			.join("\n");
		return `
    order:
${orderArray}`;
	}
}
