import { App, Setting, TFile } from "obsidian";
import FinanceManager from "./main";
import { View } from "./settings";

export function trimFile(file: TFile): string {
    return file.path.slice(0, -3);
}