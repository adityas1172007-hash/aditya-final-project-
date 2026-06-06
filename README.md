# AI Research Console 🌌

A minimalist, dark-themed web interface for interacting with the Google Gemini API. The UI is heavily inspired by Google Colab and modern IDEs, designed for rapid and distraction-free AI research.

## 🏗️ System Architecture

This project implements a secure **Client-Server Proxy Architecture**. To prevent API key leaks on public repositories, the frontend does not communicate directly with the LLM. 

* **Frontend (Client):** Vanilla HTML, CSS, and JavaScript. Hosted on GitHub Pages.
* **Backend (Proxy Server):** Python Flask API. Hosted on PythonAnywhere.
* **LLM Engine:** Google Gemini API (`gemini-pro` model).

**Data Flow Logic:** `User Prompt` ➔ `Frontend (JS Fetch)` ➔ `Python Flask Backend` ➔ `Gemini API` ➔ `JSON Response` ➔ `Frontend Display`

## ✨ Features

* **Zero Credential Exposure:** API keys are isolated as backend environment variables.
* **Colab-Style UI:** Deep dark background (`#121212`) to reduce eye strain during long research sessions.
* **Dynamic Input:** Auto-resizing text area with `Shift + Enter` line-break support.
* **CORS Enabled:** Seamless cross-origin resource sharing between GitHub Pages and PythonAnywhere.

## 🚀 Tech Stack

* **Frontend:** HTML5, CSS3, JS (ES6)
* **Backend:** Python 3.10, Flask, Requests, Flask-CORS
* 
