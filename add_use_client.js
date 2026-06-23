const fs = require('fs');
const path = './src/components/admin/';
fs.readdirSync(path).forEach(f => {
  if (f.endsWith('.tsx')) {
    const content = fs.readFileSync(path + f, 'utf8');
    if (!content.startsWith('"use client"') && !content.startsWith('\'use client\'')) {
      fs.writeFileSync(path + f, '"use client";\n' + content);
    }
  }
});
