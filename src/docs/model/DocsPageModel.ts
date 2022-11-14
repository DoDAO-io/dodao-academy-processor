export interface DocsSubPageModel {
  name: string;
  key: string;
  file: string;
}

export interface DocsPageModel {
  name: string;
  key: string;
  file: string;
  folder?: string;
  subPages?: DocsSubPageModel[];
}
