import { ConflictError } from '../../../core/exceptions/conflict.error.js';

/**
 * Base of the object-lifecycle State pattern.
 *
 * Every rule of the form "you can't do X to a DRAFT object" lives in exactly
 * one state class instead of being scattered as `if (status === ...)` across
 * the object, field and record services.
 */
export class ObjectState {
  get name() {
    return 'UNKNOWN';
  }

  /** Statuses this state may move to. */
  get allowedTransitions() {
    return [];
  }

  canTransitionTo(status) {
    return this.allowedTransitions.includes(status);
  }

  assertTransition(status) {
    if (!this.canTransitionTo(status)) {
      throw new ConflictError(`Cannot move object from ${this.name} to ${status}`);
    }
  }

  // --- capability questions the other engines ask -------------------------

  canCreateRecords() {
    return false;
  }

  canEditRecords() {
    return false;
  }

  canEditSchema() {
    return false;
  }

  canChangeFieldType() {
    return false;
  }

  canDelete() {
    return false;
  }

  assertCanCreateRecords(objectDef) {
    if (!this.canCreateRecords()) {
      throw new ConflictError(`Records can only be created against a PUBLISHED object; '${objectDef.label}' is ${this.name}`);
    }
  }

  assertCanEditRecords(objectDef) {
    if (!this.canEditRecords()) {
      throw new ConflictError(`Records of '${objectDef.label}' cannot be modified while the object is ${this.name}`);
    }
  }

  assertCanEditSchema(objectDef) {
    if (!this.canEditSchema()) {
      throw new ConflictError(`Fields of '${objectDef.label}' cannot be changed while the object is ${this.name}`);
    }
  }

  describe() {
    return {
      status: this.name,
      transitions: this.allowedTransitions,
      capabilities: {
        createRecords: this.canCreateRecords(),
        editRecords: this.canEditRecords(),
        editSchema: this.canEditSchema(),
        changeFieldType: this.canChangeFieldType(),
        delete: this.canDelete(),
      },
    };
  }
}
