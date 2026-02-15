import SpottyDL from 'spottydl';
import process from "node:process";
import path from 'node:path';
import fs from 'node:fs';
const outputDir = path.join(process.cwd(), 'output');

export default async (req, res) => {
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
            const track = await SpottyDL.downloadTrack(results, outputDir); // Second parameter is optional...
            console.log("To: " + track)
            res.sendFile(path.join(track[0].filename));
            }
        });
    } catch (error) {
        console.error('Błąd podczas pobierania:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania' });
    }
}