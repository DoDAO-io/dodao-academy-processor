import fs from 'fs';
import YAML from 'yaml';
import { GitSimulationModel } from 'src/simulations/model/GitSimulationModel';

export function validateUniqueUUIDs(simulationsSrcDir: string, simulationsJson: string[]) {
  const uuids: string[] = [];

  simulationsJson.forEach(simulation => {
    const simulationFilePath = `${simulationsSrcDir}/${simulation}`;
    const file = fs.readFileSync(simulationFilePath, 'utf8');
    const simulationJson = YAML.parse(file) as GitSimulationModel;
    if (uuids.includes(simulationJson.id)) {
      throw new Error(`Duplicate Simulation id ${simulationJson.id} in ${simulation}`);
    } else {
      uuids.push(simulationJson.id);
    }

    simulationJson.steps.forEach(step => {
      if (uuids.includes(step.uuid)) {
        throw new Error(`Duplicate Step UUID ${step.uuid} in ${simulation}`);
      } else {
        uuids.push(step.uuid);
      }
    });
  });
}
