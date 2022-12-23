import { App, Editor, MarkdownView, Modal, Notice, Plugin, View, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, Mode, FinanceSettings, FinanceSettingTab } from './settings';
import { trimFile } from "./utils";
// Remember to rename these classes and interfaces!

export default class FinanceManager extends Plugin {
	settings: FinanceSettings;

	executing: boolean = false;

	report: string = '';

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Open Finance', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.openReport();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Finance Manager');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new FinanceSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	openReport = async (): Promise<void> => {
		this.executing = true;
		this.report = this.getReportName();
		let mode = Mode.Retain;
	
		if (!this.settings.autoCreate && await this.getReportNonexistancy()) {
			new Notice(`Report ${this.report} does not exist.`);
			this.executing = false;
			return;
		}
		
		//mode != Mode.ReplaceAll
		if (true) {
			const alreadyOpened = this.getOpenedReport();

			if (alreadyOpened !== undefined) {
				this.app.workspace.setActiveLeaf(alreadyOpened);
				await this.configureReport();
				return;
			}
		}

		await this.openReportLink(mode as Mode);
		
		if (this.app.workspace.getActiveFile() == null) {
			//hack to fix bug with opening link when homepage is already extant beforehand
			await this.openReportLink(mode as Mode);
		}

		await this.configureReport();
		
	}

	async openReportLink(mode: Mode): Promise<void> {
		await this.app.workspace.openLinkText(
			this.report, "", mode == Mode.Retain, {active: true}
		);
	}

	async getReportNonexistancy(): Promise<boolean> {
		return !(await this.app.vault.adapter.exists(`${this.report}.md`));
	}

	getReportName(): string {
		return this.settings.reportName;
	}

	getOpenedReport(): WorkspaceLeaf | undefined {
		let leaves = this.app.workspace.getLeavesOfType("markdown").concat(
			this.app.workspace.getLeavesOfType("kanban")
		);

		return leaves.find(
			leaf => trimFile((leaf.view as any).file) == this.report
		);
	}

	async configureReport(): Promise<void> {
		this.executing = false;

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view === null) return;

		const state = view.getState();

		state.mode = "preview";

		await view.leaf.setViewState({type: "markdown", state: state});
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
