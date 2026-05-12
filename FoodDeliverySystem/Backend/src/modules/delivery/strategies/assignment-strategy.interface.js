export class AssignmentStrategy {
  async assign(_context) {
    throw new Error('assign() must be implemented by subclass');
  }
}
