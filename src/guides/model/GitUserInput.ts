import { GitGuideStepItem } from 'guides/model/GitGuideStepItem';

export interface GitUserInput extends GitGuideStepItem {
  label: string;
  required: boolean;
}
