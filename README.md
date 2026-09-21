# 📝 Flow — Notebook-Inspired Task Manager

> **Turn your tasks into a flow. Stay organized. Keep moving.**

**Flow** is a notebook-inspired task management web application designed to make everyday planning feel simple, visual, and engaging.

It combines task organization, priority management, due dates, drag-and-drop reordering, search, filtering, and progress tracking inside a responsive interface inspired by the familiarity of a personal notebook.

---

## ✨ Overview

Traditional task managers can sometimes feel overly complicated.

**Flow** takes a simpler approach: give users a focused workspace where they can quickly capture tasks, organize priorities, track progress, and keep everything available directly in the browser.

The application uses **local storage persistence**, allowing tasks to remain available between sessions without requiring a backend or account.

---

## 🚀 Features

### ✅ Task Management

* Create tasks
* Edit existing tasks
* Mark tasks as completed
* Delete tasks
* Track task progress

### 🎯 Priority Management

Organize tasks according to their importance and keep attention focused on what matters most.

### 📅 Due Dates

Assign due dates to tasks to make upcoming work easier to manage.

### 🖱️ Drag & Drop

Reorder tasks naturally using drag-and-drop interaction.

This makes it easy to change the order of work as priorities change.

### 🔎 Search & Filtering

Quickly find relevant tasks using:

* Search
* Task filtering
* Completion status
* Organization by task state

### 📊 Progress Tracking

The interface provides a visual representation of task completion, making it easier to understand overall progress.

### 💾 Local Persistence

Tasks are automatically stored using the browser's **localStorage**.

```text
Create / Edit Task
        │
        ▼
   Task State
        │
        ▼
   localStorage
        │
        ▼
Browser Persistence
```

This means the application can work without requiring a database or user account.

### 📱 Responsive Design

Flow is designed to work across different screen sizes:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

### ⚡ Progressive Web App

The repository includes PWA-related assets such as a web app manifest, service worker, and application icons, supporting a more app-like browser experience.

---

## 🧩 How It Works

```text
                     ┌─────────────────┐
                     │      User       │
                     └────────┬────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Create / Manage  │
                    │      Tasks        │
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       ┌──────────┐    ┌────────────┐    ┌──────────┐
       │ Priority │    │  Due Date  │    │ Progress │
       │  System  │    │ Management │    │ Tracking │
       └────┬─────┘    └─────┬──────┘    └────┬─────┘
            │                │                │
            └────────────────┼────────────────┘
                             ▼
                    ┌──────────────────┐
                    │    Task State    │
                    └────────┬─────────┘
                             ▼
                    ┌──────────────────┐
                    │   localStorage   │
                    └──────────────────┘
```

---

## 🎨 Design Philosophy

Flow is built around a simple idea:

> **Task management should feel natural, not administrative.**

The notebook-inspired interface aims to make digital planning feel familiar while still providing the convenience of modern web interactions.

### 📖 Familiar

Inspired by the simplicity of writing tasks in a personal notebook.

### ✨ Interactive

Drag-and-drop interactions and dynamic task states make planning more engaging.

### 🎯 Focused

The interface keeps attention on tasks, priorities, and progress.

### 📱 Accessible

A responsive layout allows the application to be used across different devices.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Browser APIs

* LocalStorage
* Drag & Drop API
* Service Worker
* Web App Manifest

### Application

* Responsive Web Design
* Progressive Web App architecture

### Deployment

The project can be deployed as a static web application using platforms such as GitHub Pages, Vercel, or Netlify.

---

## 📁 Project Structure

```text
Flow-To-Do/
│
├── index.html
├── script.js
├── style.css
│
├── manifest.json
├── sw.js
│
├── icon-192.png
├── icon-512.png
│
├── LICENSE
└── README.md
```

The current repository contains the core HTML, CSS, JavaScript, manifest, service worker, and application icon files.

---

## 💾 Data Persistence

Flow uses the browser's **localStorage** to persist task information.

```text
User
 │
 ▼
Task Creation
 │
 ▼
JavaScript State
 │
 ▼
localStorage
 │
 ▼
Browser
```

No external database is required for the current implementation.

This makes the application lightweight and suitable for quick personal task management.

---

## 🔐 Privacy

Because the current application stores task information locally in the browser, there is no requirement to send task data to a remote database.

However, users should still avoid storing highly sensitive information inside any browser-based task application.

---

## 🔮 Future Improvements

Potential improvements include:

* [ ] Task categories
* [ ] Recurring tasks
* [ ] Calendar view
* [ ] Dark mode
* [ ] Custom themes
* [ ] Task reminders
* [ ] Browser notifications
* [ ] Import/export tasks
* [ ] Cloud synchronization
* [ ] User authentication
* [ ] Cross-device synchronization
* [ ] Advanced productivity analytics
* [ ] Keyboard shortcuts
* [ ] Offline-first improvements

---

## 💡 Why I Built This

I wanted to explore how a simple task manager could combine the familiarity of a physical notebook with the flexibility of a modern web application.

**Flow** is an exploration of frontend development, browser storage, interaction design, responsive layouts, and lightweight application architecture.

The project demonstrates how useful productivity software can be built without requiring a complex backend.

---

## 👨‍💻 Author

**Shayan Gon Choudhury**
Computer Science & Engineering Student

* 💼 **LinkedIn:** [linkedin.com/in/shayan-gon-choudhury](https://www.linkedin.com/in/shayan-gon-choudhury-37a842315)
* 🐙 **GitHub:** [@shayangonchoudhury-svg](https://github.com/shayangonchoudhury-svg)
* 📧 **Email:** [shayangonchoudhuryskms@gmail.com](mailto:shayangonchoudhuryskms@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License**.
