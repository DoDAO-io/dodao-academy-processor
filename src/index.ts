import { Command } from 'commander';
import fs from 'fs';
import process from 'process';
import YAML from 'yaml';
import { generateDocs } from './docs/generators/generateDocs';
import { validateDocs } from './docs/validation/validateDocs';
import { generateByteFiles } from './bytes/generators/generateByteFiles';
import { validateBytes } from './bytes/validation/validateByte';
import { generateGuideFiles } from './guides/generators/generateGuideFiles';
import { validateGuides } from './guides/validation/validateGuide';

const program = new Command();

interface AcademyContentModel {
  name: string;
  content: string;
  folder: string;
  key: string;
}

export interface AcademyModel {
  guides: AcademyContentModel[];
  bytes: AcademyContentModel[];
  docs: AcademyContentModel[];
}
export function validateAndGenerateFiles(srcPath: string) {
  const srcDirPath = process.cwd() + '/' + srcPath;

  let academyFile = fs.readFileSync(`${srcDirPath}/academy.yaml`, 'utf8');
  const academyModel: AcademyModel = YAML.parse(academyFile);

  for (const guideElement of academyModel.guides) {
    console.log('\nValidating Guides :', guideElement.key);
    validateGuides(`${srcDirPath}/guides/${guideElement.folder}`);
  }

  for (const byteElement of academyModel.bytes) {
    console.log('\nValidating bytes :', byteElement.key);
    validateBytes(`${srcDirPath}/bytes/${byteElement.folder}`);
  }

  for (const docElement of academyModel.docs) {
    console.log('\nValidating Docs :', docElement.key);
    validateDocs(`${srcDirPath}/docs/${docElement.folder}`);
  }

  for (const guideElement of academyModel.guides) {
    console.log('\nGenerating Guides');
    generateGuideFiles(`${srcDirPath}/guides/${guideElement.folder}`, `${srcDirPath}/../generated/guides/${guideElement.folder}`);
  }

  for (const byteElement of academyModel.bytes) {
    console.log('\nGenerating Bytes');
    generateByteFiles(`${srcDirPath}/bytes/${byteElement.folder}`, `${srcDirPath}/../generated/bytes/${byteElement.folder}`);
  }

  for (const docElement of academyModel.docs) {
    console.log('\nGenerating Docs');
    generateDocs(`${srcDirPath}/docs/${docElement.folder}`, `${srcDirPath}/../generated/docs/${docElement.folder}`, 'src/docs/' + docElement.folder);
  }
}

program
  .name('course-processor')
  .description('CLI to for generating metadata for DoDAO courses')
  .version('0.0.1');

program
  .command('gen-all')
  .description('Generates both the markdown and JSON metadata for the course')
  .argument('<path>', 'path of the course folder')
  .action(async path => {
    validateAndGenerateFiles(path);
  });

program.parse();
