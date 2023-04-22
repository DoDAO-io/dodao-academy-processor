import fs from 'fs';
import YAML from 'yaml';
import { GitByteModel } from '../model/GitByteModel';

export function validateUniqueUUIDs(bytesSrcDir: string, bytesJson: string[]) {
  const uuids: string[] = [];

  bytesJson.forEach(byte => {
    const byteFilePath = `${bytesSrcDir}/${byte}`;
    const file = fs.readFileSync(byteFilePath, 'utf8');
    const byteJson = YAML.parse(file) as GitByteModel;
    if (uuids.includes(byteJson.id)) {
      throw new Error(`Duplicate Byte UUID ${byteJson.id} in ${byte}`);
    } else {
      uuids.push(byteJson.id);
    }

    byteJson.steps.forEach(step => {
      if (uuids.includes(step.uuid)) {
        throw new Error(`Duplicate Step UUID ${step.uuid} in ${byte}`);
      } else {
        uuids.push(step.uuid);
      }

      if (!step.stepItems) {
        throw new Error(`No Step Item present for ${step.name} in ${byte}`);
      }

      step.stepItems.forEach(stepItem => {
        if (uuids.includes(stepItem.uuid)) {
          throw new Error(`Duplicate Step Item UUID ${stepItem.uuid} in ${byte}`);
        } else {
          uuids.push(stepItem.uuid);
        }
      });
    });
  });
}
