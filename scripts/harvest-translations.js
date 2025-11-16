/**
 * Translation harvesting script
 * Extracts i18n.t() and t() calls from codebase and generates translation files
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Pattern to match translation calls
const translationPattern = /(?:i18n\.t|t)\(['"]([^'"]+)['"]/g;

const translations = new Map();

/**
 * Recursively find all TypeScript files
 */
function findTsFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('dist')) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract translations from a file
 */
function extractTranslations(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    let match;

    while ((match = translationPattern.exec(content)) !== null) {
      const key = match[1];
      // Use key as default English value
      translations.set(key, key);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
}

/**
 * Generate translation JSON
 */
function generateTranslationFile(locale, translationsMap) {
  const translationsObj = {};
  translationsMap.forEach((value, key) => {
    const keys = key.split('.');
    let current = translationsObj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  });

  return {
    [locale]: {
      translation: translationsObj,
    },
  };
}

// Main execution
const srcDir = join(rootDir, 'src');
const tsFiles = findTsFiles(srcDir);

console.log(`Scanning ${tsFiles.length} TypeScript files...`);

tsFiles.forEach((file) => {
  extractTranslations(file);
});

console.log(`Found ${translations.size} translation keys`);

// Generate English translation file
const enTranslations = generateTranslationFile('en', translations);
const localesDir = join(rootDir, 'src', 'shared', 'locales');

// Ensure locales directory exists
try {
  writeFileSync(
    join(localesDir, 'en.json'),
    JSON.stringify(enTranslations, null, 2) + '\n',
    'utf-8'
  );
  console.log('Generated src/shared/locales/en.json');
} catch (error) {
  console.error('Error writing translation file:', error);
}

