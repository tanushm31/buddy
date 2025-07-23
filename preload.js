const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	sendMessage: (msg) => ipcRenderer.invoke("chat-message", msg),
});
