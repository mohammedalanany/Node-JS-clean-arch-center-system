const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'views/pages');
const footerStr = `\n  <%- include('../partials/footer') %>`;

const files = fs.readdirSync(dir);
let fixedCount = 0;

for (const file of files) {
  if (file.endsWith('.ejs')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let changed = false;
    
    // 1. Remove it from before </body>
    if (content.includes("<%- include('../partials/footer') %>\n</body>")) {
       content = content.replace("\n  <%- include('../partials/footer') %>\n</body>", "\n</body>");
       changed = true;
    } else if (content.includes("<%- include('../partials/footer') %>")) {
       // It might be somewhere else, let's remove it completely to be safe
       content = content.replace(/\n\s*<%- include\('\.\.\/partials\/footer'\) %>\n?/g, "\n");
       changed = true;
    }
    
    // 2. Add it right before </main>
    if (content.includes('</main>')) {
       content = content.replace('</main>', footerStr + '\n    </main>');
       changed = true;
    } else {
       // if no main, add it before </div>\n</body> if exists
    }
    
    if (changed) {
       fs.writeFileSync(filePath, content);
       fixedCount++;
    }
  }
}

console.log('Fixed', fixedCount, 'files');
