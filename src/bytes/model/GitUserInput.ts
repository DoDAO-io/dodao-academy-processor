import { GitByteStepItem } from './GitByteStepItem';

export interface GitUserInput extends GitByteStepItem {
  label: string;
  required: boolean;
}
