import { validateGuide } from './../src/guides/validation/validateGuide';

describe('validate course', () => {
  it('should pass for the course file', () => {
    validateGuide(
      __dirname + '/dummy-academy/src/guides/course-contributor.yaml'
    );
  });
});
