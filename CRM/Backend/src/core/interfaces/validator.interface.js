import { NotImplementedError } from '../exceptions/not-implemented.error.js';

/**
 * IValidator — one rule, one file (Strategy).
 *
 * `rule` is the stable code that ships in the VALIDATION_ERROR details array.
 * `appliesTo(field)` lets the factory decide whether this strategy is relevant
 * for a given field without the engine knowing any concrete validator.
 * `validate(ctx)` returns `null` when valid or a structured error object.
 *
 * ctx = {
 *   field,        // Field metadata
 *   value,        // coerced incoming value
 *   recordJson,   // the whole candidate record
 *   objectDef,    // owning ObjectDefinition
 *   recordId,     // null on create
 *   isCreate,
 *   deps          // { recordRepository, metadataCache }
 * }
 */
export class IValidator {
  get rule() {
    throw new NotImplementedError('IValidator.rule');
  }

  appliesTo(_field) {
    throw new NotImplementedError('IValidator.appliesTo');
  }

  async validate(_ctx) {
    throw new NotImplementedError('IValidator.validate');
  }

  /** Helper so every validator emits the identical error shape. */
  error(field, message) {
    return { fieldId: field.fieldId, apiName: field.apiName, rule: this.rule, message };
  }
}
