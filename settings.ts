import { App, PluginSettingTab, Setting, TAbstractFile, TFile, normalizePath } from "obsidian";
import FinanceManager from "./main";

export interface FinanceSettings {
	transactionsFolder: string,
	mainNoteName: string
}

export const DEFAULT_SETTINGS: FinanceSettings = {
	transactionsFolder: 'FinanceTracker',
	mainNoteName: 'FinanceManagerReport'
}

export class FinanceSettingTab extends PluginSettingTab {
	plugin: FinanceManager;
    settings: FinanceSettings;

	constructor(app: App, plugin: FinanceManager) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for finance manager.'});

        let mainNoteSetting = new Setting(containerEl)
            .setName('Main file')
            .setDesc('File where all of the statistics will be shown.')
            .addText(text => text
                .setPlaceholder('Enter the name of the file')
                .setValue(this.plugin.settings.mainNoteName)
                .onChange(async (value) => {
                    console.log('Main note name: ' + value);
                    this.plugin.settings.mainNoteName = value;
                    await this.plugin.saveSettings();
                }));
            

		let transactionFolderSetting = new Setting(containerEl)
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
	}
}