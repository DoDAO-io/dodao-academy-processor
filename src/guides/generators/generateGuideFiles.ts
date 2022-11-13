import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { GitGuideModel } from '../model/GitGuideModel';
import { writeFileSync } from '../utils/writeFileSync';
import { generateGuide } from './generateGuide';

function generateGuidesTable(srcDirPath: string, guidesToGenerate: string[]) {
  return guidesToGenerate
    .map((guide, index) => {
      const file = fs.readFileSync(`${srcDirPath}/${guide}`, 'utf8');
      const guideJson = YAML.parse(file) as GitGuideModel;

      const fileLink = `[Link](generated/markdown/${guideJson.key}.md)`;
      return `| ${index + 1}      | ${guideJson.name} | ${
        guideJson.content
      } |  ${fileLink} |`;
    })
    .join('\n ');
}

function generateGuides(
  header: string,
  footer: string,
  srcDirPath: string,
  guidesToGenerate: string[]
) {
  guidesToGenerate.forEach(guide =>
    generateGuide(header, footer, srcDirPath, guide)
  );

  // prettier-ignore
  const courseReadmeContents =
    dedent`${header}
---

## Guides

| S.No        | Title       |  Details  |  Link  |
| ----------- | ----------- |----------- | ----------- |
${(generateGuidesTable(srcDirPath, guidesToGenerate))}

---
${footer} 
`;

  writeFileSync(`${srcDirPath}/../README.md`, courseReadmeContents);
}

function createDirectories(courseDirPath: string) {
  const generatedFolder = `${courseDirPath}/../generated`;
  fs.rmSync(generatedFolder, { recursive: true, force: true });

  const markdown = `${courseDirPath}/../generated/markdown`;
  const json = `${courseDirPath}/../generated/json`;

  const foldersToGenerate = [generatedFolder, markdown, json];

  foldersToGenerate.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });
}

export function generateGuideFiles(srcDirPath: string) {
  const guidesFile = fs.readFileSync(`${srcDirPath}/guides.yaml`, 'utf8');
  const header = fs.readFileSync(`${srcDirPath}/guides-header.md`, 'utf8');
  const footer = fs.readFileSync(`${srcDirPath}/guides-footer.md`, 'utf8');

  createDirectories(srcDirPath);

  const guidesToGenerate = YAML.parse(guidesFile).guides as string[];
  generateGuides(header, footer, srcDirPath, guidesToGenerate);

  writeFileSync(
    `${srcDirPath}/../generated/json/guides.json`,
    JSON.stringify(
      guidesToGenerate.map(guide => guide.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
