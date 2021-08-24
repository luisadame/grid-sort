import fs from 'node:fs';
import path from 'node:path';

async function writeReadme(file: string) {
    fs.writeFileSync(path.join('.', 'readme.md'), file);
}

async function removeImages(file: string) {
    const lines = file.split('\n');

    lines.forEach((line, index, array) => {
        if (line.includes('<img') && line.includes('/static/')) {
            if (array[index - 1]?.includes('div') && array[index + 1]?.includes('div')) {
                array.splice(index - 1, 3);
            } else {
                array.splice(index, 1);
            }
        }
    });

    return lines.join('\n');
}

async function getReadme() {
    return fs.readFileSync(path.join('.github', 'readme.md'), 'utf-8');
}

async function buildReadme() {
    const readme = await getReadme();
    const optimizedReadme = await removeImages(readme);
    writeReadme(optimizedReadme);
}

buildReadme();
