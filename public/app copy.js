const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var cors = require('cors')
const port = 5001;
const path = require('path');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
process.env.FFMPEG_PATH = ffmpegPath.path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath.path);

app.use(cors());
const outputDir = path.join(process.cwd(), 'output');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// https://darknessair.ovh/music?q=spotify:track:4cOdK2wGLETKBW3PvgPWqT

// Endpoint do obsługi formularza
app.post('/submit', require('../public/submit'));

// Spotdl API
// app.use('/output', express.static('output'));
app.get('/music', require('./public/spotify_downloader'));

// Funkcja czyszcząca wygasłe pliki
function cleanExpiredFiles() {
    const expirationPath = path.join(process.cwd(), 'files_expiration.json');
    let data;
    try {
        data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
    } catch (e) {
        return; // Brak pliku lub błąd odczytu
    }
    const now = Date.now();
    let changed = false;
    for (const [filename, meta] of Object.entries(data)) {
        if (Number(meta.expiration) < now) {
            const filePath = path.join(outputDir, filename);
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
            }
            delete data[filename];
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
    }
}

// Ytdl API AUDIO
app.get('/universal/audio', async (req, res) => {
    cleanExpiredFiles();
    const url = req.query.q;
    if (!url) {
        return res.status(400).json({ error: 'Brak adresu URL w zapytaniu' });
    }
    try {
        const expirationPath = path.join(process.cwd(), 'files_expiration.json');
        let data = {};
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        // Sprawdź, czy plik już istnieje dla podanego URL w source_urls
        for (const [fileName, meta] of Object.entries(data)) {
            if (meta.source_urls && meta.source_urls.includes(url) && fs.existsSync(path.join(outputDir, fileName)) && fileName.endsWith('.mp3')) {
                // Aktualizuj czas wygaśnięcia i dodaj url jeśli nie ma
                if (!meta.source_urls.includes(url)) meta.source_urls.push(url);
                meta.expiration = (Date.now() + 5 * 60_000).toString();
                meta.created_at = meta.created_at || Date.now().toString();
                data[fileName] = meta;
                fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
                return res.sendFile(path.join(outputDir, fileName), {headers: {'Content-Type': 'audio/mpeg'}});
            }
        }
        let metadata = await ytDlpWrap.getVideoInfo(url);
        const fileName = metadata.id + '.mp3';
        const filePath = path.join(outputDir, fileName);
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        let stdout = await ytDlpWrap.execPromise([
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
            expiration: (Date.now() + 5 * 60_000).toString(),
            source_urls: [url]
        };
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        res.sendFile(filePath, {headers: {'Content-Type': 'audio/mpeg'}});
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania' });
    }
});

// Ytdl API
app.get('/universal/video', async (req, res) => {
    cleanExpiredFiles();
    const url = req.query.q;
    if (!url) {
        return res.status(400).json({ error: 'Brak adresu URL w zapytaniu' });
    }
    try {
        const expirationPath = path.join(process.cwd(), 'files_expiration.json');
        let data = {};
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        // Sprawdź, czy plik już istnieje dla podanego URL w source_urls
        for (const [fileName, meta] of Object.entries(data)) {
            if (
                meta.source_urls &&
                meta.source_urls.includes(url) &&
                fs.existsSync(path.join(outputDir, fileName)) &&
                fileName.endsWith('.mp4')
            ) {
                // Aktualizuj czas wygaśnięcia i dodaj url jeśli nie ma
                if (!meta.source_urls.includes(url)) meta.source_urls.push(url);
                meta.expiration = (Date.now() + 5 * 60_000).toString();
                meta.created_at = meta.created_at || Date.now().toString();
                data[fileName] = meta;
                fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
                return res.sendFile(path.join(outputDir, fileName), {headers: {'Content-Type': 'video/mp4'}});
            }
        }
        let metadata = await ytDlpWrap.getVideoInfo(url);
        const fileName = metadata.id + '.mp4';
        const filePath = path.join(outputDir, fileName);
        if (fs.existsSync(expirationPath)) {
            data = JSON.parse(fs.readFileSync(expirationPath, 'utf8'));
        }
        let stdout = await ytDlpWrap.execPromise([
            url,
            '--no-check-certificate',
            '--no-playlist',
            '--format',
            'bestvideo[ext=webm]+bestaudio[ext=webm]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=webm]/best[ext=mp4]/bestvideo+bestaudio/best',
            '--embed-thumbnail',
            '--embed-metadata',
            '--remux-video', 'mp4',
            '-o',
            filePath,
        ]);
        // Zapisz nowy wpis do JSON
        data[fileName] = {
            created_at: Date.now().toString(),
            expiration: (Date.now() + 5 * 60_000).toString(),
            source_urls: [url]
        };
        fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        res.sendFile(filePath, {headers: {'Content-Type': 'video/mp4'}});
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania' });
    }
});

// Middleware do obsługi parametrów URL
app.get('/display', require('../public/display'));

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na http://blackuspl.local:${port}`);
});
