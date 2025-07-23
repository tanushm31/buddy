const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
// const { execSync } = require("child_process");
const activeWin = require("active-win");

// main.js or any Node context in Electron
const { execSync } = require("child_process");
const clipboardy = require("clipboardy");

// Helper: Get mouse position using 'cliclick'
function getMousePos() {
	try {
		const out = execSync("cliclick p").toString();
		const [x, y] = out.match(/\d+/g).map(Number);
		return { x, y };
	} catch (e) {
		return { x: null, y: null };
	}
}

// Helper: Get active application name using AppleScript
function getActiveApp() {
	try {
		const script = `tell application "System Events"
      set frontApp to name of first application process whose frontmost is true
    end tell
    return frontApp`;
		return execSync(`osascript -e '${script}'`).toString().trim();
	} catch (e) {
		return "unknown";
	}
}

// Helper: Get active window title using AppleScript
function getActiveWindowTitle() {
	try {
		const script = `tell application "System Events"
      set frontApp to first application process whose frontmost is true
      tell frontApp
        if (count of windows) > 0 then
          value of attribute "AXTitle" of window 1
        else
          ""
        end if
      end tell
    end tell`;
		return execSync(`osascript -e '${script}'`).toString().trim();
	} catch (e) {
		return "unknown";
	}
}

// Helper: Get clipboard text (safe)
function getClipboard() {
	try {
		return clipboardy.readSync();
	} catch (e) {
		return "";
	}
}

// Main context gatherer
async function getScreenContext() {
	const cursor = getMousePos();
	const activeApp = getActiveApp();
	const activeWindowTitle = getActiveWindowTitle();
	const clipboard = getClipboard();
	return {
		cursor, // { x, y }
		activeApp, // "Google Chrome", "Slack", etc.
		activeWindowTitle, // Window title (tab/page/document name)
		clipboard, // Text in clipboard (if any)
	};
}

let messages = []; // Keep chat context

function createWindow() {
	const win = new BrowserWindow({
		width: 500,
		height: 650,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	win.loadFile("index.html");
}

// Handle incoming message from renderer, call Ollama, and send back response
ipcMain.handle("chat-message", async (event, userMessage) => {
	messages.push({ role: "user", content: userMessage });
	const response = await axios.post("http://localhost:11434/api/chat", {
		model: "llama3",
		messages,
		stream: false,
	});
	console.log("OLLAMA RESPONSE:", response.data);
	const botMessage = response.data.message.content;
	messages.push({ role: "assistant", content: botMessage });
	return botMessage;
});
// Does not work on macOS
async function readScreenTextPython() {
	try {
		const output = execSync(
			"venv-screenreader/bin/python read_screen_text.py"
		).toString();
		return output;
	} catch (e) {
		return "Error running screenreader script: " + e.toString();
	}
}

function ocrImage(imagePath) {
	try {
		const text = execSync(`tesseract "${imagePath}" stdout --psm 6`).toString();
		return text;
	} catch (e) {
		return "OCR error: " + e.toString();
	}
}

// Usage after screenshot
const screenshot = require("screenshot-desktop");
screenshot({ filename: "screen.png" }).then((imgPath) => {
	const text = ocrImage(imgPath);
	console.log(text);
});

function getDetailsAfterDelay(delay) {
	// return new Promise((resolve) => {
	// setTimeout(() => {
	// 	const pos = getMousePos();
	// 	resolve(pos);
	// 	console.log("Mouse position after delay:", pos);
	// }, delay);

	setInterval(async () => {
		// const info = await activeWin();
		// const pos = getMousePos();
		// console.log("Current mouse position:", pos);
		// console.log(info);
		// const text = await readScreenTextPython();

		// console.log("Text under mouse:", text);
		screenshot({ filename: "screen.png" }).then((imgPath) => {
			const text = ocrImage(imgPath);
			console.log(text);
		});
		await getScreenContext().then(console.log);
	}, delay);
	// });
}
(async () => {})();

app.whenReady().then(() => {
	createWindow();
	getDetailsAfterDelay(5000);
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
