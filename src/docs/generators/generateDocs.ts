import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from './../../utils/writeFileSync';
import { DocsCategoryModel } from './../model/DocsCategoryModel';
import { DocsCategoryDocGraphModel, DocsPageDocGraphModel, DocsVersionGraphModel } from './../model/DocsGraphModel';
import { DocsModel } from './../model/DocsModel';
import { DocsPageModel, DocsSubPageModel } from './../model/DocsPageModel';
import { DocsVersionModel } from './../model/DocsVersionModel';

function subPagesGraph(version: DocsVersionModel, docsRelativeDir: string, category: DocsCategoryModel, page: DocsPageModel, subPage: DocsSubPageModel) {
  const subPageFullFilePath = `${docsRelativeDir}/${version.folder}/${category.folder}/${page.folder}/${subPage.file}`;
  if (!subPageFullFilePath.endsWith('.md')) {
    throw new Error(`${subPageFullFilePath} is not a valid file in ${subPage.key}`);
  }
  return {
    ...subPage,
    subPageFullFilePath,
  };
}

function getPagesGraph(srcDirPath: string, docsRelativeDir: string, version: DocsVersionModel, category: DocsCategoryModel, pagesModel: DocsPageModel[]) {
  const categoryFolderPath = `${srcDirPath}/${version.folder}/${category.folder}`;
  return pagesModel.map(
    (page): DocsPageDocGraphModel => {
      if (page.subPages?.length && !page.folder) {
        throw new Error(`Folder is not present in ${categoryFolderPath}/category.yaml/${page.key}`);
      }

      const pageFullFilePath = page.file ? `${docsRelativeDir}/${version.folder}/${category.folder}/${page.file}` : undefined;
      if (page.file && !pageFullFilePath?.endsWith('.md')) {
        throw new Error(`${pageFullFilePath} is not a valid file in ${page.key}`);
      }
      return {
        ...page,
        pageFullFilePath,
        subPages: page.subPages?.map(subPage => {
          return subPagesGraph(version, docsRelativeDir, category, page, subPage);
        }),
      };
    }
  );
}

function categoryGraph(srcDirPath: string, docsRelativeDir: string, version: DocsVersionModel, category: DocsCategoryModel) {
  const categoryFolderPath = `${srcDirPath}/${version.folder}/${category.folder}`;
  const file = fs.readFileSync(`${categoryFolderPath}/category.yaml`, 'utf8');
  const pagesModel = YAML.parse(file).pages as DocsPageModel[];

  return {
    ...category,
    pages: getPagesGraph(srcDirPath, docsRelativeDir, version, category, pagesModel),
  };
}

function versionGraph(srcDirPath: string, docsRelativeDir: string, version: DocsVersionModel) {
  const versionFolder = `${srcDirPath}/${version.folder}`;
  const file = fs.readFileSync(`${versionFolder}/version.yaml`, 'utf8');
  const categories = YAML.parse(file).categories as DocsCategoryModel[];
  return {
    ...version,
    categories: categories.map(
      (category: DocsCategoryModel): DocsCategoryDocGraphModel => {
        return categoryGraph(srcDirPath, docsRelativeDir, version, category);
      }
    ),
  };
}

export function generateDocs(docsSrcDir: string, docsOutDir: string, docsRelativeDir: string): void {
  fs.rmSync(docsOutDir, { recursive: true, force: true });
  fs.mkdirSync(docsOutDir, { recursive: true });

  const file = fs.readFileSync(`${docsSrcDir}/docs.yaml`, 'utf8');
  const docsJson = YAML.parse(file) as DocsModel;

  const docsGraph = {
    ...docsJson,
    versions: docsJson.versions.map(
      (version: DocsVersionModel): DocsVersionGraphModel => {
        return versionGraph(docsSrcDir, docsRelativeDir, version);
      }
    ),
  };

  console.log(`Writing ${docsOutDir}/docs.json`);
  writeFileSync(`${docsOutDir}/docs.json`, JSON.stringify(docsGraph, null, 2));
}
