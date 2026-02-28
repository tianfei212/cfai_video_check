import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const zhMap = {};
const chineseRegex = /[\u4e00-\u9fa5]+/g;

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'scripts') {
        walk(filePath);
      }
    } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx'))) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(chineseRegex);
      if (matches) {
        for (const match of matches) {
          if (!zhMap[match]) {
            zhMap[match] = match;
          }
        }
      }
    }
  }
}

walk(rootDir);

const zhPath = path.resolve(rootDir, 'locales', 'zh.json');
fs.writeFileSync(zhPath, JSON.stringify(zhMap, null, 2), 'utf-8');
console.log(`Extracted ${Object.keys(zhMap).length} unique Chinese strings to ${zhPath}`);
