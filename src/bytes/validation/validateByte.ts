import fs from 'fs';
import { Validator } from 'jsonschema';
import YAML from 'yaml';
import { throwValidationError } from './../../utils/throwValidationError';
import byteFileSchema from './schemas/byteSchema.json';
import byteStepSchema from './schemas/byteStepSchema.json';
import discordConnectSchema from './schemas/discordConnectSchema.json';
import questionSchema from './schemas/questionSchema.json';
import userInputSchema from './schemas/userInputSchema.json';
import { validateUniqueUUIDs } from './validateUniqueUUIDs';

export function validateByte(byteFilePath: string) {
  console.log(`validating byte file - ${byteFilePath}`);
  const file = fs.readFileSync(byteFilePath, 'utf8');
  const byteJson = YAML.parse(file);
  const v = new Validator();
  v.addSchema(byteStepSchema, '/ByteStepSchema');
  v.addSchema(discordConnectSchema, '/DiscordConnectSchema');
  v.addSchema(userInputSchema, '/UserInputSchema');
  v.addSchema(questionSchema, '/QuestionSchema');

  const res = v.validate(byteJson, byteFileSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(byteFilePath, res.errors);
  }
}

export function validateBytes(bytesSrcDir: string) {
  const file = fs.readFileSync(`${bytesSrcDir}/bytes.yaml`, 'utf8');
  const byteJson = YAML.parse(file).bytes as string[];

  validateUniqueUUIDs(bytesSrcDir, byteJson);
  byteJson.forEach(byte => {
    validateByte(`${bytesSrcDir}/${byte}`);
  });
}
