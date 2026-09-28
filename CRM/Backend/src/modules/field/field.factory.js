import { fieldTypeRegistry } from './types/field-type.registry.js';
import { FIELD_TYPE } from '../../config/constants.js';
import { camelCase } from '../../core/utils/slug.util.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

const EMPTY_VALIDATION = { min: null, max: null, minLength: null, maxLength: null, regex: null, message: null };

/**
 * Field Factory — turns a raw "add field" payload into a persisted Field document,
 * consulting the type descriptor for defaults instead of switching on `type`.
 */
export const FieldFactory = {
  create(input, { fieldId, order, existingApiNames = [] }) {
    const descriptor = fieldTypeRegistry.get(input.type);

    if (descriptor.supports.options && !Array.isArray(input.options)) {
      throw new BadRequestError(`Field type ${input.type} requires an 'options' array`);
    }
    if (descriptor.supports.lookup && !input.lookup?.objectId) {
      throw new BadRequestError('Lookup fields require lookup.objectId');
    }

    let apiName = input.apiName ? camelCase(input.apiName) : camelCase(input.label);
    if (!apiName) throw new BadRequestError('Field label is required');
    if (existingApiNames.includes(apiName)) apiName = `${apiName}${order}`;

    const searchable = Boolean(input.searchable);
    const sortable = descriptor.supports.sortable ? Boolean(input.sortable) : false;
    const filterable = input.filterable === undefined ? true : Boolean(input.filterable);

    const field = {
      fieldId,
      apiName,
      label: input.label,
      type: input.type,
      order,
      required: Boolean(input.required),
      unique: descriptor.supports.unique ? Boolean(input.unique) : false,
      readOnly: Boolean(input.readOnly),
      searchable,
      sortable,
      filterable,
      indexed: searchable || sortable || filterable,
      defaultValue: descriptor.supports.defaultValue ? (input.defaultValue ?? null) : null,
      helpText: input.helpText || '',
      validation: { ...EMPTY_VALIDATION, ...(input.validation || {}) },
    };

    if (descriptor.supports.options) {
      field.options = (input.options || []).map((o) =>
        typeof o === 'string' ? { value: o, label: o, color: 'slate' } : { color: 'slate', ...o },
      );
    }
    if (input.type === FIELD_TYPE.LOOKUP) {
      field.lookup = {
        objectId: input.lookup.objectId,
        displayFieldId: input.lookup.displayFieldId || null,
        onDelete: input.lookup.onDelete || 'RESTRICT',
      };
    }
    return field;
  },

  /** Applied on PATCH so `indexed` stays a derived value rather than a client input. */
  applyPatch(field, patch) {
    const descriptor = fieldTypeRegistry.get(patch.type || field.type);
    const next = { ...field };
    for (const prop of ['label', 'required', 'readOnly', 'helpText', 'defaultValue', 'searchable', 'sortable', 'filterable', 'unique']) {
      if (patch[prop] !== undefined) next[prop] = patch[prop];
    }
    if (patch.type !== undefined) next.type = patch.type;
    if (patch.validation !== undefined) next.validation = { ...EMPTY_VALIDATION, ...next.validation, ...patch.validation };
    if (patch.options !== undefined && descriptor.supports.options) {
      next.options = patch.options.map((o) => (typeof o === 'string' ? { value: o, label: o, color: 'slate' } : { color: 'slate', ...o }));
    }
    if (patch.lookup !== undefined && descriptor.supports.lookup) {
      next.lookup = { ...next.lookup, ...patch.lookup };
    }
    if (!descriptor.supports.unique) next.unique = false;
    if (!descriptor.supports.sortable) next.sortable = false;
    next.indexed = Boolean(next.searchable || next.sortable || next.filterable);
    return next;
  },

  descriptorFor: (field) => fieldTypeRegistry.get(field.type),
};
