import fs from 'fs';
import { Validator } from 'jsonschema';
import { DocsModel } from 'src/docs/model/DocsModel';
import YAML from 'yaml';
import { throwValidationError } from './../../utils/throwValidationError';
import docsSchema from './schemas/docsSchema.json';
import docsVersionsSchema from './schemas/docsVersionSchema.json';
import docCategorySchema from './schemas/docsCategorySchema.json';

export function validateVersion(versionFolderPath: string) {
  console.log(`validating docs folder - ${versionFolderPath}`);
  const file = fs.readFileSync(`${versionFolderPath}/version.yaml`, 'utf8');
  const versionJson = YAML.parse(file);
  const v = new Validator();
  v.addSchema(docCategorySchema, '/DocsCategorySchema');

  const res = v.validate(versionJson, docsVersionsSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(versionFolderPath, res.errors);
  }
}

export function validateDocs(srcDirPath: string) {
  const file = fs.readFileSync(`${srcDirPath}/docs/docs.yaml`, 'utf8');
  const docsJson = YAML.parse(file) as DocsModel;

  const v = new Validator();
  v.addSchema(docsVersionsSchema, '/DocsVersionSchema');

  const res = v.validate(docsJson, docsSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(`${srcDirPath}/docs/docs.yaml`, res.errors);
  }
  docsJson.versions.forEach(byte => {
    validateVersion(`${srcDirPath}/docs/${byte.folder}`);
  });
}
