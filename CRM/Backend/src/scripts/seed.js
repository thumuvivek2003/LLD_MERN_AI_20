import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db.config.js';
import { buildContainer } from '../container.js';
import { FieldFactory } from '../modules/field/field.factory.js';
import { fieldTypeRegistry } from '../modules/field/types/field-type.registry.js';
import { camelCase } from '../core/utils/slug.util.js';
import { recordId as newRecordId, auditId, eventId, logId, alertId, viewId } from '../core/utils/id.util.js';
import {
  OBJECTS,
  RECORD_VOLUMES,
  ROLES,
  USERS,
  PERMISSIONS,
  CITIES,
  FIRST_NAMES,
  LAST_NAMES,
  COMPANY_PREFIX,
  COMPANY_SUFFIX,
} from './seed-data.js';
import {
  OBJECT_STATUS,
  RECORD_STATUS,
  AUDIT_ACTION,
  EVENT_TYPE,
  LOG_LEVEL,
} from '../config/constants.js';

// Deterministic PRNG so two seed runs produce the same demo data.
let rngState = 987654321;
const rnd = () => {
  rngState = (rngState * 1664525 + 1013904223) % 4294967296;
  return rngState / 4294967296;
};
const int = (min, max) => min + Math.floor(rnd() * (max - min + 1));
const one = (arr) => arr[int(0, arr.length - 1)];
const chance = (p) => rnd() < p;
const DAY = 86_400_000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);
const isoDate = (d) => d.toISOString().slice(0, 10);

const BATCH = 2000;
const t0 = Date.now();
const step = (msg) => console.log(`  ${String(Date.now() - t0).padStart(6)}ms  ${msg}`);

async function insertInBatches(model, docs) {
  for (let i = 0; i < docs.length; i += BATCH) {
    await model.insertMany(docs.slice(i, i + BATCH), { ordered: false });
  }
  return docs.length;
}

// ---------------------------------------------------------------- metadata

function buildObjectDocs() {
  return OBJECTS.map((blueprint) => {
    let seq = 0;
    const fields = blueprint.fields.map((f) => {
      seq += 1;
      return FieldFactory.create(f, { fieldId: `f${seq}`, order: seq, existingApiNames: [] });
    });
    return {
      objectId: blueprint.objectId,
      label: blueprint.label,
      pluralLabel: blueprint.pluralLabel,
      apiName: camelCase(blueprint.label),
      description: blueprint.description,
      icon: blueprint.icon,
      color: blueprint.color,
      status: blueprint.status,
      version: blueprint.status === OBJECT_STATUS.PUBLISHED ? int(2, 4) : 1,
      primaryDisplayFieldId: 'f1',
      fields,
      fieldSeq: seq,
      createdBy: 'u_admin',
      updatedBy: 'u_admin',
      createdAt: daysAgo(int(200, 400)),
      updatedAt: daysAgo(int(1, 40)),
    };
  });
}

function buildVersionDocs(objectDocs) {
  const rows = [];
  for (const obj of objectDocs) {
    rows.push({
      objectId: obj.objectId,
      version: 1,
      changedAt: obj.createdAt,
      changedBy: 'u_admin',
      summary: 'Object created',
      diff: obj.fields.slice(0, 3).map((f) => ({ kind: 'FIELD_ADDED', target: f.label, from: null, to: f.type })),
    });
    for (let v = 2; v <= obj.version; v += 1) {
      const field = one(obj.fields);
      rows.push({
        objectId: obj.objectId,
        version: v,
        changedAt: daysAgo(int(10, 180)),
        changedBy: 'u_admin',
        summary: v === 2 ? '1 field added' : `${int(1, 3)} changes`,
        diff: [{ kind: 'FIELD_UPDATED', target: `${field.label}.searchable`, from: false, to: true }],
      });
    }
  }
  return rows;
}

// ----------------------------------------------------------------- records

const fullName = () => `${one(FIRST_NAMES)} ${one(LAST_NAMES)}`;
const companyName = () => `${one(COMPANY_PREFIX)} ${one(COMPANY_SUFFIX)}`;
const slugEmail = (name, i, domain) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}${i}@${domain}`;
const phone = () => `+91 ${int(70000, 99999)}${int(10000, 99999)}`;

/** One generator per object; each returns a `recordJson`. */
const GENERATORS = {
  account: (i) => ({
    f1: `${companyName()} ${i}`,
    f2: one(['Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Education']),
    f3: int(5, 900) * 100000,
    f4: `https://www.account${i}.example.com`,
    f5: fullName(),
  }),

  customer: (i, ctx) => {
    const name = fullName();
    return {
      f1: name,
      f2: slugEmail(name, i, one(['gmail.com', 'outlook.com', 'yahoo.in', 'company.co.in'])),
      f3: phone(),
      f4: one(CITIES),
      f5: one(['Individual', 'Business', 'Enterprise']),
      f6: chance(0.72) ? 'ACTIVE' : chance(0.5) ? 'PROSPECT' : 'INACTIVE',
      f7: isoDate(daysAgo(int(1, 540))),
      f8: `${int(1, 120)}, ${one(['MG Road', 'Jubilee Hills', 'Anna Nagar', 'Koregaon Park', 'Connaught Place'])}, ${one(CITIES)}`,
      f9: chance(0.6) ? one(ctx.account) : null,
    };
  },

  product: (i) => ({
    f1: `${one(['Cloud', 'Edge', 'Smart', 'Pro', 'Lite', 'Ultra'])} ${one(['Router', 'Console', 'Suite', 'Gateway', 'Sensor', 'Analytics'])} ${i}`,
    f2: `SKU-${String(100000 + i)}`,
    f3: one(['Hardware', 'Software', 'Services', 'Subscription', 'Accessories']),
    f4: int(500, 250000),
    f5: chance(0.78),
    f6: isoDate(daysAgo(int(30, 900))),
  }),

  sales_order: (i, ctx) => ({
    f1: `SO-${String(200000 + i)}`,
    f2: isoDate(daysAgo(int(1, 420))),
    f3: int(2, 900) * 500,
    f4: one(['DRAFT', 'CONFIRMED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'DELIVERED', 'CANCELLED']),
    f5: one(ctx.customer),
    f6: chance(0.85) ? one(ctx.product) : null,
  }),

  invoice: (i, ctx) => ({
    f1: `INV-${String(300000 + i)}`,
    f2: int(2, 900) * 500,
    f3: isoDate(daysAgo(int(-60, 300))),
    f4: one(['DRAFT', 'SENT', 'SENT', 'PAID', 'PAID', 'PAID', 'OVERDUE']),
    f5: one(ctx.customer),
    f6: chance(0.7) ? one(ctx.sales_order) : null,
  }),

  lead: (i) => {
    const name = fullName();
    return {
      f1: name,
      f2: slugEmail(name, i, 'leadmail.com'),
      f3: phone(),
      f4: one(['Website', 'Referral', 'Campaign', 'Cold Call', 'Event', 'Partner']),
      f5: one(['NEW', 'NEW', 'CONTACTED', 'CONTACTED', 'QUALIFIED', 'LOST']),
      f6: int(0, 100),
      f7: one(CITIES),
    };
  },

  activity: (i, ctx) => {
    const type = one(['CALL', 'EMAIL', 'MEETING', 'TASK']);
    const verb = { CALL: 'Follow-up call with', EMAIL: 'Send proposal to', MEETING: 'Quarterly review with', TASK: 'Prepare quote for' }[type];
    return {
      f1: `${verb} ${fullName()}`,
      f2: type,
      f3: daysAgo(int(-45, 300)).toISOString(),
      f4: chance(0.62),
      f5: chance(0.9) ? one(ctx.customer) : null,
      f6: one([
        'Customer asked for a revised quotation.',
        'Discussed renewal terms for next quarter.',
        'Awaiting purchase order from procurement.',
        'Shared the implementation timeline.',
        '',
      ]),
    };
  },

  employee: (i) => {
    const name = fullName();
    return {
      f1: name,
      f2: slugEmail(name, i, 'metaforce.in'),
      f3: one(['Engineering', 'Sales', 'Marketing', 'Finance', 'Human Resources', 'Support']),
      f4: one(['Associate', 'Senior Associate', 'Team Lead', 'Manager', 'Director']),
      f5: int(4, 60) * 100000,
      f6: isoDate(daysAgo(int(60, 2400))),
      f7: one(CITIES),
    };
  },

  support_ticket: (i) => ({
    f1: `TCK-${String(400000 + i)}`,
    f2: one(['Login failure', 'Billing discrepancy', 'Feature request', 'Data export issue', 'Performance complaint']),
    f3: one(['Low', 'Medium', 'High', 'Critical']),
    f4: chance(0.8),
  }),
};

function buildRecords(objectDoc, count, ctx) {
  const descriptors = new Map(objectDoc.fields.map((f) => [f.fieldId, fieldTypeRegistry.get(f.type)]));
  const primary = objectDoc.primaryDisplayFieldId;
  const primaryDescriptor = descriptors.get(primary);
  const generate = GENERATORS[objectDoc.objectId];
  const docs = [];

  for (let i = 1; i <= count; i += 1) {
    const recordJson = generate(i, ctx);
    const createdAt = daysAgo(int(1, 500));
    docs.push({
      recordId: newRecordId(),
      objectId: objectDoc.objectId,
      recordJson,
      displayName: primaryDescriptor.display(recordJson[primary]) || `${objectDoc.label} ${i}`,
      // ~2% archived so the Archive screens and RECORD_STATUS filters have data.
      status: chance(0.02) ? RECORD_STATUS.ARCHIVED : RECORD_STATUS.ACTIVE,
      objectVersion: objectDoc.version,
      createdBy: one(['u_sales', 'u_hr', 'u_admin', 'u_system']),
      updatedBy: one(['u_sales', 'u_hr', 'u_admin']),
      createdAt,
      updatedAt: new Date(createdAt.getTime() + int(0, 40) * DAY),
    });
  }
  return docs;
}

// -------------------------------------------------------- history & telemetry

function buildAuditRows(objectDocs, recordsByObject) {
  const actions = [
    AUDIT_ACTION.CREATED,
    AUDIT_ACTION.UPDATED,
    AUDIT_ACTION.UPDATED,
    AUDIT_ACTION.ARCHIVED,
    AUDIT_ACTION.RESTORED,
    AUDIT_ACTION.BULK_UPDATED,
    AUDIT_ACTION.IMPORTED,
  ];
  const userNames = new Map(USERS.map((u) => [u.userId, u.name]));
  const rows = [];

  for (const obj of objectDocs.filter((o) => o.status === OBJECT_STATUS.PUBLISHED)) {
    const pool = recordsByObject.get(obj.objectId) || [];
    for (let i = 0; i < 70; i += 1) {
      const record = pool.length ? one(pool) : null;
      const action = one(actions);
      const field = one(obj.fields.filter((f) => f.type !== 'LOOKUP')) || obj.fields[0];
      const userId = one(['u_admin', 'u_sales', 'u_hr', 'u_employee']);
      rows.push({
        auditId: auditId(),
        at: daysAgo(int(0, 60) + rnd()),
        userId,
        userName: userNames.get(userId),
        action,
        objectId: obj.objectId,
        objectLabel: obj.label,
        recordId: record?.recordId || null,
        recordDisplayName: record?.displayName || '',
        summary: `${obj.label} '${record?.displayName || obj.label}' ${action.toLowerCase()}`,
        changes:
          action === AUDIT_ACTION.UPDATED && record
            ? [{ fieldId: field.fieldId, label: field.label, from: 'Pune', to: record.recordJson[field.fieldId] ?? null }]
            : [],
      });
    }
  }

  for (const obj of objectDocs) {
    rows.push({
      auditId: auditId(),
      at: obj.createdAt,
      userId: 'u_admin',
      userName: 'Admin User',
      action: AUDIT_ACTION.CREATED,
      objectId: obj.objectId,
      objectLabel: obj.label,
      recordId: null,
      recordDisplayName: '',
      summary: `Object '${obj.label}' created`,
      changes: [],
    });
    if (obj.status === OBJECT_STATUS.PUBLISHED) {
      rows.push({
        auditId: auditId(),
        at: new Date(obj.createdAt.getTime() + DAY),
        userId: 'u_admin',
        userName: 'Admin User',
        action: AUDIT_ACTION.PUBLISHED,
        objectId: obj.objectId,
        objectLabel: obj.label,
        recordId: null,
        recordDisplayName: '',
        summary: `Object '${obj.label}' published`,
        changes: [],
      });
    }
  }
  return rows;
}

function buildEventRows(objectDocs) {
  const types = Object.values(EVENT_TYPE);
  const published = objectDocs.filter((o) => o.status === OBJECT_STATUS.PUBLISHED);
  const rows = [];
  for (let i = 0; i < 320; i += 1) {
    const obj = one(published);
    const type = one(types);
    rows.push({
      eventId: eventId(),
      type,
      objectId: obj.objectId,
      objectLabel: obj.label,
      payloadSummary: `${obj.label} · ${type.split('.').slice(-1)[0]}`,
      at: daysAgo(rnd() * 7),
      status: chance(0.98) ? 'PROCESSED' : 'RETRIED',
    });
  }
  return rows.sort((a, b) => b.at - a.at);
}

function buildLogRows() {
  const samples = [
    [LOG_LEVEL.INFO, 'index', 'Index build completed for customer.city (HASH)'],
    [LOG_LEVEL.INFO, 'engine', 'Object published: Sales Order'],
    [LOG_LEVEL.INFO, 'http', 'POST /api/search 200 6.4ms'],
    [LOG_LEVEL.WARNING, 'engine', 'Validation failed on Invoice: REQUIRED'],
    [LOG_LEVEL.WARNING, 'index-manager', 'Index drift detected on lead.score (3%)'],
    [LOG_LEVEL.ERROR, 'engine', 'Lookup resolution failed: invoice.f6 → rec_MISSING'],
    [LOG_LEVEL.CRITICAL, 'scheduler', 'Audit archive job exceeded its window'],
  ];
  const weights = [40, 25, 45, 18, 10, 8, 2];
  const rows = [];
  samples.forEach(([level, source, message], i) => {
    for (let n = 0; n < weights[i]; n += 1) {
      rows.push({ logId: logId(), at: daysAgo(rnd() * 3), level, source, message });
    }
  });
  return rows.sort((a, b) => b.at - a.at);
}

const ALERTS = [
  { severity: 'WARNING', title: 'Index drift on Lead.Score', message: 'BTREE index is 4% behind the record count; the optimizer job will rebuild it.', acknowledged: false },
  { severity: 'INFO', title: 'Metadata cache warmed', message: '10 objects loaded into the metadata cache at boot.', acknowledged: true },
  { severity: 'CRITICAL', title: 'Lookup resolution failures', message: '8 invoices reference a sales order that no longer exists.', acknowledged: false },
  { severity: 'INFO', title: 'Bulk import completed', message: '250 leads imported by Sales Manager.', acknowledged: true },
  { severity: 'WARNING', title: 'Storage at 62%', message: 'Record store growth is tracking above forecast.', acknowledged: false },
];

// -------------------------------------------------------------------- main

async function seed() {
  console.log('\nMetaForce — seeding\n');
  await connectDatabase();
  await mongoose.connection.dropDatabase();
  step('database dropped');

  const container = buildContainer({ withSubscribers: false, withScheduler: false });
  const {
    objectRepository,
    objectVersionRepository,
    recordRepository,
    userRepository,
    roleRepository,
    permissionRepository,
    viewRepository,
    auditRepository,
    eventRepository,
    systemLogRepository,
    alertRepository,
    settingRepository,
    indexManager,
    metadataCache,
  } = container;

  // 1. identity + RBAC
  await roleRepository.insertMany(ROLES);
  await userRepository.insertMany(USERS);
  await permissionRepository.insertMany(
    Object.entries(PERMISSIONS).map(([roleId, matrix]) => ({ roleId, ...matrix })),
  );
  await settingRepository.get();
  step(`${ROLES.length} roles, ${USERS.length} users, ${Object.keys(PERMISSIONS).length} permission matrices`);

  // 2. metadata
  const objectDocs = buildObjectDocs();
  await objectRepository.insertMany(objectDocs);
  await objectVersionRepository.insertMany(buildVersionDocs(objectDocs));
  await metadataCache.refresh();
  const fieldCount = objectDocs.reduce((n, o) => n + o.fields.length, 0);
  step(`${objectDocs.length} objects, ${fieldCount} fields, ${buildVersionDocs(objectDocs).length} version entries`);

  // 3. records — parents before children so lookups point at real ids
  const order = ['account', 'customer', 'product', 'sales_order', 'invoice', 'lead', 'activity', 'employee', 'support_ticket'];
  const byId = new Map(objectDocs.map((o) => [o.objectId, o]));
  const ctx = {};
  const recordsByObject = new Map();
  let totalRecords = 0;

  for (const objectId of order) {
    const objectDoc = byId.get(objectId);
    const count = RECORD_VOLUMES[objectId] || 0;
    if (!objectDoc || !count) continue;
    const docs = buildRecords(objectDoc, count, ctx);
    await insertInBatches(recordRepository.model, docs);
    ctx[objectId] = docs.filter((d) => d.status === RECORD_STATUS.ACTIVE).map((d) => d.recordId);
    recordsByObject.set(objectId, docs);
    totalRecords += docs.length;
    step(`${String(count).padStart(5)} ${objectDoc.pluralLabel}`);
  }

  // 4. indexes — one pass over each object's records builds all of its indexes
  let indexCount = 0;
  for (const objectDoc of objectDocs) {
    if (objectDoc.status === OBJECT_STATUS.DRAFT) continue;
    const built = await indexManager.buildForObject(objectDoc.objectId);
    indexCount += built.length;
    if (built.length) step(`${String(built.length).padStart(5)} indexes built for ${objectDoc.label}`);
  }

  // 5. history + telemetry so the Audit and System consoles are populated
  const auditRows = buildAuditRows(objectDocs, recordsByObject);
  await insertInBatches(auditRepository.model, auditRows);
  const eventRows = buildEventRows(objectDocs);
  await eventRepository.insertMany(eventRows);
  const logRows = buildLogRows();
  await systemLogRepository.insertMany(logRows);
  await alertRepository.insertMany(ALERTS.map((a) => ({ ...a, alertId: alertId(), at: daysAgo(rnd() * 2) })));
  step(`${auditRows.length} audit rows, ${eventRows.length} events, ${logRows.length} logs, ${ALERTS.length} alerts`);

  // 6. a couple of saved views for the business console
  await viewRepository.insertMany([
    {
      viewId: viewId(),
      name: 'Hyderabad Enterprise Customers',
      objectId: 'customer',
      userId: 'u_sales',
      filters: [
        { fieldId: 'f4', operator: 'eq', value: 'Hyderabad' },
        { fieldId: 'f5', operator: 'eq', value: 'Enterprise' },
      ],
      logic: 'AND',
      sort: { fieldId: 'f1', order: 'asc' },
      columns: ['f1', 'f2', 'f4', 'f5', 'f6'],
      isDefault: true,
    },
    {
      viewId: viewId(),
      name: 'Overdue Invoices',
      objectId: 'invoice',
      userId: 'u_sales',
      filters: [{ fieldId: 'f4', operator: 'eq', value: 'OVERDUE' }],
      logic: 'AND',
      sort: { fieldId: 'f2', order: 'desc' },
      columns: ['f1', 'f2', 'f3', 'f4', 'f5'],
      isDefault: false,
    },
    {
      viewId: viewId(),
      name: 'High-score Leads',
      objectId: 'lead',
      userId: 'u_sales',
      filters: [{ fieldId: 'f6', operator: 'gte', value: 70 }],
      logic: 'AND',
      sort: { fieldId: 'f6', order: 'desc' },
      columns: ['f1', 'f2', 'f4', 'f5', 'f6'],
      isDefault: false,
    },
  ]);

  const entryCount = await container.indexEntryRepository.totalEntries();
  const memory = indexManager.memoryStats();

  console.log('\n  ── seeded ──────────────────────────────────');
  console.log(`  objects        ${objectDocs.length}  (8 published, 1 draft, 1 archived)`);
  console.log(`  fields         ${fieldCount}`);
  console.log(`  records        ${totalRecords}`);
  console.log(`  indexes        ${indexCount}  (${entryCount} key entries, ${memory.postings} postings in memory)`);
  console.log(`  audit rows     ${auditRows.length}`);
  console.log(`  events         ${eventRows.length}`);
  console.log(`  system logs    ${logRows.length}`);
  console.log(`  users / roles  ${USERS.length} / ${ROLES.length}`);
  console.log(`  elapsed        ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);

  await disconnectDatabase();
}

seed().catch(async (err) => {
  console.error('\nSeed failed:', err);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
