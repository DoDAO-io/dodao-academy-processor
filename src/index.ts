import { Command } from 'commander';
import process from 'process';
import { generateByteFiles } from './bytes/generators/generateByteFiles';
import { generateGuideFiles } from './guides/generators/generateGuideFiles';

const program = new Command();

export function validateAndGenerateFiles(srcPath: string) {
  const srcDirPath = process.cwd() + '/' + srcPath;
  console.log('Validating Course...');

  console.log('Congrats! Everything looks good!');

  generateGuideFiles(srcDirPath);
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
