import { ReadOnlyValidator } from './validators/readonly.validator.js';
import { RequiredValidator } from './validators/required.validator.js';
import { LengthValidator } from './validators/length.validator.js';
import { NumberRangeValidator } from './validators/number-range.validator.js';
import { EmailValidator } from './validators/email.validator.js';
import { DateValidator } from './validators/date.validator.js';
import { PicklistValidator } from './validators/picklist.validator.js';
import { RegexValidator } from './validators/regex.validator.js';
import { LookupExistsValidator } from './validators/lookup-exists.validator.js';
import { UniqueValidator } from './validators/unique.validator.js';

/**
 * Rule → strategy registry. Order matters only for error readability
 * (cheap structural checks first, database round-trips last).
 *
 * Adding a rule = new file + one line here. No engine file changes. (OCP)
 */
const VALIDATORS = [
  new ReadOnlyValidator(),
  new RequiredValidator(),
  new LengthValidator(),
  new NumberRangeValidator(),
  new EmailValidator(),
  new DateValidator(),
  new PicklistValidator(),
  new RegexValidator(),
  new LookupExistsValidator(),
  new UniqueValidator(),
];

const BY_RULE = new Map(VALIDATORS.map((v) => [v.rule, v]));

export const validatorRegistry = {
  all: () => [...VALIDATORS],
  get: (rule) => BY_RULE.get(rule),
  rules: () => VALIDATORS.map((v) => v.rule),
  count: () => VALIDATORS.length,
};
