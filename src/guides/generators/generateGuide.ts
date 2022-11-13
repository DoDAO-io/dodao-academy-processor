import dedent from 'dedent-js';
import fs from 'fs';
import { GitGuideQuestion, GitQuestionChoice } from 'guides/model/GitGuideQuestion';
import { GitUserInput } from 'guides/model/GitUserInput';
import { GitUserDiscordConnect } from 'guides/model/StepItemType';
import { GitGuideModel, isQuestion, isUserInput } from 'guides/model/GitGuideModel';
import YAML from 'yaml';
import { writeFileSync } from 'guides/utils/writeFileSync';

const choicesMarkdown = (
  answerKeys: string[],
  choices: GitQuestionChoice[]
): string => {
  return choices
    .map(choice => {
      // prettier-ignore
      return dedent`- [${answerKeys.includes(choice.key) ? 'x' : ' '}]  ${choice.content}`;
    })
    .join('\n');
};

export function generateStepItem(
  stepItem: GitGuideQuestion | GitUserInput | GitUserDiscordConnect
) {
  if (isQuestion(stepItem)) {
    const question = stepItem as GitGuideQuestion;
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

export function generateGuide(
  header: string,
  footer: string,
  srcDirPath: string,
  guideToGenerate: string
) {
  const file = fs.readFileSync(`${srcDirPath}/${guideToGenerate}`, 'utf8');
  const guideJson = YAML.parse(file) as GitGuideModel;

  const courseReadmeContents = dedent`${header}
---

## ${guideJson.name}

${guideJson.steps
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

  writeFileSync(
    `${srcDirPath}/../generated/markdown/${guideJson.key}.md`,
    courseReadmeContents
  );

  writeFileSync(
    `${srcDirPath}/../generated/json/${guideJson.key}.json`,
    JSON.stringify(guideJson, null, 2)
  );
}
