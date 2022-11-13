import { GitGuideIntegrations } from 'guides/model/GitGuideIntegrations';
import { QuestionType, UserDiscordConnectType } from 'guides/model/StepItemType';
import { GitGuideStep } from 'guides/model/GitGuideStep';

export enum InputType {
  PublicShortInput = 'PublicShortInput',
  PrivateShortInput = 'PrivateShortInput',
}

// These don't follow the naming convention as we used the type in url
export enum GuideType {
  Course = 'course',
  Onboarding = 'onboarding',
  HowTo = 'how-to',
  LevelUp = 'level-up',
}

export enum GuidePublishStatus {
  Live = 'Live',
  Draft = 'Draft',
}

export const GuideTypesArray = [
  GuideType.Course,
  GuideType.Onboarding,
  GuideType.HowTo,
  GuideType.LevelUp,
];

export interface GitGuideModel {
  categories: string[];
  content: string;
  created: string;
  guideIntegrations?: GitGuideIntegrations;
  guideType: GuideType;
  key: string;
  name: string;
  postSubmissionStepContent?: string;
  publishStatus: GuidePublishStatus;
  showIncorrectOnCompletion: boolean;
  socialShareImage?: string;
  steps: GitGuideStep[];
  thumbnail: string;
  uuid: string;
}

export const isQuestion = (item: { type: string }) =>
  item.type === QuestionType.MultipleChoice ||
  item.type === QuestionType.SingleChoice;

export const isUserInput = (item: { type: string }) =>
  item.type === InputType.PublicShortInput ||
  item.type === InputType.PrivateShortInput;

export const isUserDiscordConnect = (item: { type: string }) =>
  item.type === UserDiscordConnectType;
