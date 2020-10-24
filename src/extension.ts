import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const commandId = 'vscloc.countLinesOfCode';

	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = commandId;
	context.subscriptions.push(statusBarItem);

	context.subscriptions.push(vscode.commands.registerCommand(commandId, () => {
		updateStatusBarItem(statusBarItem, true);
	}));

	let updater = () => updateStatusBarItem(statusBarItem, false);
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updater));
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(updater));
}

function updateStatusBarItem(statusBarItem : vscode.StatusBarItem, showPopup : boolean) : void {
	let curPath = vscode.window.activeTextEditor?.document.fileName;

	if (!curPath) {
		statusBarItem.hide();
		return;
	}

	if (!fs.existsSync(curPath)) {
		statusBarItem.hide();
		return;
	}

	let config = vscode.workspace.getConfiguration('vscloc');
	let cmd = config.cmd.replace('%f', curPath);
	child_process.exec(cmd, (err, stdout, _stderr) => {
		if (err) {
			statusBarItem.hide();
			console.log(`error caling cloc: ${err}`);
			return;
		}
		let clocRes = JSON.parse(stdout);
		let blankCnt = parseInt(clocRes['SUM']['blank']);
		let commentCnt = parseInt(clocRes['SUM']['comment']);
		let codeCnt = parseInt(clocRes['SUM']['code']);
		let totalCnt = blankCnt + commentCnt + codeCnt;

		let infoStr = config.format
			.replace('%t', totalCnt)
			.replace('%c', commentCnt)
			.replace('%s', codeCnt)
			.replace('%b', blankCnt);
		if (showPopup) {
			vscode.window.showInformationMessage(`Total ${totalCnt} lines: `
				+ `${commentCnt} comments, `
				+ `${blankCnt} blank, `
				+ `${codeCnt} code`);
		}

		statusBarItem.text = infoStr;
		statusBarItem.show();
	});
}

export function deactivate() {}
