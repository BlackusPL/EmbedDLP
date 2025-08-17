const path = require('path');
const outputDir = path.join(process.cwd(), 'output');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap();
const cleanExpiredFiles = require('../CleanExpiredFiles');

module.exports = async (req, res) => {
    cleanExpiredFiles();
    const url = req.query.q;
    const mtype = req.query.mt;
    if (!url) {
        return res.status(400).json({ error: 'Brak adresu URL w zapytaniu' });
    }
    try {
        const expirationPath = path.join(process.cwd(), '/src/files_expiration.json');
        let data = {};
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        var ext = '.mp3';
        var headext = 'audio/mpeg';
        var ytargs = [
            url,
            '--embed-thumbnail',
            '--no-check-certificate',
            '--no-playlist',
            '--extract-audio',
            '--audio-format',
            'mp3',
            '--embed-metadata',
            '-o',
        ];
        switch (mtype) {
            case 'audio':
                var ext = '.mp3';
                var headext = 'audio/mpeg';
                var ytargs = [
                    url,
                    '--embed-thumbnail',
                    '--no-check-certificate',
                    '--no-playlist',
                    '--extract-audio',
                    '--audio-format',
                    'mp3',
                    '--embed-metadata',
                    '-o',
                ];
                break;
            case 'video':
                var ext = '.mp4';
                var headext = 'video/mp4';
                var ytargs = [
                    url,
                    '--no-check-certificate',
                    '--no-playlist',
                    '--format',
                    'bestvideo[ext=webm]+bestaudio[ext=webm]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=webm]/best[ext=mp4]/bestvideo+bestaudio/best',
                    '--embed-thumbnail',
                    '--embed-metadata',
                    '--remux-video', 'mp4',
                    '-o',
                ];
                break;
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
                meta.expiration = (Date.now() + 5 * 6e4).toString();
                meta.created_at = meta.created_at || Date.now().toString();
                data[fileName] = meta;
                fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
                return res.sendFile(path.join(outputDir, fileName), {headers: {'Content-Type': headext}});
            }
        }
        let metadata = await ytDlpWrap.getVideoInfo(url);
        const fileName = metadata.id + ext;
        const filePath = path.join(outputDir, fileName);
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        let stdout = await ytDlpWrap.execPromise(ytargs.concat(filePath));
        // Zapisz nowy wpis do JSON
        data[fileName] = {
            created_at: Date.now().toString(),
            expiration: (Date.now() + 5 * 6e4).toString(), //60_000
            source_urls: [url]
        };
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        res.sendFile(filePath, {headers: {'Content-Type': headext}});
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania' });
    }
}