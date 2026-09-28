import mongoose from 'mongoose';
import { OBJECT_STATUS, FIELD_TYPE, ON_DELETE } from '../../config/constants.js';

const optionSchema = new mongoose.Schema(
  { value: String, label: String, color: String },
  { _id: false },
);

const lookupSchema = new mongoose.Schema(
  {
    objectId: String,
    displayFieldId: String,
    onDelete: { type: String, enum: Object.values(ON_DELETE), default: ON_DELETE.RESTRICT },
  },
  { _id: false },
);

const validationSchema = new mongoose.Schema(
  {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    minLength: { type: Number, default: null },
    maxLength: { type: Number, default: null },
    regex: { type: String, default: null },
    message: { type: String, default: null },
  },
  { _id: false },
);

/** Fields are embedded: an ObjectDefinition is the aggregate root for its schema. */
const fieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    apiName: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: Object.values(FIELD_TYPE), required: true },
    order: { type: Number, default: 1 },
    required: { type: Boolean, default: false },
    unique: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    sortable: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    indexed: { type: Boolean, default: false },
    defaultValue: { type: mongoose.Schema.Types.Mixed, default: null },
    helpText: { type: String, default: '' },
    options: { type: [optionSchema], default: undefined },
    lookup: { type: lookupSchema, default: undefined },
    validation: { type: validationSchema, default: () => ({}) },
  },
  { _id: false },
);

const objectSchema = new mongoose.Schema(
  {
    objectId: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    pluralLabel: { type: String, required: true },
    apiName: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'box' },
    color: { type: String, default: 'indigo' },
    status: { type: String, enum: Object.values(OBJECT_STATUS), default: OBJECT_STATUS.DRAFT, index: true },
    version: { type: Number, default: 1 },
    primaryDisplayFieldId: { type: String, default: null },
    fields: { type: [fieldSchema], default: [] },
    fieldSeq: { type: Number, default: 0 },
    createdBy: { type: String, default: 'u_admin' },
    updatedBy: { type: String, default: 'u_admin' },
  },
  { timestamps: true, collection: 'objectdefinitions' },
);

objectSchema.index({ label: 1 });

export const ObjectDefinitionModel = mongoose.model('ObjectDefinition', objectSchema);
