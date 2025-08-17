const SpottyDL = require('spottydl');
const path = require('path');
const outputDir = path.join(process.cwd(), 'output');
const fs = require('fs');

module.exports = async (req, res) => {
    const url = req.query.q;
    if (!url) {
        return res.status(400).json({ error: 'Brak adresu URL w zapytaniu' });
    }
    try {
        await SpottyDL.getTrack(url)
        .then(async(results) => {
            const filePath = path.join(outputDir, results.title + ".mp3");
            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            } else {
            let track = await SpottyDL.downloadTrack(results, outputDir); // Second parameter is optional...
            console.log(track)
            res.sendFile(path.join(track[0].filename));
            }
        });
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania' });
    }
}