---

## 📝 Configuration

- **Model Selection:**  
  Buddy uses `llama3` by default. To use another model, change the `model` value in `main.js` and pull it with `ollama pull <modelname>`.
- **Conversation Memory:**  
  Chat context is kept for each session—just restart the app to reset.
- **No streaming yet:**  
  Want ChatGPT-style typing? PRs and issues welcome!

---

## 🤔 FAQ

**Q: Does my data ever leave my machine?**  
A: Nope! Buddy is 100% local — nothing is sent anywhere.

**Q: Can I use other models?**  
A: Absolutely. Pull them via Ollama and change the config.

**Q: Will you add web search, plugins, or streaming?**  
A: Maybe! Open an issue, or send a PR. The repo is open for remixing.

---

## 🧠 How It Works

- **Frontend:** Electron app, vanilla HTML/JS UI.
- **Backend:** Talks to Ollama’s REST API (`http://localhost:11434`).
- **No cloud, no nonsense.**

---

## 📄 License

MIT — Hack away, remix, commercial use okay.  
Just don’t blame us if your AI judges your music taste.

---

## 👤 Author

Made with ☕ by [Tanush Mahajan](https://github.com/tanushm31)  
[LinkedIn](https://linkedin.com/in/tanushxm/)

---

> _“Pixels dream of meaning—on your machine, not theirs.”_
