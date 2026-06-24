const fs = require('fs');
const path = require('path');

const directoriesToSearch = [
  path.join(__dirname, 'src/components/admin'),
  path.join(__dirname, 'src/app/[domain]/admin')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace heavy focus rings with small, consistent, light gray ones
  content = content.replace(/focus:ring-2 focus:ring-brand-500 focus:border-brand-500/g, 'focus:ring-1 focus:ring-gray-300 focus:border-gray-300');
  content = content.replace(/focus:ring-brand-500 focus:border-brand-500/g, 'focus:ring-1 focus:ring-gray-300 focus:border-gray-300');
  content = content.replace(/focus:ring-2 focus:ring-gray-900 focus:ring-offset-1/g, 'focus:ring-1 focus:ring-gray-300 focus:border-gray-300');
  content = content.replace(/focus:ring-1 focus:ring-gray-900 focus:border-gray-900/g, 'focus:ring-1 focus:ring-gray-300 focus:border-gray-300');
  content = content.replace(/focus:ring-gray-900 focus:border-gray-900/g, 'focus:ring-1 focus:ring-gray-300 focus:border-gray-300');
  content = content.replace(/focus:ring-gray-900/g, 'focus:ring-gray-300 focus:border-gray-300');

  // Additional check for checkout settings which might have a different combination
  content = content.replace(/focus:ring-2 focus:ring-brand-500/g, 'focus:ring-1 focus:ring-gray-300');

  // The user also complained about the strong border, so let's tone down the base borders on inputs
  content = content.replace(/border-2 border-gray-300/g, 'border border-gray-300');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

directoriesToSearch.forEach(dir => traverseDirectory(dir));
console.log('Done!');
