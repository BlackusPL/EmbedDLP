import path from 'node:path';
import process from "node:process";
import fs from 'node:fs';

const outputDir = path.join(process.cwd(), 'output');
const expirationPath = path.join(outputDir, 'files_expiration.json');

export default function cleanExpiredFiles() {
    let data;
    try {
        if (!fs.existsSync(expirationPath)) {
            return;
        }
        const fileContent = fs.readFileSync(expirationPath, 'utf8');
        if (!fileContent.trim()) {
            return;
        }
        data = JSON.parse(fileContent);
    } catch (e) {
        return console.error(e); 
    }
    const now = Date.now();
    let changed = false;

    const filenames = Object.keys(data);

    for (const filename of filenames) {
        const meta = data[filename];
        if (Number(meta.expiration) < now) {
            const filePath = path.join(outputDir, filename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch {
                    continue; 
                }
            }
            delete data[filename];
            changed = true;
        }
    }
    if (changed) {
        try {
            fs.writeFileSync(expirationPath, JSON.stringify(data, null, 4));
        } catch (writeErr) {
            console.error(writeErr);
        }
    }
}