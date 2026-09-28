import { toCsv } from '../../core/utils/csv.util.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { FieldAccessMapper } from '../permission/field-access.mapper.js';
import { RECORD_STATUS } from '../../config/constants.js';

const MAX_EXPORT = 10_000;

/** CSV / JSON export. Honours field-level permissions — hidden columns never leave. */
export class RecordExportService {
  constructor({ recordRepository, recordService }) {
    this.recordRepository = recordRepository;
    this.recordService = recordService;
  }

  async export(objectId, { format = 'csv', fieldIds = null, recordIds = null, status = RECORD_STATUS.ACTIVE }, actor) {
    const { objectDef, access } = await this.recordService.context(objectId, actor);

    const visible = FieldAccessMapper.maskFields(objectDef.fields, access);
    const chosen = fieldIds?.length ? visible.filter((f) => fieldIds.includes(f.fieldId)) : visible;
    const columns = [...chosen].sort((a, b) => a.order - b.order);

    const records = recordIds?.length
      ? await this.recordRepository.findManyByIds(recordIds)
      : (await this.recordRepository.listByObject(objectId, { status, limit: MAX_EXPORT }))[0];

    if (format === 'json') {
      return {
        contentType: 'application/json',
        filename: `${objectId}-export.json`,
        body: JSON.stringify(
          records.map((r) => ({
            recordId: r.recordId,
            displayName: r.displayName,
            ...Object.fromEntries(columns.map((f) => [f.apiName, r.recordJson?.[f.fieldId] ?? null])),
          })),
          null,
          2,
        ),
      };
    }

    const headers = ['Record ID', ...columns.map((f) => f.label)];
    const rows = records.map((r) => [
      r.recordId,
      ...columns.map((f) => fieldTypeRegistry.get(f.type).display(r.recordJson?.[f.fieldId])),
    ]);
    return { contentType: 'text/csv', filename: `${objectId}-export.csv`, body: toCsv(headers, rows) };
  }
}
