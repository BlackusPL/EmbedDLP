const path = require('path');
const fs = require('fs');
const outputDir = path.join(process.cwd(), 'output');

// Funkcja czyszcząca wygasłe pliki
module.exports = function cleanExpiredFiles() {
    const expirationPath = path.join(process.cwd(), '/src/files_expiration.json');
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