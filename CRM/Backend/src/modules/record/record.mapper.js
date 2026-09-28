import { FieldAccessMapper } from '../permission/field-access.mapper.js';

/** Shapes a stored record into the CONTRACT.md §4 Record document. */
export const RecordMapper = {
  toDto(record, { access = null, resolved = null } = {}) {
    const recordJson = access ? FieldAccessMapper.maskRecordJson(record.recordJson, access) : record.recordJson;
    const dto = {
      recordId: record.recordId,
      objectId: record.objectId,
      recordJson,
      displayName: record.displayName,
      status: record.status,
      objectVersion: record.objectVersion,
      createdBy: record.createdBy,
      updatedBy: record.updatedBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    if (resolved) dto.resolved = resolved;
    return dto;
  },

  toList(records, { access = null, resolvedByRecord = null } = {}) {
    return records.map((r) => RecordMapper.toDto(r, { access, resolved: resolvedByRecord?.get(r.recordId) || null }));
  },
};
