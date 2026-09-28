import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { fieldTypeRegistry } from '../../field/types/field-type.registry.js';

export class RegexValidator extends IValidator {
  get rule() {
    return 'REGEX';
  }

  appliesTo(field) {
    return Boolean(field.validation?.regex);
  }

  async validate({ field, value }) {
    const descriptor = fieldTypeRegistry.get(field.type);
    if (descriptor.isEmpty(value)) return null;
    let re;
    try {
      re = new RegExp(field.validation.regex);
    } catch {
      return this.error(field, `${field.label} has an invalid regex configured`);
    }
    if (re.test(String(value))) return null;
    return this.error(field, field.validation.message || `${field.label} does not match the required format`);
  }
}
