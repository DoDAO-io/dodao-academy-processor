import fs from 'fs';
import { Validator } from 'jsonschema';
import YAML from 'yaml';
import discordConnectSchema from './schemas/discordConnectSchema.json';
import byteFileSchema from './schemas/byteSchema.json';
import byteStepSchema from './schemas/byteStepSchema.json';
import questionSchema from './schemas/questionSchema.json';
import userInputSchema from './schemas/userInputSchema.json';
import { throwValidationError } from './throwValidationError';

export function validateByte(byteFilePath: string) {
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
