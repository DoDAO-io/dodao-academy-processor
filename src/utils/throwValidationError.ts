export function throwValidationError(filePath: string, errors: any[]) {
  throw new Error(`Error in file ${filePath} \n \n \n \n  ${JSON.stringify(errors, null, 2)}`);
}
