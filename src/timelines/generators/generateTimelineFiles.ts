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

export function generateTimelineFiles(timelinesSrcDir: string, timelinesOutDir: string) {
  const timelinesFile = fs.readFileSync(`${timelinesSrcDir}/timelines.yaml`, 'utf8');

  createDirectories(timelinesOutDir);

  const timelines = YAML.parse(timelinesFile).timelines as string[];
  timelines.forEach(timeline => generateTimeline(timelinesSrcDir, timelinesOutDir, timeline));

  writeFileSync(
    `${timelinesOutDir}/json/timelines.json`,
    JSON.stringify(
      timelines.map(byte => byte.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
