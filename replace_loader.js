const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        if (content.includes('Loader2')) {
            const lines = content.split('\n');
            let newLines = [];
            let addedImport = false;

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];

                if (line.includes('lucide-react') && line.includes('Loader2')) {
                    line = line.replace(/,\s*Loader2/, '').replace(/Loader2\s*,?/, '');
                    if (line.match(/import\s+{\s*}\s+from\s+['"]lucide-react['"];/)) {
                        // it's empty, we don't push it
                    } else {
                        newLines.push(line);
                    }
                    if (!addedImport) {
                        const importLine = 'import { LoadingLogo } from "@/components/shared/LoadingLogo";';
                        // Insert after the current line or as a replacement if we skipped
                        newLines.push(importLine);
                        addedImport = true;
                    }
                } else {
                    if (line.includes('Loader2')) {
                        if (line.includes('<Loader2')) {
                            line = line.replace(/<Loader2/g, '<LoadingLogo').replace(/animate-spin/g, 'animate-pulse');
                        }
                        if (line.includes('</Loader2>')) {
                            line = line.replace(/<\/Loader2>/g, '</LoadingLogo>');
                        }
                    }
                    newLines.push(line);
                }
            }
            content = newLines.join('\n');

            // Also check for multiline imports of Loader2
            if (!addedImport && content.includes('Loader2')) {
                // Maybe it was imported but not replaced because it was multiline
                content = content.replace(/Loader2,/g, '').replace(/,\s*Loader2/g, '');
                content = `import { LoadingLogo } from "@/components/shared/LoadingLogo";\n` + content;
                content = content.replace(/<Loader2/g, '<LoadingLogo').replace(/animate-spin/g, 'animate-pulse');
                content = content.replace(/<\/Loader2>/g, '</LoadingLogo>');
            }
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated ' + filePath);
        }
    } catch (e) {
        console.error('Error processing ' + filePath + ': ' + e.message);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                    walkDir(fullPath);
                }
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                processFile(fullPath);
            }
        } catch (e) { }
    }
}

walkDir('c:/Users/acolq/Documents/web/encomiendas/kolmox-front/src');
console.log('Done');
