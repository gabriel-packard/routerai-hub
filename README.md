# RouterAI Dashboard

An interactive, multi-category AI tools directory, featuring a "Cybersecurity First" mindset assistant.

### 🚀 Feature
### 🗂️ 100 AI Tools Directory
* **10 Categorized Collections**: 10 distinct AI fields (including Free, Paid, Developer, Cybersecurity, and Data Analysis).
* **10 Tools Per Category**: Exactly 10 active, real-world tools detailed per category with descriptions, direct links, and quick pros/cons.

### 🔌 Live Web Search Control
* Features an interactive **Web Search Toggle** switch (enabled by default).
* Displays a clear static-data warning banner across the chat layout the moment a user switches live search off.

### 🎨 Visuals & Dark Mode Aesthetics
* **Dynamic Glow Effects**: Category cards and buttons feature custom, color-shifting glow animations on hover and click.
* **Midnight Beach Theme**: Switching to dark mode transforms the interface into a deep, full-moon starry beach layout with translucent glassmorphic components.

### 🎵 Ambient Audio Player
* Integrates a continuous, low-fi background instrumental loop.
* Managed entirely by an interactive, spinning vinyl record icon in the header that plays, pauses, and stops spinning on click.

### 📰 Pre-Chat Cyber News Slideshow & Sidepane
* Features a rotating carousel of live cybersecurity alerts directly above the chat bar.
* Focusing on the chat fades the carousel out, while clicking a specific story slides open a glassmorphic Sidepane for a complete threat breakdown and productivity defense guide.

### 🛡️ "Cybersecurity First" Sidebar Assistant
* A subtle helper nestled in the sidebar that slides out periodically with rotating real-world security patches and vulnerability reminders.
* Automatically retreats into the pane after 5 seconds if ignored to prevent screen clutter.

---

## 🛠️ Tech Stack

* **Frontend**: React / TypeScript
* **Styling**: Tailwind CSS (Glassmorphism & Custom Keyframe Animations)
* **Data Layer**: Isolated TypeScript Array (`src/lib/ai-categories.ts`)
