import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import { YtDlp } from "ytdlp-nodejs";
const ytdlp = new YtDlp({
  binaryPath: process.env.YT_DLP_PATH || "yt-dlp",
}),
  outputDir = path.join(process.cwd(), "output");
import cleanExpiredFiles from "../CleanExpiredFiles.js";
import errorHandler from "../errorHandler.js";
import i18n from "../LanguageConfig.js";

export default async (req, res) => {
  const url = req.query.q, mtype = req.query.video;
  if (!url) {
    return res.status(400).json({ error: i18n.__("no_url") });
  }
  try {
    const expirationPath = path.join(
      process.cwd(),
      "/output/files_expiration.json",
    );
    let data = {};
    if (fs.existsSync(expirationPath)) {
      data = JSON.parse(fs.readFileSync(expirationPath, "utf8"));
    }
    
    // Determine target format
    const isVideo = mtype === "1" || mtype === "true",
    ext = isVideo ? ".mp4" : ".mp3",
    headext = isVideo ? "video/mp4" : "audio/mpeg";

    // Sprawdź, czy plik już istnieje dla podanego URL w source_urls
    for (const [fileName, meta] of Object.entries(data)) {
      if (
        meta.source_urls &&
        meta.source_urls.includes(url) &&
        fs.existsSync(path.join(outputDir, fileName)) &&
        fileName.endsWith(ext)
      ) {
        // Aktualizuj czas wygaśnięcia i dodaj url jeśli nie ma
        if (!meta.source_urls.includes(url)) meta.source_urls.push(url);
        meta.expiration = (Date.now() + parseInt(process.env.EXPIRATION_TIME) * 1000).toString();
        meta.created_at = meta.created_at || Date.now().toString();
        data[fileName] = meta;
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        res.sendFile(fileName, {
          root: outputDir,
          headers: { "Content-Type": headext },
        });
        return cleanExpiredFiles();
      }
    }
    const metadata = await ytdlp.getInfoAsync(url),
      prefileName = await metadata.requested_downloads[0].filename,
      fileName = prefileName.replace(/(.*)\s* \[.*?\]\.(.*)$/g, "$1" + ext),
      filePath = path.join(outputDir);
      //fs.writeFileSync("test.json", JSON.stringify(metadata, null, 4));
    if (fs.existsSync(expirationPath)) {
      data = JSON.parse(fs.readFileSync(expirationPath, "utf8"));
    }
    
    let download = ytdlp.download(url).output(filePath); // .output(path.join(outputDir, '%(id)s.%(ext)s'))
    if (isVideo) {
      download = download.format({ filter: 'bv' }).addArgs("--no-check-certificate", "--no-playlist", "--format", "bestvideo[ext=webm]+bestaudio[ext=webm]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=webm]/best[ext=mp4]/bestvideo+bestaudio/best", "--remux-video", "mp4")?.embedMetadata(true)?.embedThumbnail(true);
    } else {
      download = download.format({ filter: 'ba' }).addArgs("--no-check-certificate", "--no-playlist", "-x", "--audio-format", "mp3")?.embedMetadata(true)?.embedThumbnail(true);
    }
    await download.run();

    // Zapisz nowy wpis do JSON
    data[fileName] = {
      created_at: Date.now().toString(),
      expiration: (Date.now() + parseInt(process.env.EXPIRATION_TIME) * 1000).toString(),
      source_urls: [url],
    };
    fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
    cleanExpiredFiles();
    return res.sendFile(fileName, { root: outputDir, headers: { "Content-Type": headext } });
  } catch (error) {
    console.error(i18n.__("download_error", error.toString()));
    return errorHandler(error, res);
  }
};