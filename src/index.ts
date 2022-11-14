import { Command } from 'commander';
import process from 'process';
import { validateDocs } from './docs/validation/validateDocs';
import { generateByteFiles } from './bytes/generators/generateByteFiles';
import { validateBytes } from './bytes/validation/validateByte';
import { generateGuideFiles } from './guides/generators/generateGuideFiles';
import { validateGuides } from './guides/validation/validateGuide';

const program = new Command();

export function validateAndGenerateFiles(srcPath: string) {
  const srcDirPath = process.cwd() + '/' + srcPath;

  console.log('\nValidating Bytes');
  validateBytes(srcDirPath);

  console.log('\nValidating Guides');
  validateGuides(srcDirPath);

  console.log('\nValidating Docs');
  validateDocs(srcDirPath);

  console.log('\nGenerating Bytes');
  generateGuideFiles(srcDirPath);

  console.log('\nGenerating Guides');
  generateByteFiles(srcDirPath);
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
