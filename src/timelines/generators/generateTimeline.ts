import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { TimelineModel } from '../model/TimelineModel';

export function generateTimeline(timelinesSrcDir: string, timelinesOutPath: string, timelineToGenerate: string) {
  console.log(`Generate Timeline Files for ${timelinesSrcDir}/${timelineToGenerate}`);
  const file = fs.readFileSync(`${timelinesSrcDir}/${timelineToGenerate}`, 'utf8');
  const timelineJson = YAML.parse(file) as TimelineModel;

  writeFileSync(`${timelinesOutPath}/json/${timelineToGenerate.replace('.yaml', '.json')}`, JSON.stringify(timelineJson, null, 2));
}
