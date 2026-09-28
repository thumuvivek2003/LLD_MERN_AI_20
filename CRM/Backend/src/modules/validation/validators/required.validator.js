import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { fieldTypeRegistry } from '../../field/types/field-type.registry.js';

export class RequiredValidator extends IValidator {
  get rule() {
    return 'REQUIRED';
  }

  appliesTo(field) {
    return field.required === true;
  }

  async validate({ field, value }) {
    const descriptor = fieldTypeRegistry.get(field.type);
    if (!descriptor.isEmpty(value)) return null;
    return this.error(field, field.validation?.message || `${field.label} is required`);
  }
}
