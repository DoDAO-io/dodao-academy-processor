import { validateGuide } from 'guides/validation/validateGuide';

describe('validate course', () => {
  it('should pass for the course file', () => {
    validateGuide(__dirname + '/dummy-academy/src/course-contributor.yaml');
  });
});
