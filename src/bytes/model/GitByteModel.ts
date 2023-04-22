import { QuestionType, UserDiscordConnectType } from './StepItemType';
import { GitByteStep } from './GitByteStep';

export enum InputType {
  PublicShortInput = 'PublicShortInput',
  PrivateShortInput = 'PrivateShortInput',
}

export enum GuidePublishStatus {
  Live = 'Live',
  Draft = 'Draft',
}

export interface GitByteModel {
  content: string;
  created: string;
  id: string;
  name: string;
  publishStatus: GuidePublishStatus;
  steps: GitByteStep[];
  thumbnail: string;
  admins: string[];
  priority: number;
}

export const isQuestion = (item: { type: string }) => item.type === QuestionType.MultipleChoice || item.type === QuestionType.SingleChoice;

export const isUserInput = (item: { type: string }) => item.type === InputType.PublicShortInput || item.type === InputType.PrivateShortInput;

export const isUserDiscordConnect = (item: { type: string }) => item.type === UserDiscordConnectType;
