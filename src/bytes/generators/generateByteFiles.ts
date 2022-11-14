import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { GitByteModel } from '../model/GitByteModel';
import { generateByte } from './generateByte';

function generateBytesTable(srcDirPath: string, bytesToGenerate: string[]) {
  return bytesToGenerate
    .map((byte, index) => {
      const file = fs.readFileSync(`${srcDirPath}/bytes/${byte}`, 'utf8');
      const byteJson = YAML.parse(file) as GitByteModel;

      const fileLink = `[Link](markdown/${byteJson.key}.md)`;
      return `| ${index + 1}      | ${byteJson.name} | ${byteJson.content} |  ${fileLink} |`;
    })
    .join('\n ');
}

function generateBytes(header: string, footer: string, srcDirPath: string, bytesToGenerate: string[]) {
  bytesToGenerate.forEach(byte => generateByte(header, footer, srcDirPath, byte));

  // prettier-ignore
  const courseReadmeContents =
    dedent`${header}
---

## Bytes

| S.No        | Title       |  Details  |  Link  |
| ----------- | ----------- |----------- | ----------- |
${(generateBytesTable(srcDirPath, bytesToGenerate))}

---
${footer} 
`;

  writeFileSync(`${srcDirPath}/../generated/bytes/README.md`, courseReadmeContents);
}

function createDirectories(courseDirPath: string) {
  const generatedFolder = `${courseDirPath}/../generated/bytes`;
  fs.rmSync(generatedFolder, { recursive: true, force: true });

  const markdown = `${courseDirPath}/../generated/bytes/markdown`;
  const json = `${courseDirPath}/../generated/bytes/json`;

  const foldersToGenerate = [generatedFolder, markdown, json];

  foldersToGenerate.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });
}

export function generateByteFiles(srcDirPath: string) {
  const bytesFile = fs.readFileSync(`${srcDirPath}/bytes/bytes.yaml`, 'utf8');
  const header = fs.readFileSync(`${srcDirPath}/bytes/bytes-header.md`, 'utf8');
  const footer = fs.readFileSync(`${srcDirPath}/bytes/bytes-footer.md`, 'utf8');

  createDirectories(srcDirPath);

  const bytesToGenerate = YAML.parse(bytesFile).bytes as string[];
  generateBytes(header, footer, srcDirPath, bytesToGenerate);

  writeFileSync(
    `${srcDirPath}/../generated/bytes/json/bytes.json`,
    JSON.stringify(
      bytesToGenerate.map(byte => byte.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
