const fs = require('fs');
const html = fs.readFileSync('fitabic.html', 'utf8');

const regex = /<div class="[^"]*sticky[^"]*"[\s\S]*?<\/div>\s*<\/div>/g;
let m = html.match(regex);
if (!m) {
  const r2 = /<div id="sticky-atc"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
  m = html.match(r2);
}

if (!m) {
  const r3 = /<div class="[^"]*bottom[^"]*"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/g;
  m = html.match(r3);
}

if (m) {
  console.log(m[0].substring(0, 1500));
} else {
  console.log("not found");
}
