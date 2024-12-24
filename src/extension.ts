import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('ahmettopak-log-viewer.highlightLogs', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const text = document.getText();

            // Regex patterns for timestamp, Frame ID, and Data
            const timestampRegex = /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.(\d{6})\]/g; // Date, Time, Millisecond parts
            const frameIdRegex = /Frame ID:/g; // Frame ID header
            const dataRegex = /Data:/g; // Data header
            const frameIdDataRegex = /Frame ID: ([A-F0-9\s]+)/g; // Frame ID data
            const dataValuesRegex = /Data: ([A-F0-9\s]+)/g; // Data values

            // Arrays to store decorations for different parts
            const timestampDecorations: vscode.DecorationOptions[] = [];
            const frameIdHeaderDecorations: vscode.DecorationOptions[] = [];
            const dataHeaderDecorations: vscode.DecorationOptions[] = [];
            const frameIdDataDecorations: vscode.DecorationOptions[] = [];
            const dataValuesDecorations: vscode.DecorationOptions[] = [];

            let match;
            // Highlight Timestamp matches (Date, Time, Milliseconds separately)
            while ((match = timestampRegex.exec(text)) !== null) {
                const fullMatchStart = document.positionAt(match.index);
                const fullMatchEnd = document.positionAt(match.index + match[0].length);

                // Date part - separate color for date
                const dateStartPos = document.positionAt(match.index + 1); // Skip the '['
                const dateEndPos = document.positionAt(match.index + match[1].length + 1); // Skip the ']'
                const dateDecoration = { range: new vscode.Range(dateStartPos, dateEndPos) };

                // Time part - separate color for time
                const timeStartPos = document.positionAt(match.index + match[1].length + 2); // After date and space
                const timeEndPos = document.positionAt(match.index + match[1].length + 2 + match[2].length); // Time length
                const timeDecoration = { range: new vscode.Range(timeStartPos, timeEndPos) };

                // Milliseconds part - separate color for milliseconds
                const milliStartPos = document.positionAt(match.index + match[1].length + match[2].length + 3); // After time and period
                const milliEndPos = document.positionAt(match.index + match[0].length - 1); // End of the millisecond part
                const milliDecoration = { range: new vscode.Range(milliStartPos, milliEndPos) };

                timestampDecorations.push(dateDecoration, timeDecoration, milliDecoration);
            }

            // Highlight Frame ID header
            while ((match = frameIdRegex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                frameIdHeaderDecorations.push(decoration);
            }

            // Highlight Data header
            while ((match = dataRegex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                dataHeaderDecorations.push(decoration);
            }

            // Highlight Frame ID data values
            while ((match = frameIdDataRegex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                frameIdDataDecorations.push(decoration);
            }

            // Highlight Data values
            while ((match = dataValuesRegex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                dataValuesDecorations.push(decoration);
            }

            // Decoration types with refined, distinct colors
            const timestampDateDecoration = vscode.window.createTextEditorDecorationType({
                color: '#7F9BEB', // Light SteelBlue for date part
                fontWeight: 'bold',
            });

            const timestampTimeDecoration = vscode.window.createTextEditorDecorationType({
                color: '#A5C1D1', // Light SlateGrey for time part
                fontWeight: 'normal',
            });

            const timestampMilliDecoration = vscode.window.createTextEditorDecorationType({
                color: '#F45D5D', // Tomato for milliseconds part
                fontStyle: 'italic',
            });

            const frameIdHeaderDecoration = vscode.window.createTextEditorDecorationType({
                color: '#F6A800', // Golden for Frame ID header
                fontWeight: 'bold',
            });

            const dataHeaderDecoration = vscode.window.createTextEditorDecorationType({
                color: '#FF8C00', // Dark Orange for Data header
                fontWeight: 'bold',
            });

            const frameIdDataDecoration = vscode.window.createTextEditorDecorationType({
                color: '#8DCA3E', // Medium SeaGreen for Frame ID data
                fontWeight: 'normal',
            });

            const dataValuesDecoration = vscode.window.createTextEditorDecorationType({
                color: '#4CAF50', // MediumGreen for Data values
                fontWeight: 'normal',
            });

            // Apply the decorations
            editor.setDecorations(timestampDateDecoration, timestampDecorations);
            editor.setDecorations(timestampTimeDecoration, timestampDecorations);
            editor.setDecorations(timestampMilliDecoration, timestampDecorations);
            editor.setDecorations(frameIdHeaderDecoration, frameIdHeaderDecorations);
            editor.setDecorations(dataHeaderDecoration, dataHeaderDecorations);
            editor.setDecorations(frameIdDataDecoration, frameIdDataDecorations);
            editor.setDecorations(dataValuesDecoration, dataValuesDecorations);
        }
    });

    // Automatically activate the extension when opening a .log file
    vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === '.log') {
            vscode.commands.executeCommand('ahmettopak-log-viewer.highlightLogs');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
