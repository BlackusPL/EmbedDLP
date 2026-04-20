import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import YTDlpWrapModule from "yt-dlp-wrap";
const YTDlpWrap = YTDlpWrapModule.default,
  ytDlpWrap = new YTDlpWrap(),
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
    let data = {}, ext, headext, ytargs;
    if (fs.existsSync(expirationPath)) {
      data = JSON.parse(fs.readFileSync(expirationPath, "utf8"));
    }
    switch (mtype) {
      default: {
        ext = ".mp3";
        headext = "audio/mpeg";
        ytargs = [
          url,
          "-f",
          "ba",
          "--embed-thumbnail",
          "--no-check-certificate",
          "--no-playlist",
          "--extract-audio",
          "--audio-format",
          "mp3",
          "--embed-metadata",
        ];
        break;
      }
      case "0" && "false": {
        ext = ".mp3";
        headext = "audio/mpeg";
        ytargs = [
          url,
          "-f",
          "ba",
          "--embed-thumbnail",
          "--no-check-certificate",
          "--no-playlist",
          "--extract-audio",
          "--audio-format",
          "mp3",
          "--embed-metadata",
        ];
        break;
      }
      case "1" && "true": {
        ext = ".mp4";
        headext = "video/mp4";
        ytargs = [
          url,
          "-f",
          "bv",
          "--no-check-certificate",
          "--no-playlist",
          "--format",
          "bestvideo[ext=webm]+bestaudio[ext=webm]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=webm]/best[ext=mp4]/bestvideo+bestaudio/best",
          "--embed-thumbnail",
          "--embed-metadata",
          "--remux-video",
          "mp4",
          //'-o',
        ];
        break;
      }
    }
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
    const metadata = await ytDlpWrap.getVideoInfo(ytargs), // Maybe use https://youtube-api.spiralp.xyz/video/8hooLs0Hfic for title and timelaps
      fileName = metadata.id + ext,
      filePath = path.join(outputDir, fileName);
    if (fs.existsSync(expirationPath)) {
      data = JSON.parse(fs.readFileSync(expirationPath, "utf8"));
    }
    await ytDlpWrap.execPromise(ytargs.concat(["-o", filePath]));
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
    console.log(i18n.__("download_error", error.toString()));
    return errorHandler(error, res);
  }
};