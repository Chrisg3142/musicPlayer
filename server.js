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

//getting access to other files 
app.use(express.static("public"));
app.use("/audios", express.static(path.join(__dirname, "audios")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//download and save the mp3 file from the youtube link 
app.post("/api/add-song", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  //grabbing the songs title 
  const getTitleCmd = `yt-dlp --get-title "${url}"`;

  //executing command in terminal from server to get file name to check for duplicates first before downloading file
  exec(getTitleCmd, (err, stdout, stderr) => {
    if (err || !stdout.trim()) {
      console.error("Title fetch failed:", stderr); //error handler 
      return res.status(500).json({ error: "Could not get title" });
    }

    //trimming and removing uncessary characters
    const title = stdout.trim().replace(/[\/\\?%*:|"<>]/g, "");
    const fileName = `${title}.mp3`; //sertting file name to add to audios folder
    const fullFilePath = path.join(__dirname, "audios", fileName); //getting the path for the folder and setting it to variable

    //checks for any files with the same name and just returns the files name 
    //can be bad for songs that have the same titles but different artists, look into that
    if (fs.existsSync(fullFilePath)) {
      console.log(`Duplicate found: ${fileName}`);
      return res.json({ fileName });
    }

    //setting up the file path and the command to download the audio
    const outputTemplate = path.join(__dirname, "audios", "%(title)s.%(ext)s");
    const downloadCmd = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" "${url}"`;

    //executing the download command not like the other exec that only grabbed the title to check for duplicates
    //this section takes the audio and downloads it and puts the audio in the audios folder 
    exec(downloadCmd, (err, stdout, stderr) => {
      if (err) {
        console.error("yt-dlp error:", stderr); //error handling 
        return res.status(500).json({ error: "Failed to download audio" });
      }

      console.log("yt-dlp output:", stdout);

      //error handling and  
      const titleMatch = stdout.match(/Destination: (.+\.mp3)/);
      if (!titleMatch) {
        console.error("Could not find downloaded file in yt-dlp output");
        return res.status(500).json({ error: "Could not get downloaded filename" });
      }


      const downloadedFullPath = titleMatch[1];
      const downloadedFileName = path.basename(downloadedFullPath);

      res.json({ filename: downloadedFileName });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
