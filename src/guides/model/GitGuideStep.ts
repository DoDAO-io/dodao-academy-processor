import { GitGuideQuestion } from './GitGuideQuestion';
import { GitUserDiscordConnect } from './StepItemType';
import { GitUserInput } from './GitUserInput';

export interface GitGuideStep {
  content: string;
  name: string;
  stepItems: (GitGuideQuestion | GitUserInput | GitUserDiscordConnect)[];
  uuid: string;
}
