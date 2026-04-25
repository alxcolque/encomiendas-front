const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Remove import
      content = content.replace(/import\s*\{\s*LoadingLogo\s*\}\s*from\s*['"]@\/components\/shared\/LoadingLogo['"];?\r?\n?/g, '');

      // Replace <LoadingLogo section />
      content = content.replace(/<LoadingLogo\s+section\s*\/?>(<\/LoadingLogo>)?/g, '<div className="loading-logo-section"></div>');

      // Replace <LoadingLogo fullScreen />
      content = content.replace(/<LoadingLogo\s+fullScreen\s*\/?>(<\/LoadingLogo>)?/g, '<div className="loading-logo-full"></div>');

      // Replace <LoadingLogo className="mx-auto" />
      content = content.replace(/<LoadingLogo\s+className=(['"])(.*?)\1\s*\/?>(<\/LoadingLogo>)?/g, '<div className={`loading-logo ${"$2"}`}></div>');

      // Replace <LoadingLogo />
      content = content.replace(/<LoadingLogo\s*\/?>(<\/LoadingLogo>)?/g, '<div className="loading-logo"></div>');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(srcDir);
