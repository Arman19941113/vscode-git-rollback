// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "git-rollback-file" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'git-rollback-file.rollbackFile',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor found');
        return;
      }

      const document = editor.document;
      const filePath = document.uri.fsPath;
      const filename = path.basename(filePath);
      const dirPath = path.dirname(filePath);
      vscode.window.showInformationMessage(`Rolling back file: ${filename}`);

      try {
        // check if file exists
        if (!fs.existsSync(filePath)) {
          vscode.window.showErrorMessage('File does not exist');
          return;
        }

        // check if a git repo
        try {
          execSync('git rev-parse --is-inside-work-tree', { cwd: dirPath });
        } catch (error) {
          vscode.window.showErrorMessage('Not a git repository');
          return;
        }

        const isFileTracked =
          execSync(`git ls-files -- ${filePath}`, { cwd: dirPath }).toString().trim() !==
          '';
        if (isFileTracked) {
          execSync(`git restore -WS ${filePath}`, { cwd: dirPath });
          vscode.window.showInformationMessage('File has been restored successfully');
        } else {
          execSync(`git clean -fx ${filePath}`, { cwd: dirPath });
          vscode.window.showInformationMessage('File has been cleaned successfully');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to rollback file: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
