const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

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

app.whenReady().then(() => {
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
