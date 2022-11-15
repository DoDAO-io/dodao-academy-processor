import { Command } from 'commander';
import process from 'process';
import { generateDocs } from './docs/generators/generateDocs';
import { validateDocs } from './docs/validation/validateDocs';
import { generateByteFiles } from './bytes/generators/generateByteFiles';
import { validateBytes } from './bytes/validation/validateByte';
import { generateGuideFiles } from './guides/generators/generateGuideFiles';
import { validateGuides } from './guides/validation/validateGuide';

const program = new Command();

export function validateAndGenerateFiles(srcPath: string) {
  const srcDirPath = process.cwd() + '/' + srcPath;

  console.log('\nValidating Guides');
  validateGuides(srcDirPath + '/guides/main');

  console.log('\nValidating Bytes');
  validateBytes(srcDirPath + '/bytes/main');

  console.log('\nValidating Docs');
  validateDocs(srcDirPath + '/docs/main');

  console.log('\nGenerating Guides');
  generateGuideFiles(srcDirPath + '/guides/main', srcDirPath + '/../generated/guides/main');

  console.log('\nGenerating Bytes');
  generateByteFiles(srcDirPath + '/main', `${srcDirPath}/../generated/main`);

  console.log('\nGenerating Docs');
  generateDocs(srcDirPath);
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
