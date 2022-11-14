import { GitUserDiscordConnect } from './StepItemType';
import { GitUserInput } from './GitUserInput';

export interface GitByteStep {
  content: string;
  name: string;
  stepItems: (GitUserInput | GitUserDiscordConnect)[];
  uuid: string;
}
