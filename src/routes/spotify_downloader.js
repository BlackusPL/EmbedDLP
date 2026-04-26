import process from "node:process";
import path from "node:path";
import fs from "node:fs";
import * as cheerio from "cheerio";
import { YtDlp } from "ytdlp-nodejs";
const ytdlp = new YtDlp({
  binaryPath: process.env.YT_DLP_PATH || "yt-dlp",
}),
  outputDir = path.join(process.cwd(), "output");
import cleanExpiredFiles from "../CleanExpiredFiles.js";
import errorHandler from "../errorHandler.js";
import i18n from "../LanguageConfig.js";

export default async (req, res) => {
  const url = req.query.q,
    ss = req.query.ss;
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
    // Sprawdź, czy plik już istnieje dla podanego URL w source_urls
    for (const [fileName, meta] of Object.entries(data)) {
      if (
        meta.source_urls &&
        meta.source_urls.includes(url+ "&ss=" + (ss ? ss : "1")) &&
        fs.existsSync(path.join(outputDir, fileName)) &&
        fileName.endsWith(".mp3")
      ) {
        // Aktualizuj czas wygaśnięcia i dodaj url jeśli nie ma
        const urlWithSS = url + "&ss=" + (ss ? ss : "1");
        if (!meta.source_urls.includes(urlWithSS)) meta.source_urls.push(urlWithSS);
        meta.expiration = (Date.now() + parseInt(process.env.EXPIRATION_TIME) * 1000).toString();
        meta.created_at = meta.created_at || Date.now().toString();
        data[fileName] = meta;
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        res.sendFile(fileName, {
          root: outputDir,
          headers: { "Content-Type": "audio/mpeg" },
        });
        return cleanExpiredFiles();
      }
    }
    const response = await fetch(url),
        request = await response.text(),
        $ = cheerio.load(request),
        title = $(".encore-text-title-medium").text().replaceAll(" ", "+"),
        author = $(".encore-text-title-medium + div a").text().replaceAll(" ", "+"),
        timestamp = $("div[class*=\"e-\"].encore-text-body-small:has(span) span:last-child").text().split(":").reduce((acc, time) => acc * 60 + parseInt(time), 0),
        filterDuration = (Number.isFinite(timestamp) && timestamp > 0) ? Math.floor(timestamp) + 60 : 600, // check if timestamp is NaN
        searchUrl = `https://music.youtube.com/search?q=[${author}+${title}]#songs`,
        metadata = await ytdlp.getInfoAsync(searchUrl),
        fileName = metadata.entries[ss ? ss - 1 : 0].title + ".mp3",
        filePath = path.join(outputDir);
    if (fs.existsSync(expirationPath)) {
      data = JSON.parse(fs.readFileSync(expirationPath, "utf8"));
    }
    await ytdlp
        .download(searchUrl)
        .addArgs("-I", ss ? ss : "1", "--no-check-certificate", "--no-playlist", "--match-filter", "duration <= " + filterDuration) // or rawArgs
        .filter('audioonly')
        .output(filePath)
        .format({ filter: 'audioonly', quality: 'ba', type: 'mp3' })
        .embedMetadata(true)
        .embedThumbnail(true)
        .run();
    // Zapisz nowy wpis do JSON
    data[fileName] = {
      created_at: Date.now().toString(),
      expiration: (Date.now() + parseInt(process.env.EXPIRATION_TIME) * 1000).toString(),
      source_urls: [url+"&ss="+(ss ? ss : "1")],
    };
    fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
    cleanExpiredFiles();
    return res.sendFile(fileName, {
      root: outputDir,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error(i18n.__("download_error", error.toString()));
    return errorHandler(error, res);
  }
};
