import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { GitSimulationModel } from 'src/simulations/model/GitSimulationModel';

export function generateSimulation(simulationsSrcDir: string, simulationsOutPath: string, simulationToGenerate: string) {
  console.log(`Generate Simulation Files for ${simulationsSrcDir}/${simulationToGenerate}`);
  const file = fs.readFileSync(`${simulationsSrcDir}/${simulationToGenerate}`, 'utf8');
  const simulationJson = YAML.parse(file) as GitSimulationModel;

  const courseReadmeContents = dedent`## ${simulationJson.name}

${simulationJson.steps
  .map(step => {
    return dedent`

## ${step.name}

${step.content}    

IframeUrl: ${step.iframeUrl}    

`;
  })
  .join('\n\n---')}

---
   
`;

  writeFileSync(`${simulationsOutPath}/markdown/${simulationJson.id}.md`, courseReadmeContents);

  writeFileSync(`${simulationsOutPath}/json/${simulationJson.id}.json`, JSON.stringify(simulationJson, null, 2));
}
