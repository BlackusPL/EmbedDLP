import process from "node:process";
import path from "node:path";
import fs from "node:fs";
import * as cheerio from "cheerio";
import YTDlpWrapModule from "yt-dlp-wrap";
const YTDlpWrap = YTDlpWrapModule.default,
  ytDlpWrap = new YTDlpWrap(),
  outputDir = path.join(process.cwd(), "output");
import cleanExpiredFiles from "../../src/CleanExpiredFiles.js";
import errorHandler from "../errorHandler.js";

export default async (req, res) => {
  const url = req.query.q,
    ss = req.query.ss;
  if (!url) {
    return res.status(400).json({ error: "Brak adresu URL w zapytaniu" });
  }
  try {
    const expirationPath = path.join(
      process.cwd(),
      "/src/files_expiration.json",
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
        meta.expiration = (Date.now() + 5 * 6e4).toString();
        meta.created_at = meta.created_at || Date.now().toString();
        data[fileName] = meta;
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        res.sendFile(path.join(outputDir, fileName), {
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
        ytargs = [
            "-I",
            ss ? ss : "1",
            `https://music.youtube.com/search?q=[${author}+${title}]#songs`,
            "--match-filter",
            "duration <= 300",
            "-f",
            "ba",
            "--embed-thumbnail",
            "--no-check-certificate",
            "--no-playlist",
            "--extract-audio",
            "--audio-format",
            "mp3",
            "--embed-metadata",
        ],
        metadata = await ytDlpWrap.getVideoInfo(ytargs),
            fileName = metadata.id + ".mp3",
            filePath = path.join(outputDir, fileName);
    if (fs.existsSync(expirationPath)) {
      data = JSON.parse(fs.readFileSync(expirationPath, "utf8"));
    }
    await ytDlpWrap.execPromise(ytargs.concat(["-o", filePath]));
    // Zapisz nowy wpis do JSON
    data[fileName] = {
      created_at: Date.now().toString(),
      expiration: (Date.now() + 5 * 6e4).toString(), //60_000
      source_urls: [url+"&ss="+(ss ? ss : "1")],
    };
    fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
    return res.sendFile(filePath, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania:", error);
    return errorHandler(error, res);
  }
};
