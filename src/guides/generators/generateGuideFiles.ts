import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { GitGuideModel } from '../model/GitGuideModel';
import { generateGuide } from './generateGuide';

function generateGuidesTable(guidesSrcDir: string, guidesToGenerate: string[]) {
  console.log('Generate Guides Table');
  return guidesToGenerate
    .map((guide, index) => {
      const file = fs.readFileSync(`${guidesSrcDir}/${guide}`, 'utf8');
      const guideJson = YAML.parse(file) as GitGuideModel;

      const fileLink = `[Link](markdown/${guideJson.key}.md)`;
      return `| ${index + 1}      | ${guideJson.name} | ${guideJson.content} |  ${fileLink} |`;
    })
    .join('\n ');
}

function generateGuides(guidesSrcDir: string, guidesOutDir: string, guidesToGenerate: string[]) {
  guidesToGenerate.forEach(guide => generateGuide(guidesSrcDir, guidesOutDir, guide));

  // prettier-ignore
  const courseReadmeContents =
    dedent`## Guides

| S.No        | Title       |  Details  |  Link  |
| ----------- | ----------- |----------- | ----------- |
${(generateGuidesTable(guidesSrcDir, guidesToGenerate))}
`;

  console.log('Generate Guides README.md');
  writeFileSync(`${guidesOutDir}/README.md`, courseReadmeContents);
}

function createDirectories(guidesOutDir: string) {
  fs.rmSync(guidesOutDir, { recursive: true, force: true });

  const foldersToGenerate = [guidesOutDir, `${guidesOutDir}/markdown`, `${guidesOutDir}/json`];

  foldersToGenerate.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
}

export function generateGuideFiles(guidesSrcDir: string, guidesOutDir: string) {
  const guidesFile = fs.readFileSync(`${guidesSrcDir}/guides.yaml`, 'utf8');

  createDirectories(guidesOutDir);

  const guidesToGenerate = YAML.parse(guidesFile).guides as string[];
  generateGuides(guidesSrcDir, guidesOutDir, guidesToGenerate);

  writeFileSync(
    `${guidesOutDir}/json/guides.json`,
    JSON.stringify(
      guidesToGenerate.map(guide => guide.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
