const fs = require('fs');
const css = fs.readFileSync('src/app/globals.css', 'utf8');

// remove @source lines
let newCss = css.replace(/@source.*?\n/g, '');

// extract the @theme block
const themeMatch = newCss.match(/@theme\s*{[\s\S]*?}/);
if (themeMatch) {
  const themeBlock = themeMatch[0];
  newCss = newCss.replace(themeBlock, '');
  
  // insert @theme right after @import "tailwindcss";
  newCss = newCss.replace(/@import\s+"tailwindcss";/, `@import "tailwindcss";\n\n${themeBlock}`);
}

fs.writeFileSync('src/app/globals.css', newCss);
console.log('Fixed globals.css');
