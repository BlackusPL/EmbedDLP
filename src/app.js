import express from 'express';
import process from "node:process";
import cors from 'cors';
import "dotenv/config";
//import { fileURLToPath } from 'node:url';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import spotify_downloader from './routes/spotify_downloader.js';
import universal from './routes/universal.js';
import submit from '../public/submit.js';
import home from '../public/index.js';
import i18n from './LanguageConfig.js';

const app = express(),
    port = process.env.PORT || 5001;
app.use(express.urlencoded({ extended: true }));
ffmpeg.setFfmpegPath(ffmpegPath.path);
process.env.FFMPEG_PATH = ffmpegPath.path;

app.use(cors());

// app.get('/', (_req, res) => {
//     res.sendFile(path.join(fileURLToPath(import.meta.url), '../../public/index.html'));
// });
app.get('/', home);
// https://darknessair.ovh/music?q=spotify:track:4cOdK2wGLETKBW3PvgPWqT

// Endpoint do obsługi formularza
app.post('/submit', submit);

// Spotdl API
//app.get('/music', require('./routes/spotify_downloader'));
app.use('/music', spotify_downloader);

// YTDLP API 2IN1
app.use('/universal', universal);

// Uruchomienie serwera
app.listen(port, () => {
    console.log(i18n.__('server_running', port));
});
