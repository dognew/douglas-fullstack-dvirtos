# Douglas Fiedler - Creative Technologist | Full Stack Developer | Computer Engineering Candidate

[🇧🇷 Versão em Português (LEIAME.md)](LEIAME.md)

## 🚀 The Vision

This project is a technical manifesto and living portfolio, architected as a fully interactive, web-based Operating System (D-VirtOS). It moves beyond static pages to demonstrate a robust, multi-layered system that simulates a complete OS lifecycle, from boot to a functional desktop environment.

The core objective is to provide a practical exhibition of advanced software engineering principles, including state machine management, full-stack architecture, and infrastructure containerization.

## 🏛️ System Architecture

D-VirtOS is modeled after a real-world operating system, with its functionality segmented into distinct architectural layers.

### Layer 0: Kernel & Hardware Abstraction
This foundational layer is managed by the backend and infrastructure, providing core services and a consistent environment.

*   **Kernel (Laravel API):** A Laravel 11 backend serves as the system's "kernel," exposing a high-performance JSON API. It handles core logic and provides data to the frontend, such as the simulated hardware specs served by the `/api/boot-specs` endpoint.
*   **Hardware (Docker):** The entire environment is orchestrated with Docker Compose, ensuring perfect parity between development and production. This containerization acts as the hardware abstraction layer, defining the virtual machine's components:
    *   `api`: The Laravel application container.
    *   `web`: The React frontend served via Node.js.
    *   `db`: A persistent MySQL 8.0 database for session and user data.
    *   `mailhog`: A service for intercepting and testing emails.

### Layer 1: The Boot Sequence
The frontend React application acts as a sophisticated state machine that guides the user through a simulated boot process.

*   **BIOS (Basic Input/Output System):** The `BiosScreen` component initiates the sequence, fetching and displaying simulated hardware specifications from the Laravel API. It listens for keyboard inputs (`DEL`, `F12`) to mimic entering setup or a boot menu.
*   **GRUB (Bootloader):** A dynamic bootloader screen that simulates device checks and prepares the system environment. It features a procedurally generated background using SVG filters for a unique aesthetic.
*   **Login Manager:** The `LoginScreen` component manages user authentication. It presents different access profiles (e.g., Recruiter, Developer) and uses the React Context API and `sessionStorage` to establish and persist a session state, effectively bridging the boot stage and the user desktop.

### Layer 2: The Desktop Environment
Upon successful "login," the user enters a multi-window graphical user interface. This environment is the main application shell, designed to present my portfolio, projects, and professional services in an immersive and interactive format.

## ✅ Implemented Features

*   **Full Boot Simulation:** Functional BIOS, GRUB, and Login screens with timed transitions.
*   **API-Driven Hardware Specs:** The BIOS screen dynamically fetches data from the Laravel backend.
*   **Profile-Based Access:** The login screen offers multiple user profiles that tailor the user experience.
*   **Session Management:** User session type is registered in the "system kernel" (React Context) and persisted in `sessionStorage`.
*   **Automatic Visitor Login:** A 30-second timer on the login screen defaults to a 'Visitor' session, ensuring accessibility.
*   **Containerized Environment:** Fully orchestrated with Docker for reliability and easy setup.

## 🛠️ Technical Stack

*   **Infrastructure:** **Docker Compose** orchestrating Node.js (v20), PHP (v8.3), MySQL (v8.0), and MailHog services.
*   **Backend:** **Laravel 11** configured as a stateless JSON API.
*   **Frontend:** **React 18+** with **TypeScript** and **Vite**. Leverages strict typing, React Hooks (`useState`, `useEffect`, `useContext`), and the Context API for robust state management.
*   **Styling:** **Tailwind CSS** for a utility-first styling approach, enabling rapid development of a custom and responsive UI.
*   **Database:** **MySQL 8.0** with a managed Docker volume for data persistence.

## 🚀 How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dognew/site-so.git
    cd site-so
    ```

2.  **Build and run the Docker containers:**
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the application:**
    Open your browser and navigate to `http://localhost:5173`.

The backend API will be available at `http://localhost:8000`.


## 🏗️ Project Architecture

D-VirtOS follows a strict layer-based architecture, mirroring the separation of concerns found in modern Unix-like operating systems.

### 📂 Filesystem Hierarchy & Layer Mapping

* **`/public/dvirtos/usr/share`**: Static assets following the **FHS (Filesystem Hierarchy Standard)**. Contains system themes, X11 cursors, and icons.
* **`src/kernel/`**: Core orchestration (**Layers 0-3**). Manages sessions, display servers (XServer), and window stacking.
* **`src/system/`**: The **D-VirtUI Toolkit**. Shared system libraries and reusable UI controls (The "DLLs" of the OS).
* **`src/shell/`**: **Layer 4** (Desktop Environment). Handles the Taskbar, Start Menu, and Desktop interaction logic.
* **`src/apps/`**: **Layer 5** (User Space). Virtual applications running within the system environment.

### 🌳 Project Structure

```text
frontend/
├── 📂 public/ (Static Assets Layer - FHS Style)
│   ├── 📂 dvirtos/
│   │   └── 📂 usr/
│   │       └── 📂 share/
│   │           ├── 📂 icons/
│   │           │   ├── 📂 dvirtos-cursors/
│   │           │   │   ├── 📂 cursors/ (left_ptr.svg, x-cursor.svg, etc.)
│   │           │   │   └── index.theme
│   │           │   └── 📂 dvirtos_logos/ (dvirtos-logo.svg)
│   │           └── 📂 themes/
│   │               └── 📂 dvirtos-default/ (cursor.css, window.css)
│   ├── 📂 icons/
│   │   └── 📂 os/ (biglinux.svg, debian.svg, linuxmint.svg)
│   ├── .htaccess
│   └── logo-dognew-white-gold.svg
│
├── 📂 src/ (System Source Code & Logic)
│   ├── 📂 assets/
│   │   ├── 📂 fonts/ (eightbit-atari-90.ttf)
│   │   └── react.svg
│   │
│   ├── 📂 components/
│   │   ├── 📂 boot/ (Layer 1: Boot Sequence - BIOS, GRUB, Login)
│   │   │   ├── 📂 bios/ (BiosSetup.tsx, ExitModal.tsx)
│   │   │   ├── 📂 grub/ (GrubBackground.tsx, GrubScreen.tsx)
│   │   │   ├── BiosScreen.tsx
│   │   │   ├── BootMenu.tsx
│   │   │   └── LoginScreen.tsx
│   │   │
│   │   ├── 📂 kernel/ (Layers 0-3: The System Engine)
│   │   │   ├── SessionManager.tsx
│   │   │   ├── WindowManager.tsx
│   │   │   └── XServer.tsx
│   │   │
│   │   ├── 📂 system/ (D-VirtUI Toolkit: Libraries & Shared)
│   │   │   ├── 📂 Window/
│   │   │   │   └── Window.tsx
│   │   │   ├── 📂 Controls/ (Future: SysButton.tsx, SysInput.tsx)
│   │   │   ├── 📂 Admin/ (Backdoor Tools & Inspection)
│   │   │   │   ├── AdminShell.tsx
│   │   │   │   └── SessionInspector.tsx
│   │   │   └── 📂 Shared/ (BootTimer.tsx)
│   │   │
│   │   ├── 📂 shell/ (Layer 4: Desktop Environment)
│   │   │   ├── 📂 taskbar/
│   │   │   │   └── 📂 applets/ (Battery, Clock, Network, Volume)
│   │   │   ├── 📂 desktop/ (DesktopIcon.tsx)
│   │   │   ├── StartMenu.tsx
│   │   │   └── DesktopShell.tsx
│   │   │
│   │   └── 📂 apps/ (Layer 5: User Space / Virtual Binaries)
│   │       ├── 📂 Terminal/ (TerminalTest.tsx)
│   │       ├── 📂 Settings/ (DesktopSettings.tsx)
│   │       └── 📂 Welcome/ (WelcomeApp.tsx)
│   │
│   ├── 📂 context/ (Global System State)
│   │   └── SessionContext.tsx
│   │
│   ├── 📂 hooks/ (Hardware & Interaction Abstractions)
│   │   ├── useAdminKeys.ts
│   │   ├── useHardware.ts
│   │   └── useWindowInteractions.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
└── 📂 dist/ (Optimized Production Build)
```

### 🧩 System Layers Responsibility Matrix

| Layer | Component | Responsibility |
| :--- | :--- | :--- |
| **0** | SessionManager | Global state orchestration, hardware simulation, and persistence. |
| **1** | XServer | Display server simulation, input masking, and stippled canvas. |
| **3** | WindowManager | Window lifecycle management, stacking (z-index), and geometry. |
| **4** | DesktopShell | UI shell environment, Taskbar, Start Menu, and Desktop Grid. |
| **5** | UserSpace | Final virtual applications (Terminal, Settings, Welcome App). |
