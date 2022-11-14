import fs from 'fs';
import { Validator } from 'jsonschema';
import YAML from 'yaml';
import { throwValidationError } from './../../utils/throwValidationError';

import { DocsCategoryModel } from './../model/DocsCategoryModel';
import { DocsModel } from './../model/DocsModel';
import docsCategorySchema from './schemas/docsCategorySchema.json';
import docsPageSchema from './schemas/docsPageSchema.json';
import docsSchema from './schemas/docsSchema.json';
import docsVersionsSchema from './schemas/docsVersionSchema.json';

export function validateCategory(categoryFolderPath: string) {
  console.log(`validating category folder - ${categoryFolderPath}`);
  const file = fs.readFileSync(`${categoryFolderPath}/category.yaml`, 'utf8');
  const categoryFileJson = YAML.parse(file);
  const v = new Validator();
  v.addSchema(docsPageSchema, '/DocsPageSchema');

  const res = v.validate(categoryFileJson, docsCategorySchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(categoryFolderPath, res.errors);
  }
}
export function validateVersion(versionFolderPath: string) {
  console.log(`validating version folder - ${versionFolderPath}`);
  const file = fs.readFileSync(`${versionFolderPath}/version.yaml`, 'utf8');
  const versionJson = YAML.parse(file);
  const v = new Validator();

  const res = v.validate(versionJson, docsVersionsSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(versionFolderPath, res.errors);
  }

  (versionJson.categories as DocsCategoryModel[]).forEach(category => {
    validateCategory(`${versionFolderPath}/${category.folder}`);
  });
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
