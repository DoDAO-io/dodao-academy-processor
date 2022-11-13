import { InputType } from 'guides/model/GitGuideModel';
import { QuestionType, UserDiscordConnectType } from 'guides/model/StepItemType';

export interface GitGuideStepItem {
  // This is undefined for the old questions. The questions will have to be migrated
  type: InputType | QuestionType | typeof UserDiscordConnectType;
  uuid: string;
}
