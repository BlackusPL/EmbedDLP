const path = require('node:path');
const process = require("node:process");
const outputDir = path.join(process.cwd(), 'output');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap();
const cleanExpiredFiles = require('../../CleanExpiredFiles.js');

export default async (req, res) => {
    cleanExpiredFiles();
    const url = req.query.q;
    if (!url) {
        return res.status(400).json({ error: 'Brak adresu URL w zapytaniu' });
    }
    try {
        const expirationPath = path.join(process.cwd(), '/src/files_expiration.json');
        let data = {};
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        // Sprawdź, czy plik już istnieje dla podanego URL w source_urls
        for (const [fileName, meta] of Object.entries(data)) {
            if (meta.source_urls && meta.source_urls.includes(url) && fs.existsSync(path.join(outputDir, fileName)) && fileName.endsWith('.mp3')) {
                // Aktualizuj czas wygaśnięcia i dodaj url jeśli nie ma
                if (!meta.source_urls.includes(url)) meta.source_urls.push(url);
                meta.expiration = (Date.now() + 5 * 6e4).toString();
                meta.created_at = meta.created_at || Date.now().toString();
                data[fileName] = meta;
                fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
                return res.sendFile(path.join(outputDir, fileName), {headers: {'Content-Type': 'audio/mpeg'}});
            }
        }
        const metadata = await ytDlpWrap.getVideoInfo(url);
        const fileName = metadata.id + '.mp3';
        const filePath = path.join(outputDir, fileName);
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        await ytDlpWrap.execPromise([
            url,
            '--embed-thumbnail',
            '--no-check-certificate',
            '--no-playlist',
            '--extract-audio',
            '--audio-format',
            'mp3',
            '--embed-metadata',
            '-o',
            filePath,
        ]);
        // Zapisz nowy wpis do JSON
        data[fileName] = {
            created_at: Date.now().toString(),
            expiration: (Date.now() + 5 * 6e4).toString(),
            source_urls: [url]
        };
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        return res.sendFile(filePath, {headers: {'Content-Type': 'audio/mpeg'}});
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
        return res.status(500).json({ error: 'Wystąpił błąd podczas pobierania' });
    }
}