import fs from 'fs';
import { Validator } from 'jsonschema';
import YAML from 'yaml';
import { throwValidationError } from './../../utils/throwValidationError';
import timelineEventSchema from './schemas/timelineEventSchema.json';
import timelineFileSchema from './schemas/timelineSchema.json';

export function validateTimeline(timelineFilePath: string) {
  console.log(`validating timeline file - ${timelineFilePath}`);
  const file = fs.readFileSync(timelineFilePath, 'utf8');
  const timelineJson = YAML.parse(file);
  const v = new Validator();
  v.addSchema(timelineEventSchema, '/TimelineEventSchema');

  const res = v.validate(timelineJson, timelineFileSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(timelineFilePath, res.errors);
  }
}

export function validateTimelines(timelinesSrcDir: string) {
  const file = fs.readFileSync(`${timelinesSrcDir}/timelines.yaml`, 'utf8');
  const timelineJson = YAML.parse(file).timelines as string[];

  timelineJson.forEach(timeline => {
    validateTimeline(`${timelinesSrcDir}/${timeline}`);
  });
}
