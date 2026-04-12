import fs from 'fs';
try {
  let content = fs.readFileSync('err.txt', 'utf16le');
  console.log(content.substring(0, 3000));
} catch(e) {
  console.error(e);
}
