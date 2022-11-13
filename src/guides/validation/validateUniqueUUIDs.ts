import fs from 'fs';
import YAML from 'yaml';
import { GitGuideModel } from 'guides/model/GitGuideModel';

export function validateUniqueUUIDs(srcDirPath: string, guidesJson: string[]) {
  const uuids: string[] = [];

  guidesJson.forEach(guide => {
    const guideFilePath = `${srcDirPath}/${guide}`;
    const file = fs.readFileSync(guideFilePath, 'utf8');
    const guideJson = YAML.parse(file) as GitGuideModel;
    if (uuids.includes(guideJson.uuid)) {
      throw new Error(`Duplicate Guide UUID ${guideJson.uuid} in ${guide}`);
    } else {
      uuids.push(guideJson.uuid);
    }

    guideJson.steps.forEach(step => {
      if (uuids.includes(step.uuid)) {
        throw new Error(`Duplicate Step UUID ${step.uuid} in ${guide}`);
      } else {
        uuids.push(step.uuid);
      }

      if (!step.stepItems) {
        throw new Error(`No Step Item present for ${step.name} in ${guide}`);
      }

      step.stepItems.forEach(stepItem => {
        if (uuids.includes(stepItem.uuid)) {
          throw new Error(
            `Duplicate Step Item UUID ${stepItem.uuid} in ${guide}`
          );
        } else {
          uuids.push(stepItem.uuid);
        }
      });
    });
  });
}
