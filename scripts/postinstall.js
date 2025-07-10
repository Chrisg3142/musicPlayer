import { exec } from "child_process";
import os from "os";
import path from "path";

const platform = os.platform();

const runScript = (cmd) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing install script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(stdout);
  });
};

if (platform === "win32") {
  // Windows - run PowerShell script
  const psScript = path.resolve("./scripts/install-yt-dlp.ps1");
  runScript(`powershell -ExecutionPolicy Bypass -File "${psScript}"`);
} else if (platform === "darwin" || platform === "linux") {
  // macOS or Linux - run bash script
  const shScript = path.resolve("./scripts/install-yt-dlp.sh");
  runScript(`bash "${shScript}"`);
} else {
  console.warn("Unsupported OS for automatic yt-dlp installation. Please install manually.");
}
