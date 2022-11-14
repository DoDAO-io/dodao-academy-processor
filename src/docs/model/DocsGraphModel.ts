export interface SubPagesGraphModel {
  name: string;
  key: string;
  file: string;
  subPageFullFilePath: string;
}

export interface DocsPageDocGraphModel {
  name: string;
  key: string;
  file?: string;
  link?: string;
  pageFullFilePath?: string;
  folder?: string;
  subPages?: SubPagesGraphModel[];
}

export interface DocsCategoryDocGraphModel {
  name: string;
  folder: string;
  key: string;
  pages: DocsPageDocGraphModel[];
}

export interface DocsVersionGraphModel {
  name: string;
  folder: string;
  key: string;
  categories: DocsCategoryDocGraphModel[];
}

export interface DocsGraphModel {
  versions: DocsVersionGraphModel[];
}
