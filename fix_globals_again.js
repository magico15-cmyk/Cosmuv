const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// The replacement chunk messed up and removed theme values and some root variables!
// Let me just recreate the top of the file cleanly.
const cssTop = `@import "tailwindcss";

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-brand-50: #FFFBEB;
  --color-brand-100: #FEF3C7;
  --color-brand-200: #FDE68A;
  --color-brand-300: #FCD34D;
  --color-brand-400: #FBBF24;
  --color-brand-500: #F59E0B;
  --color-brand-600: #D97706;
  --color-brand-700: #B45309;
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);
  --shadow-soft-lg: 0 8px 30px rgba(0, 0, 0, 0.08);
}

:root {
    --primary-pink: #f899a2;
    --primary-orange: #e26343;
    --bg-white: #ffffff;
    --text-main: #1a1a1a;
`;

// Find where --text-muted starts
const idx = css.indexOf('--text-muted: #666666;');
if (idx !== -1) {
    fs.writeFileSync('src/app/globals.css', cssTop + css.substring(idx));
} else {
    console.log("Could not find text-muted");
}
