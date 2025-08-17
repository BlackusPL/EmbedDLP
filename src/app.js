const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var cors = require('cors')
const port = 5001;
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
process.env.FFMPEG_PATH = ffmpegPath.path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath.path);
const spotify_downloader = require("./routes/spotify_downloader");
const audio = require("./routes/universal/audio");
const video = require("./routes/universal/video");
const universal = require("./routes/universal");

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
// https://darknessair.ovh/music?q=spotify:track:4cOdK2wGLETKBW3PvgPWqT

// Endpoint do obsługi formularza
app.post('/submit', require('../public/submit'));

// Spotdl API
//app.get('/music', require('./routes/spotify_downloader'));
app.use('/music', spotify_downloader);

// Ytdl API AUDIO
app.use('/universal/audio', audio);

// Ytdl API Video
app.use('/universal/video', video);

// YTDLP API 2IN1
app.use('/universal', universal);

// Middleware do obsługi parametrów URL
app.get('/display', require('../public/display'));

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na http://blackuspl.local:${port}`);
});
