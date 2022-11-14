import { InputType } from './GitByteModel';
import { QuestionType, UserDiscordConnectType } from './StepItemType';

export interface GitByteStepItem {
  // This is undefined for the old questions. The questions will have to be migrated
  type: InputType | QuestionType | typeof UserDiscordConnectType;
  uuid: string;
}
