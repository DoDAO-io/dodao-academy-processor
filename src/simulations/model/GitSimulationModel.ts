import { GitSimulationStep } from './GitSimulationStep';

export enum SimulationPublishStatus {
  Live = 'Live',
  Draft = 'Draft',
}

export interface GitSimulationModel {
  id: string;
  content: string;
  created: number;
  name: string;
  publishStatus: SimulationPublishStatus;
  steps: GitSimulationStep[];
  admins: string[];
  priority: number;
}
