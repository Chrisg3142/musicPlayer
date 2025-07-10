import express from "express";
import cors from "cors";
import path from "path";
import { exec } from "child_process";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Static files
app.use(express.static("public"));
app.use("/audios", express.static(path.join(__dirname, "audios")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.post("/api/add-song", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  // Command to get JSON metadata (title, uploader, etc)
  const getMetaCmd = `yt-dlp --print-json --skip-download "${url}"`;

  exec(getMetaCmd, (err, stdout, stderr) => {
    if (err || !stdout.trim()) {
      console.error("Metadata fetch failed:", stderr);
      return res.status(500).json({ error: "Could not get metadata" });
    }

    let meta;
    try {
      meta = JSON.parse(stdout);
    } catch (e) {
      console.error("JSON parse error:", e);
      return res.status(500).json({ error: "Failed to parse metadata" });
    }

    const rawTitle = meta.title || "Unknown Title";
    const uploader = meta.uploader || "Unknown Artist";

    // Clean filename for filesystem
    const title = rawTitle.replace(/[\/\\?%*:|"<>]/g, "");
    const fileName = `${title}.mp3`;
    const fullFilePath = path.join(__dirname, "audios", fileName);

    // Check for duplicate file
    if (fs.existsSync(fullFilePath)) {
      console.log(`Duplicate found for title: ${fileName}`);
      return res.json({ filename: fileName, author: uploader });
    }

    // Download audio command
    const outputTemplate = path.join(__dirname, "audios", "%(title)s.%(ext)s");
    const downloadCmd = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" "${url}"`;

    exec(downloadCmd, (err, stdout, stderr) => {
      if (err) {
        console.error("yt-dlp error:", stderr);
        return res.status(500).json({ error: "Failed to download audio" });
      }

      console.log("yt-dlp output:", stdout);

      // Try to find downloaded file path from yt-dlp output
      const titleMatch = stdout.match(/Destination: (.+\.mp3)/);
      if (!titleMatch) {
        console.error("Could not find downloaded file in yt-dlp output");
        return res.status(500).json({ error: "Could not get downloaded filename" });
      }

      const downloadedFullPath = titleMatch[1];
      const downloadedFileName = path.basename(downloadedFullPath);

      res.json({ filename: downloadedFileName, author: uploader });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
