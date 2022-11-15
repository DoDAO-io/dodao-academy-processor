import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { generateTimeline } from './generateTimeline';

function createDirectories(bytesOutDir: string) {
  fs.rmSync(bytesOutDir, { recursive: true, force: true });

  const foldersToGenerate = [bytesOutDir, `${bytesOutDir}/json`];

  foldersToGenerate.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
}

export function generateTimelineFiles(bytesSrcDir: string, bytesOutDir: string) {
  const bytesFile = fs.readFileSync(`${bytesSrcDir}/timelines.yaml`, 'utf8');

  createDirectories(bytesOutDir);

  const timelines = YAML.parse(bytesFile).timelines as string[];
  timelines.forEach(timeline => generateTimeline(bytesSrcDir, bytesOutDir, timeline));

  writeFileSync(
    `${bytesOutDir}/json/bytes.json`,
    JSON.stringify(
      timelines.map(byte => byte.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
