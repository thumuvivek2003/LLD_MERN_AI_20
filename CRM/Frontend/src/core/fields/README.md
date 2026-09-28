# Field-type registry

The Factory + Strategy pair that makes the UI metadata-driven.

A field arrives from the API as metadata (`{fieldId, type, label, required, options,
lookup, validation, …}`). The registry turns that `type` into a **strategy** — the object
that knows how to edit it, display it, filter on it and validate it.

```
registry.js            FIELD_TYPE → strategy   (the Factory)
types/*.field.jsx      one strategy per field type
types/primitives.jsx   shared building blocks so a strategy stays a few lines
operators.js           which OPERATORs each type supports in the filter UI
validators.js          client-side rule runner, mirroring the server's validation engine
```

A strategy is:

```js
{ type, label, icon, indexType, supports, operators,
  defaultValue, coerce, validators, Input, Display, FilterWidget }
```

- `Input` — the editor, used by `DynamicForm` via `FieldRenderer`
- `Display` — the read-only face, used by tables, detail panels and lookup chips
- `FilterWidget` — the value control in a filter row
- `coerce` — normalises a value before it is sent to the API
- `operators` — drives the operator dropdown, so a DATE never offers `startsWith`

## Adding a field type

1. Create `types/rating.field.jsx` exporting a strategy.
2. Add it to `BUILT_IN` in `registry.js`.

Nothing else changes: forms, tables, filters, saved views and the admin field wizard all
pick it up. That is the Open/Closed principle doing actual work — there is no
`switch (field.type)` anywhere in the application to update.

## Accessibility contract

`FieldRenderer` passes `id` and `aria-labelledby` to every `Input`. A strategy that wraps a
native control must forward those props to it (most do so by spreading `...rest` into
`PlainInput`). A strategy that renders a custom widget (toggle, lookup picker, chip group)
must apply `aria-labelledby` to its root and give it an appropriate `role`.
