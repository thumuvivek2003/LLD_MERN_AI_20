import SearchQueryBuilder from '../../core/utils/queryBuilder.js';

/** `POST /views` body — the persisted half of a query plus its name. */
export const toViewPayload = ({ name, builder, isDefault = false }) => ({
  name: name.trim(),
  ...builder.toView(),
  isDefault,
});

/** Saved view → filter rows the FilterBar can edit (each row needs a local id). */
export const toFilterRows = (view) =>
  (view?.filters || []).map((filter, index) => ({
    id: `flt_${index}_${filter.fieldId}`,
    fieldId: filter.fieldId,
    operator: filter.operator,
    value: filter.value ?? '',
  }));

export const builderFromView = (view) => SearchQueryBuilder.fromView(view);
