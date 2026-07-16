# Modern Full-Stack Weather Web Application

A beautiful, reactive full-stack Weather Application featuring dynamic weather theme cards, visual metrics, local/international country and state weather selection, and interactive climate-reactive gradients. Powered by **React 19**, **Vite 6**, **Tailwind CSS v4**, and **Express 4**.

This repository is fully optimized to be opened, configured, run, and debugged inside **Visual Studio Code (VS Code)**.

---

## 🛠️ Prerequisites

Before running the application locally on your computer, ensure you have the following installed:

1. **Node.js**: [Download and Install Node.js](https://nodejs.org/) (Version `18.x`, `20.x`, or higher is recommended).
2. **Visual Studio Code**: [Download and Install VS Code](https://code.visualstudio.com/).

### Recommended VS Code Extensions
To get the best experience, open VS Code and install these popular extensions from the Marketplace:
* **Tailwind CSS IntelliSense** (by Tailwind Labs) – For autocomplete and highlighting of CSS utility classes.
* **Prettier - Code formatter** (by Prettier) – For automatic, beautiful code formatting.
* **TypeScript Nightly** (by Microsoft) or default TS support – For pristine type verification.

---

## 🚀 Quick Start (Running in VS Code)

Follow these steps to set up and run the application on your local machine:

### Step 1: Open the Project in VS Code
1. Download or extract the project files to a folder on your computer.
2. Launch VS Code.
3. Go to `File > Open Folder...` (or `Cmd+O` / `Ctrl+O`) and select the project root folder.

### Step 2: Configure Environment Variables
The application uses a secure server-side API proxy to keep your API keys safe.
1. In the VS Code file explorer (left panel), find `.env.example`.
2. Duplicate or rename `.env.example` to `.env` in the root directory.
3. Open the newly created `.env` file and replace the placeholder with your **OpenWeatherMap API Key**:
   ```env
   OPENWEATHER_API_KEY="712ffaa5e4cbf434203f2402e54f6b7d"
   ```
   *Note: `.env` is already configured in `.gitignore` so your secret API keys will never be leaked or committed to GitHub.*

### Step 3: Install Dependencies
1. Open the integrated terminal in VS Code:
   * Go to the top menu: `Terminal > New Terminal` (or press ``Ctrl+` ``).
2. Install the necessary node modules by running:
   ```bash
   npm install
   ```

> [!TIP]
> **Windows/PowerShell Error?** If you get an error saying `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system`, please see the [Troubleshooting](#-troubleshooting-windowspowershell-script-error) section below!

### Step 4: Run the Development Server
Start the development environment by executing:
```bash
npm run dev
```
Once the command finishes loading:
1. Open your browser of choice.
2. Navigate to **`http://localhost:3000`**.
3. You can now search for any city, filter by Country, or filter by State/Province to explore weather metrics in real-time!

---

## 🏗️ Production Build and Start

To build and run a fully optimized production build locally:

1. Compile the client-side files and bundle the backend code:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```
3. Open your browser and navigate to `http://localhost:3000`.

---

## 🐞 Debugging in VS Code

We have pre-configured native VS Code debugger profiles inside `.vscode/launch.json` so you can set breakpoints in `server.ts` or `src/App.tsx` and step through your code!

### How to use Debug Mode:
1. Go to the **Run and Debug** view in the VS Code sidebar (or press `Ctrl+Shift+D` / `Cmd+Shift+D`).
2. Select **"Launch Weather App"** from the dropdown menu at the top.
3. Press the green **Play (F5)** button.
4. VS Code will automatically start your development server and attach a debugger, allowing you to debug with ease.

---

## 📁 Project Structure

* **`server.ts`**: The full-stack Express API proxy server. It securely handles weather requests and passes them to OpenWeatherMap.
* **`src/App.tsx`**: The main React single-screen user interface, containing state managers, real-time metrics, dynamic reactive backgrounds, and interactive filters.
* **`src/countriesData.ts`**: Contains structured country and state/province data lists, as well as state-specific popular suggested cities.
* **`vite.config.ts`**: The Vite bundler configuration utilizing Tailwind CSS v4 and React.
* **`.env`**: Local environment variables (created by you from `.env.example`).

---

## 🛠️ Troubleshooting (Windows/PowerShell Script Error)

On Windows, PowerShell restricts the execution of script files (like `npm.ps1`) by default. If you see this error:
```text
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

You can solve it using any of these 3 easy methods:

### Method 1: Switch to Command Prompt (Recommended & Easiest)
You do not need to change any Windows settings! Just switch your terminal from PowerShell to CMD:
1. In the VS Code terminal window, look at the top-right corner of the terminal pane.
2. Click the dropdown menu arrow next to the `+` icon (usually says `pwsh` or `powershell`).
3. Select **Command Prompt** (or `cmd`).
4. Run your command:
   ```cmd
   npm install
   ```

### Method 2: Bypass Execution Policy temporarily (Quickest)
Run this command directly in your current PowerShell terminal to bypass the restriction for this VS Code session only:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```
After running the above command, run `npm install` and it will work immediately.

### Method 3: Change your Windows Execution Policy permanently
If you want to permanently allow scripts like `npm` to run under your user profile:
1. Search for **PowerShell** in your Windows Start Menu.
2. Right-click on **Windows PowerShell** and select **Run as Administrator**.
3. Run the following command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Press `Y` and hit `Enter` when prompted.
5. Restart VS Code and you can now run any `npm` command in any terminal!

