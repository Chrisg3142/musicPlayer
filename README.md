# Music Player Project

## Requirements for project to run properly

- This project will run normally with the songs already provided in the folders.
- If you want to add your own songs to the queue using a YouTube link, you **must have `yt-dlp` installed**.
- The easiest way to install `yt-dlp` on macOS is via **Homebrew**.

---

## How to install Homebrew (macOS)

Open your Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

After installation verify with:
brew --version

<h1>How to set up and run this project</h1>
<h3>Clone this repository:</h3>
git clone https://github.com/Chrisg3142/musicPlayer.git
cd musicPlayer

<h3>Install Node.js dependencies:</h3>
npm install

<h3>If you are on macOS or Linux, make the install script executable:</h3>
chmod +x scripts/install-yt-dlp.sh

<h3>Start the server (this will attempt to install yt-dlp automatically):</h3>
npm start
