import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from './../../utils/writeFileSync';
import { DocsCategoryModel } from './../model/DocsCategoryModel';
import { DocsCategoryDocGraphModel, DocsPageDocGraphModel, DocsVersionGraphModel } from './../model/DocsGraphModel';
import { DocsModel } from './../model/DocsModel';
import { DocsPageModel, DocsSubPageModel } from './../model/DocsPageModel';
import { DocsVersionModel } from './../model/DocsVersionModel';

function subPagesGraph(version: DocsVersionModel, category: DocsCategoryModel, page: DocsPageModel, subPage: DocsSubPageModel) {
  const subPageFullFilePath = `src/docs/${version.folder}/${category.folder}/${page.folder}/${subPage.file}`;
  if (!subPageFullFilePath.endsWith('.md')) {
    throw new Error(`${subPageFullFilePath} is not a valid file in ${subPage.key}`);
  }
  return {
    ...subPage,
    subPageFullFilePath,
  };
}

function getPagesGraph(srcDirPath: string, version: DocsVersionModel, category: DocsCategoryModel, pagesModel: DocsPageModel[]) {
  const categoryFolderPath = `${srcDirPath}/${version.folder}/${category.folder}`;
  return pagesModel.map(
    (page): DocsPageDocGraphModel => {
      if (page.subPages?.length && !page.folder) {
        throw new Error(`Folder is not present in ${categoryFolderPath}/category.yaml/${page.key}`);
      }

      const pageFullFilePath = page.file ? `src/docs/${version.folder}/${category.folder}/${page.file}` : undefined;
      if (page.file && !pageFullFilePath?.endsWith('.md')) {
        throw new Error(`${pageFullFilePath} is not a valid file in ${page.key}`);
      }
      return {
        ...page,
        pageFullFilePath,
        subPages: page.subPages?.map(subPage => {
          return subPagesGraph(version, category, page, subPage);
        }),
      };
    }
  );
}

function categoryGraph(srcDirPath: string, version: DocsVersionModel, category: DocsCategoryModel) {
  const categoryFolderPath = `${srcDirPath}/docs/${version.folder}/${category.folder}`;
  const file = fs.readFileSync(`${categoryFolderPath}/category.yaml`, 'utf8');
  const pagesModel = YAML.parse(file).pages as DocsPageModel[];

  return {
    ...category,
    pages: getPagesGraph(srcDirPath, version, category, pagesModel),
  };
}

function versionGraph(srcDirPath: string, versionFolder: string, version: DocsVersionModel) {
  const file = fs.readFileSync(`${versionFolder}/version.yaml`, 'utf8');
  const categories = YAML.parse(file).categories as DocsCategoryModel[];
  return {
    ...version,
    categories: categories.map(
      (category: DocsCategoryModel): DocsCategoryDocGraphModel => {
        return categoryGraph(srcDirPath, version, category);
      }
    ),
  };
}

export function generateDocs(srcDirPath: string): void {
  const generatedFolder = `${srcDirPath}/../generated/docs`;
  fs.rmSync(generatedFolder, { recursive: true, force: true });
  fs.mkdirSync(generatedFolder);

  const file = fs.readFileSync(`${srcDirPath}/docs/docs.yaml`, 'utf8');
  const docsJson = YAML.parse(file) as DocsModel;

  const docsGraph = {
    ...docsJson,
    versions: docsJson.versions.map(
      (version: DocsVersionModel): DocsVersionGraphModel => {
        const versionFolder = `${srcDirPath}/docs/${version.folder}`;
        return versionGraph(srcDirPath, versionFolder, version);
      }
    ),
  };

  writeFileSync(`${srcDirPath}/../generated/docs/docs.json`, JSON.stringify(docsGraph, null, 2));
}
