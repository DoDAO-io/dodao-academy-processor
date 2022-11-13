import { Command } from 'commander';
import process from 'process';
import { generateGuideFiles } from "./guides/generators/generateGuideFiles";
import { validateGuides } from './guides/validation/validateGuide';

const program = new Command();

export function validateAndGenerateFiles(srcPath: string) {
  const srcDirPath = process.cwd() + '/' + srcPath;
  console.log('Validating Course...');
  validateGuides(srcDirPath);

  console.log('Congrats! Everything looks good!');

  generateGuideFiles(srcDirPath);
}

export function validateFiles(srcPath: string) {
  const srcDirPath = process.cwd() + '/' + srcPath;
  console.log('Validating Course...');
  validateGuides(srcDirPath);
  console.log('Congrats! Everything looks good!');
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

program
  .command('validate')
  .description('Validates the course files')
  .argument('<path>', 'path of the course folder')
  .action(async path => {
    validateFiles(path);
  });

program.parse();
