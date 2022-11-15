import dedent from 'dedent-js';
import fs from 'fs';
import YAML from 'yaml';
import { writeFileSync } from '../../utils/writeFileSync';
import { GitByteModel, isQuestion, isUserInput } from '../model/GitByteModel';
import { GitByteQuestion, GitQuestionChoice } from '../model/GitByteQuestion';
import { GitUserInput } from '../model/GitUserInput';
import { GitUserDiscordConnect } from '../model/StepItemType';

const choicesMarkdown = (answerKeys: string[], choices: GitQuestionChoice[]): string => {
  return choices
    .map(choice => {
      // prettier-ignore
      return dedent`- [${answerKeys.includes(choice.key) ? 'x' : ' '}]  ${choice.content}`;
    })
    .join('\n');
};

export function generateStepItem(stepItem: GitByteQuestion | GitUserInput | GitUserDiscordConnect) {
  if (isQuestion(stepItem)) {
    const question = stepItem as GitByteQuestion;
    return dedent`


##### ${question.content}  
      
${choicesMarkdown(question.answerKeys, question.choices)}

 
`;
  } else if (isUserInput(stepItem)) {
    const userInput = stepItem as GitUserInput;
    return dedent`


| Label | Type | Required |
| ----------- | ----------- | ---- |
| ${userInput.label}        | ${userInput.type}   |  ${userInput.required}    |



`;
  } else {
    return '';
  }
}

export function generateByte(header: string, footer: string, bytesSrcDir: string, bytesOutPath: string, byteToGenerate: string) {
  console.log(`Generate Byte Files for ${bytesSrcDir}/${byteToGenerate}`);
  const file = fs.readFileSync(`${bytesSrcDir}/${byteToGenerate}`, 'utf8');
  const byteJson = YAML.parse(file) as GitByteModel;

  const courseReadmeContents = dedent`${header}
---

## ${byteJson.name}

${byteJson.steps
  .map(step => {
    return dedent`

## ${step.name}

${step.content}

${step.stepItems.map(stepItem => generateStepItem(stepItem)).join('\n\n')}    

`;
  })
  .join('\n\n---')}

---
${footer}    
   
`;

  writeFileSync(`${bytesOutPath}/markdown/${byteJson.key}.md`, courseReadmeContents);

  writeFileSync(`${bytesOutPath}/json/${byteJson.key}.json`, JSON.stringify(byteJson, null, 2));
}
