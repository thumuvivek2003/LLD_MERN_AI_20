import { validatorRegistry } from './validator.registry.js';

/**
 * Validation Factory — asks each registered strategy whether it applies to a
 * field. The engine therefore never enumerates rule names, and a new validator
 * starts working the moment it is registered.
 */
export const ValidationFactory = {
  forField(field) {
    return validatorRegistry.all().filter((v) => v.appliesTo(field));
  },

  /** Pre-computed plan for a whole object — built once per validation run. */
  forObject(objectDef) {
    const plan = new Map();
    for (const field of objectDef.fields || []) {
      const validators = ValidationFactory.forField(field);
      if (validators.length) plan.set(field.fieldId, { field, validators });
    }
    return plan;
  },

  activeRuleCount: () => validatorRegistry.count(),
};
