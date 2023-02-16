import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { GitByteModel } from '../model/GitByteModel';
import { generateByte } from './generateByte';

function generateBytesTable(srcDirPath: string, bytesToGenerate: string[]) {
  console.log('Generate Bytes Table');
  return bytesToGenerate
    .map((byte, index) => {
      const file = fs.readFileSync(`${srcDirPath}/${byte}`, 'utf8');
      const byteJson = YAML.parse(file) as GitByteModel;

      const fileLink = `[Link](markdown/${byteJson.id}.md)`;
      return `| ${index + 1}      | ${byteJson.name} | ${byteJson.content} |  ${fileLink} |`;
    })
    .join('\n ');
}

function generateBytes(srcDirPath: string, generatedDirPath: string, bytesToGenerate: string[]) {
  bytesToGenerate.forEach(byte => generateByte(srcDirPath, generatedDirPath, byte));

  // prettier-ignore
  const courseReadmeContents =
    dedent`## Bytes

| S.No        | Title       |  Details  |  Link  |
| ----------- | ----------- |----------- | ----------- |
${(generateBytesTable(srcDirPath, bytesToGenerate))}
`;

  console.log('Generate Bytes README.md');
  writeFileSync(`${generatedDirPath}/README.md`, courseReadmeContents);
}

function createDirectories(bytesOutDir: string) {
  fs.rmSync(bytesOutDir, { recursive: true, force: true });

  const foldersToGenerate = [bytesOutDir, `${bytesOutDir}/markdown`, `${bytesOutDir}/json`];

  foldersToGenerate.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
}

export function generateByteFiles(bytesSrcDir: string, bytesOutDir: string) {
  const bytesFile = fs.readFileSync(`${bytesSrcDir}/bytes.yaml`, 'utf8');

  createDirectories(bytesOutDir);

  const bytesToGenerate = YAML.parse(bytesFile).bytes as string[];
  generateBytes(bytesSrcDir, bytesOutDir, bytesToGenerate);

  writeFileSync(
    `${bytesOutDir}/json/bytes.json`,
    JSON.stringify(
      bytesToGenerate.map(byte => byte.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
