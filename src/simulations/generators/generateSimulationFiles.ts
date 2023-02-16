import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { GitSimulationModel } from './../model/GitSimulationModel';
import { generateSimulation } from './../generators/generateSimulation';

function generateSimulationsTable(srcDirPath: string, simulationsToGenerate: string[]) {
  console.log('Generate Simulations Table');
  return simulationsToGenerate
    .map((simulation, index) => {
      const file = fs.readFileSync(`${srcDirPath}/${simulation}`, 'utf8');
      const simulationJson = YAML.parse(file) as GitSimulationModel;

      const fileLink = `[Link](markdown/${simulationJson.id}.md)`;
      return `| ${index + 1}      | ${simulationJson.name} | ${simulationJson.content} |  ${fileLink} |`;
    })
    .join('\n ');
}

function generateSimulations(srcDirPath: string, generatedDirPath: string, simulationsToGenerate: string[]) {
  simulationsToGenerate.forEach(simulation => generateSimulation(srcDirPath, generatedDirPath, simulation));

  // prettier-ignore
  const courseReadmeContents =
    dedent`## Simulations

| S.No        | Title       |  Details  |  Link  |
| ----------- | ----------- |----------- | ----------- |
${(generateSimulationsTable(srcDirPath, simulationsToGenerate))}
`;

  console.log('Generate Simulations README.md');
  writeFileSync(`${generatedDirPath}/README.md`, courseReadmeContents);
}

function createDirectories(simulationsOutDir: string) {
  fs.rmSync(simulationsOutDir, { recursive: true, force: true });

  const foldersToGenerate = [simulationsOutDir, `${simulationsOutDir}/markdown`, `${simulationsOutDir}/json`];

  foldersToGenerate.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
}

export function generateSimulationFiles(simulationsSrcDir: string, simulationsOutDir: string) {
  const simulationsFile = fs.readFileSync(`${simulationsSrcDir}/simulations.yaml`, 'utf8');

  createDirectories(simulationsOutDir);

  const simulationsToGenerate = YAML.parse(simulationsFile).simulations as string[];
  generateSimulations(simulationsSrcDir, simulationsOutDir, simulationsToGenerate);

  writeFileSync(
    `${simulationsOutDir}/json/simulations.json`,
    JSON.stringify(
      simulationsToGenerate.map(simulation => simulation.replace('.yaml', '.json')),
      null,
      2
    )
  );
}
