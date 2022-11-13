import fs from 'fs';

export function writeFileSync(filePath: string, contents: string) {
  fs.writeFileSync(filePath, contents);
}
