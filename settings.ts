import { App, PluginSettingTab, Setting, TAbstractFile, TFile, normalizePath } from "obsidian";
import FinanceManager from "./main";

export interface FinanceSettings {
	transactionsFolder: string,
	reportName: string,
	autoCreate: boolean
}

export const DEFAULT_SETTINGS: FinanceSettings = {
	transactionsFolder: 'FinanceTracker',
	reportName: 'FinanceManagerReport',
	autoCreate: true
}

export class FinanceSettingTab extends PluginSettingTab {
	plugin: FinanceManager;
    settings: FinanceSettings;

	constructor(app: App, plugin: FinanceManager) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for finance manager.'});

        new Setting(containerEl)
            .setName('Report file')
            .setDesc('File where all of the statistics will be shown.')
            .addText(text => text
                .setPlaceholder('Enter the name of the file')
                .setValue(this.plugin.settings.reportName)
                .onChange(async (value) => {
                    console.log('Report note name: ' + value);
                    this.plugin.settings.reportName = value;
                    await this.plugin.saveSettings();
                }));
            

		new Setting(containerEl)
			.setName('Payment nodes folder')
			.setDesc('File where all of the transactions will be stored.')
			.addText(text => text
				.setPlaceholder('Enter the name of the folder')
				.setValue(this.plugin.settings.transactionsFolder)
				.onChange(async (value) => {
					console.log('Transactions folder: ' + value);
					this.plugin.settings.transactionsFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Auto create')
			.setDesc('Automatically create the report file and the folder for transactions.')
			.addToggle(toggle => toggle
				.setValue(this.settings.autoCreate)
				.onChange(async (value) => {
					this.settings.autoCreate = value;
					await this.plugin.saveSettings();
					this.display();
				}));
	}
}