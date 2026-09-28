import { ValidationFactory } from './validation.factory.js';
import { validatorRegistry } from './validator.registry.js';
import { EVENT_TYPE } from '../../config/constants.js';

/**
 * Validation Engine.
 *
 * Owns *when* validation runs and how failures are aggregated;
 * owns nothing about *how* any individual rule is checked — that is the
 * strategies'. Also keeps the counters behind `/system/validation/stats`.
 */
export class ValidationService {
  constructor({ recordRepository, metadataCache, eventBus }) {
    this.deps = { recordRepository, metadataCache };
    this.eventBus = eventBus;
    this.stats = { runs: 0, failures: 0, byRule: new Map(), timestamps: [] };
  }

  /**
   * @returns {Promise<Array>} structured VALIDATION_ERROR details (empty = valid)
   */
  async validateRecord({ objectDef, recordJson, recordId = null, isCreate = true, touched = null, batchSeen = null }) {
    const plan = ValidationFactory.forObject(objectDef);
    const errors = [];

    for (const [fieldId, { field, validators }] of plan) {
      const ctx = {
        field,
        value: recordJson[fieldId],
        recordJson,
        objectDef,
        recordId,
        isCreate,
        touched,
        batchSeen,
        deps: this.deps,
      };
      for (const validator of validators) {
        const error = await validator.validate(ctx);
        if (error) {
          errors.push(error);
          break; // one message per field keeps the form UI readable
        }
      }
    }

    this.#record(errors);
    if (errors.length) {
      this.eventBus.publish(EVENT_TYPE.VALIDATION_FAILED, {
        objectId: objectDef.objectId,
        objectLabel: objectDef.label,
        recordId,
        errors,
      });
    }
    return errors;
  }

  #record(errors) {
    this.stats.runs += 1;
    this.stats.timestamps.push(Date.now());
    if (this.stats.timestamps.length > 5000) this.stats.timestamps.splice(0, 2500);
    if (!errors.length) return;
    this.stats.failures += 1;
    for (const e of errors) {
      this.stats.byRule.set(e.rule, (this.stats.byRule.get(e.rule) || 0) + 1);
    }
  }

  getStats() {
    const cutoff = Date.now() - 60_000;
    const perMin = this.stats.timestamps.filter((t) => t >= cutoff).length;
    const totalFailures = [...this.stats.byRule.values()].reduce((a, b) => a + b, 0);
    const topFailures = [...this.stats.byRule.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([rule, count]) => ({
        rule,
        count,
        percent: totalFailures ? Math.round((count / totalFailures) * 1000) / 10 : 0,
      }));
    return {
      perMin,
      successRate: this.stats.runs ? Math.round(((this.stats.runs - this.stats.failures) / this.stats.runs) * 1000) / 10 : 100,
      failed: this.stats.failures,
      runs: this.stats.runs,
      activeRules: validatorRegistry.count(),
      rules: validatorRegistry.rules(),
      topFailures,
    };
  }
}
