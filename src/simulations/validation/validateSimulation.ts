import fs from 'fs';
import { Validator } from 'jsonschema';
import YAML from 'yaml';
import { throwValidationError } from './../../utils/throwValidationError';
import simulationFileSchema from './schemas/simulationSchema.json';
import simulationStepSchema from './schemas/simulationStepSchema.json';
import { validateUniqueUUIDs } from './validateUniqueUUIDs';

export function validateSimulation(simulationFilePath: string) {
  console.log(`validating simulation file - ${simulationFilePath}`);
  const file = fs.readFileSync(simulationFilePath, 'utf8');
  const simulationJson = YAML.parse(file);
  const v = new Validator();
  v.addSchema(simulationStepSchema, '/SimulationStepSchema');

  const res = v.validate(simulationJson, simulationFileSchema, {
    nestedErrors: true,
  });

  if (!res.valid || res.errors.length > 0) {
    throwValidationError(simulationFilePath, res.errors);
  }
}

export function validateSimulations(simulationsSrcDir: string) {
  const file = fs.readFileSync(`${simulationsSrcDir}/simulations.yaml`, 'utf8');
  const simulationJson = YAML.parse(file).simulations as string[];

  console.log('Simulations JSON file', file);

  console.log('Simulations JSON', simulationJson);
  validateUniqueUUIDs(simulationsSrcDir, simulationJson);
  simulationJson.forEach(simulation => {
    validateSimulation(`${simulationsSrcDir}/${simulation}`);
  });
}
