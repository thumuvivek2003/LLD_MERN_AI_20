/**
 * The ONLY place in the app where a URL string is written.
 * Everything else imports from here — no component or hook builds a path.
 * Mirrors CONTRACT.md §5 exactly.
 */
const API = '/api';

export const ENDPOINTS = {
  // §2 identity
  users: `${API}/users`,
  user: (userId) => `${API}/users/${userId}`,
  me: `${API}/me`,

  // §5.1 objects
  objects: `${API}/objects`,
  object: (oid) => `${API}/objects/${oid}`,
  objectPublish: (oid) => `${API}/objects/${oid}/publish`,
  objectArchive: (oid) => `${API}/objects/${oid}/archive`,
  objectRestore: (oid) => `${API}/objects/${oid}/restore`,
  objectClone: (oid) => `${API}/objects/${oid}/clone`,
  objectVersions: (oid) => `${API}/objects/${oid}/versions`,
  objectStats: (oid) => `${API}/objects/${oid}/stats`,

  // §5.2 fields
  fieldTypes: `${API}/field-types`,
  fields: (oid) => `${API}/objects/${oid}/fields`,
  field: (oid, fid) => `${API}/objects/${oid}/fields/${fid}`,
  fieldsReorder: (oid) => `${API}/objects/${oid}/fields/reorder`,

  // §5.3 records
  records: (oid) => `${API}/objects/${oid}/records`,
  record: (oid, rid) => `${API}/objects/${oid}/records/${rid}`,
  recordArchive: (oid, rid) => `${API}/objects/${oid}/records/${rid}/archive`,
  recordRestore: (oid, rid) => `${API}/objects/${oid}/records/${rid}/restore`,
  recordRelated: (oid, rid) => `${API}/objects/${oid}/records/${rid}/related`,
  recordHistory: (oid, rid) => `${API}/objects/${oid}/records/${rid}/history`,
  recordsBulk: (oid) => `${API}/objects/${oid}/records/bulk`,
  recordsImport: (oid) => `${API}/objects/${oid}/records/import`,
  recordsExport: (oid) => `${API}/objects/${oid}/records/export`,

  // §5.4 search & views
  search: `${API}/search`,
  searchSuggest: `${API}/search/suggest`,
  views: `${API}/views`,
  view: (viewId) => `${API}/views/${viewId}`,

  // §5.5 indexes
  indexes: `${API}/indexes`,
  indexesSummary: `${API}/indexes/summary`,
  index: (indexId) => `${API}/indexes/${indexId}`,
  indexRebuild: (indexId) => `${API}/indexes/${indexId}/rebuild`,
  indexesRebuildAll: `${API}/indexes/rebuild-all`,

  // §5.6 lookups
  lookupOptions: `${API}/lookups/options`,
  lookupGraph: `${API}/lookups/graph`,
  lookupStats: `${API}/lookups/stats`,

  // §5.7 permissions
  roles: `${API}/roles`,
  role: (roleId) => `${API}/roles/${roleId}`,
  permissions: `${API}/permissions`,

  // §5.8 audit
  audit: `${API}/audit`,

  // §5.9 system console
  systemHealth: `${API}/system/health`,
  systemMetrics: `${API}/system/metrics`,
  systemEvents: `${API}/system/events`,
  systemJobs: `${API}/system/jobs`,
  systemJobRun: (jobId) => `${API}/system/jobs/${jobId}/run`,
  systemCache: `${API}/system/cache`,
  systemCacheRefresh: `${API}/system/cache/refresh`,
  systemValidationStats: `${API}/system/validation/stats`,
  systemLogs: `${API}/system/logs`,
  systemLogsSummary: `${API}/system/logs/summary`,
  systemAlerts: `${API}/system/alerts`,
  systemAlertAck: (alertId) => `${API}/system/alerts/${alertId}/ack`,
  systemStorage: `${API}/system/storage`,
  systemSettings: `${API}/system/settings`,
  systemOverview: `${API}/system/overview`,
};

export default ENDPOINTS;
