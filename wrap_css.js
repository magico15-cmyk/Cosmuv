const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Find the start of the unlayered CSS (after :root block)
const rootEndIdx = css.indexOf('}', css.indexOf(':root'));

if (rootEndIdx !== -1) {
    const before = css.substring(0, rootEndIdx + 1);
    const after = css.substring(rootEndIdx + 1);
    
    // Wrap the rest of the file in @layer components
    const newCss = `${before}\n\n@layer components {\n${after}\n}`;
    fs.writeFileSync('src/app/globals.css', newCss);
    console.log("Successfully wrapped legacy CSS in @layer components");
} else {
    console.log("Could not find :root block end");
}
