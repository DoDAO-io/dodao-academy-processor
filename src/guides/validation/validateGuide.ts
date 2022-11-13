import fs from 'fs';
import { Validator } from 'jsonschema';
import YAML from 'yaml';
import discordConnectSchema from './schemas/discordConnectSchema.json';
import guideIntegrationsSchema from './schemas/guideIntegrationsSchema.json';
import guideFileSchema from './schemas/guideSchema.json';
import guideStepSchema from './schemas/guideStepSchema.json';
import questionSchema from './schemas/questionSchema.json';
import userInputSchema from './schemas/userInputSchema.json';
import { throwValidationError } from './throwValidationError';
import { validateUniqueUUIDs } from './validateUniqueUUIDs';

export function validateGuide(guideFilePath: string) {
  const file = fs.readFileSync(guideFilePath, 'utf8');
  const guideJson = YAML.parse(file);
  const v = new Validator();
  v.addSchema(guideIntegrationsSchema, '/GuideIntegrationsSchema');
  v.addSchema(guideStepSchema, '/GuideStepSchema');
  v.addSchema(discordConnectSchema, '/DiscordConnectSchema');
  v.addSchema(userInputSchema, '/UserInputSchema');
  v.addSchema(questionSchema, '/QuestionSchema');

  const res = v.validate(guideJson, guideFileSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(guideFilePath, res.errors);
  }
}

export function validateGuides(srcDirPath: string) {
  const file = fs.readFileSync(`${srcDirPath}/guides.yaml`, 'utf8');
  const guideJson = YAML.parse(file).guides as string[];

  validateUniqueUUIDs(srcDirPath, guideJson);
  guideJson.forEach(guide => {
    validateGuide(`${srcDirPath}/${guide}`);
  });
  console.log(guideJson);
}
