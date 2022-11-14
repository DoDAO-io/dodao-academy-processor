import { GitByteStepItem } from './GitByteStepItem';
import { QuestionType } from './StepItemType';

export interface GitQuestionChoice {
  content: string;
  key: string;
}

export interface GitByteQuestion extends GitByteStepItem {
  answerKeys: string[];
  choices: GitQuestionChoice[];
  content: string;
  questionType: QuestionType;
}
