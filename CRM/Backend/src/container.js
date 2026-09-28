import { eventBus } from './core/event-bus/event-bus.js';

import { ObjectRepository, ObjectVersionRepository } from './modules/object/object.repository.js';
import { RecordRepository } from './modules/record/record.repository.js';
import { IndexRepository, IndexEntryRepository } from './modules/index/index.repository.js';
import { AuditRepository } from './modules/audit/audit.repository.js';
import { EventRepository } from './modules/event/event.repository.js';
import { UserRepository } from './modules/user/user.repository.js';
import { PermissionRepository, RoleRepository } from './modules/permission/permission.repository.js';
import { ViewRepository } from './modules/view/view.repository.js';
import {
  SystemLogRepository,
  AlertRepository,
  SettingRepository,
  DatabaseStatsRepository,
} from './modules/system/system.repository.js';

import { MetadataCache } from './modules/cache/metadata.cache.js';
import { PermissionService } from './modules/permission/permission.service.js';
import { ValidationService } from './modules/validation/validation.service.js';
import { IndexManager } from './modules/index/index.manager.js';
import { IndexService } from './modules/index/index.service.js';
import { QueryExecutor } from './modules/query/query.executor.js';
import { ObjectVersionService } from './modules/object/object-version.service.js';
import { ObjectService } from './modules/object/object.service.js';
import { FieldService } from './modules/field/field.service.js';
import { LookupGuard } from './modules/lookup/lookup.guard.js';
import { LookupResolver } from './modules/lookup/lookup.resolver.js';
import { LookupCascadeService } from './modules/lookup/lookup.cascade.service.js';
import { LookupRelationshipService } from './modules/lookup/lookup.relationship.service.js';
import { LookupService } from './modules/lookup/lookup.service.js';
import { RecordService } from './modules/record/record.service.js';
import { RecordBulkService } from './modules/record/record-bulk.service.js';
import { RecordExportService } from './modules/record/record-export.service.js';
import { SearchService } from './modules/search/search.service.js';
import { ViewService } from './modules/view/view.service.js';
import { AuditService } from './modules/audit/audit.service.js';
import { EventService } from './modules/event/event.service.js';
import { UserService } from './modules/user/user.service.js';
import { JobRegistry } from './modules/system/job.registry.js';
import { LogService } from './modules/system/log.service.js';
import { HealthService } from './modules/system/health.service.js';
import { MetricsService } from './modules/system/metrics.service.js';
import { SystemService } from './modules/system/system.service.js';
import { SchedulerService } from './modules/system/scheduler.service.js';

import { registerIndexSubscriber } from './core/event-bus/subscribers/index.subscriber.js';
import { registerAuditSubscriber } from './core/event-bus/subscribers/audit.subscriber.js';
import { registerCacheSubscriber } from './core/event-bus/subscribers/cache.subscriber.js';
import { registerMonitorSubscriber } from './core/event-bus/subscribers/monitor.subscriber.js';
import { registerLogSubscriber } from './core/event-bus/subscribers/log.subscriber.js';

/**
 * Composition root.
 *
 * Every dependency is constructed here and injected through constructors — no
 * service imports another service's singleton, and no service imports a
 * Mongoose model. That is the whole of the "D" in SOLID for this codebase, and
 * it is also what keeps the module graph acyclic.
 *
 * Deliberately hand-written: a DI framework would hide exactly the wiring an
 * LLD exercise is meant to make visible.
 */
export function buildContainer({ withSubscribers = true, withScheduler = true } = {}) {
  // --- repositories (the only things that touch Mongoose) -------------------
  const objectRepository = new ObjectRepository();
  const objectVersionRepository = new ObjectVersionRepository();
  const recordRepository = new RecordRepository();
  const indexRepository = new IndexRepository();
  const indexEntryRepository = new IndexEntryRepository();
  const auditRepository = new AuditRepository();
  const eventRepository = new EventRepository();
  const userRepository = new UserRepository();
  const permissionRepository = new PermissionRepository();
  const roleRepository = new RoleRepository();
  const viewRepository = new ViewRepository();
  const systemLogRepository = new SystemLogRepository();
  const alertRepository = new AlertRepository();
  const settingRepository = new SettingRepository();
  const databaseStatsRepository = new DatabaseStatsRepository();

  // --- cross-cutting singletons --------------------------------------------
  const metadataCache = MetadataCache.getInstance(objectRepository, { ttlSeconds: 300 });
  const jobRegistry = new JobRegistry();
  const logService = new LogService({ systemLogRepository }).attachToLogger();

  // --- engines --------------------------------------------------------------
  const permissionService = new PermissionService({ permissionRepository, roleRepository, userRepository });
  const validationService = new ValidationService({ recordRepository, metadataCache, eventBus });

  const indexManager = new IndexManager({
    indexRepository,
    indexEntryRepository,
    recordRepository,
    metadataCache,
    eventBus,
  });
  const indexService = new IndexService({ indexManager, indexRepository, recordRepository, metadataCache, jobRegistry });
  const queryExecutor = new QueryExecutor({ indexManager, recordRepository });

  const versionService = new ObjectVersionService({ objectRepository, objectVersionRepository });
  const lookupGuard = new LookupGuard({ metadataCache });
  const lookupResolver = new LookupResolver({ recordRepository, metadataCache, eventBus });
  const cascadeService = new LookupCascadeService({ recordRepository, metadataCache, eventBus });
  const relationshipService = new LookupRelationshipService({ recordRepository, metadataCache, cascadeService });
  const lookupService = new LookupService({ metadataCache, recordRepository, queryExecutor, lookupResolver });

  const objectService = new ObjectService({
    objectRepository,
    recordRepository,
    indexRepository,
    metadataCache,
    versionService,
    eventBus,
  });
  const fieldService = new FieldService({
    objectRepository,
    recordRepository,
    metadataCache,
    versionService,
    lookupGuard,
    eventBus,
  });

  const recordService = new RecordService({
    recordRepository,
    metadataCache,
    validationService,
    lookupResolver,
    cascadeService,
    permissionService,
    queryExecutor,
    auditRepository,
    eventBus,
  });
  const recordBulkService = new RecordBulkService({
    recordService,
    recordRepository,
    metadataCache,
    validationService,
    settingRepository,
    eventBus,
  });
  const recordExportService = new RecordExportService({ recordRepository, recordService });

  const searchService = new SearchService({
    metadataCache,
    queryExecutor,
    indexManager,
    permissionService,
    lookupResolver,
  });
  const viewService = new ViewService({ viewRepository, metadataCache });
  const auditService = new AuditService({ auditRepository, metadataCache, userRepository });
  const eventService = new EventService({ eventRepository });
  const userService = new UserService({ userRepository, roleRepository, permissionService });

  const metricsService = new MetricsService({
    databaseStatsRepository,
    indexRepository,
    eventBus,
    metadataCache,
    jobRegistry,
    logService,
  });
  const healthService = new HealthService({
    databaseStatsRepository,
    indexRepository,
    eventBus,
    metadataCache,
    logService,
  });
  const systemService = new SystemService({
    objectRepository,
    recordRepository,
    indexRepository,
    databaseStatsRepository,
    settingRepository,
    alertRepository,
    metadataCache,
    metricsService,
  });
  const schedulerService = new SchedulerService({
    jobRegistry,
    indexManager,
    indexRepository,
    recordRepository,
    metadataCache,
    auditService,
    settingRepository,
  });

  const container = {
    eventBus,
    // repositories
    objectRepository,
    objectVersionRepository,
    recordRepository,
    indexRepository,
    indexEntryRepository,
    auditRepository,
    eventRepository,
    userRepository,
    permissionRepository,
    roleRepository,
    viewRepository,
    systemLogRepository,
    alertRepository,
    settingRepository,
    databaseStatsRepository,
    // engines
    metadataCache,
    permissionService,
    validationService,
    indexManager,
    indexService,
    queryExecutor,
    versionService,
    lookupGuard,
    lookupResolver,
    cascadeService,
    relationshipService,
    lookupService,
    objectService,
    fieldService,
    recordService,
    recordBulkService,
    recordExportService,
    searchService,
    viewService,
    auditService,
    eventService,
    userService,
    jobRegistry,
    logService,
    healthService,
    metricsService,
    systemService,
    schedulerService,
  };

  // --- Observer wiring: services publish, these subscribers react ------------
  if (withSubscribers) {
    registerIndexSubscriber({ eventBus, indexManager });
    registerAuditSubscriber({ eventBus, auditService });
    registerCacheSubscriber({ eventBus, metadataCache, permissionService });
    registerMonitorSubscriber({ eventBus, eventService });
    registerLogSubscriber({ eventBus });
  }
  if (withScheduler) schedulerService.registerAll();

  return container;
}
