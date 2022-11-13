import { GitGuideQuestion } from 'guides/model/GitGuideQuestion';
import { GitUserDiscordConnect } from 'guides/model/StepItemType';
import { GitUserInput } from 'guides/model/GitUserInput';

export interface GitGuideStep {
  content: string;
  name: string;
  stepItems: (GitGuideQuestion | GitUserInput | GitUserDiscordConnect)[];
  uuid: string;
}
