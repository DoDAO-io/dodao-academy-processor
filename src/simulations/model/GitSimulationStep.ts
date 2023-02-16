export interface GitSimulationStep {
  content?: string;
  created: number;
  uuid: string;
  name: string;
  order: number;
  iframeUrl?: string;
}
