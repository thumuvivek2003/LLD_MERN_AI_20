import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLE } from '../shared/enums/role.enum.js';
import RoleRoute from '../core/guards/RoleRoute.jsx';
import AdminLayout from '../core/layouts/AdminLayout.jsx';
import BusinessLayout from '../core/layouts/BusinessLayout.jsx';
import SystemLayout from '../core/layouts/SystemLayout.jsx';

import UserSwitcherPage from '../modules/switcher/UserSwitcherPage.jsx';
import NotFoundPage from '../modules/switcher/NotFoundPage.jsx';

// Admin
import AdminDashboardPage from '../modules/admin/dashboard/AdminDashboardPage.jsx';
import ObjectListPage from '../modules/admin/object/ObjectListPage.jsx';
import ObjectCreatePage from '../modules/admin/object/ObjectCreatePage.jsx';
import ObjectEditPage from '../modules/admin/object/ObjectEditPage.jsx';
import ObjectLifecyclePage from '../modules/admin/object/ObjectLifecyclePage.jsx';
import FieldListPage from '../modules/admin/field/FieldListPage.jsx';
import FieldCreatePage from '../modules/admin/field/FieldCreatePage.jsx';
import FieldEditPage from '../modules/admin/field/FieldEditPage.jsx';
import FieldReorderPage from '../modules/admin/field/FieldReorderPage.jsx';
import FieldBrowserPage from '../modules/admin/field/FieldBrowserPage.jsx';
import RelationshipsPage from '../modules/admin/object/RelationshipsPage.jsx';
import ValidationRulesPage from '../modules/admin/field/ValidationRulesPage.jsx';
import IndexListPage from '../modules/admin/index/IndexListPage.jsx';
import IndexDetailPage from '../modules/admin/index/IndexDetailPage.jsx';
import RecordBrowserPage from '../modules/admin/record/RecordBrowserPage.jsx';
import AdminRecordListPage from '../modules/admin/record/AdminRecordListPage.jsx';
import AdminRecordViewPage from '../modules/admin/record/AdminRecordViewPage.jsx';
import BulkOperationsPage from '../modules/admin/record/BulkOperationsPage.jsx';
import AdminSearchPage from '../modules/admin/record/AdminSearchPage.jsx';
import UsersRolesPage from '../modules/admin/permission/UsersRolesPage.jsx';
import AuditLogPage from '../modules/admin/audit/AuditLogPage.jsx';
import AdminSettingsPage from '../modules/admin/settings/AdminSettingsPage.jsx';

// Business
import BusinessDashboardPage from '../modules/business/dashboard/BusinessDashboardPage.jsx';
import MyObjectsPage from '../modules/business/objects/MyObjectsPage.jsx';
import FavoritesPage from '../modules/business/objects/FavoritesPage.jsx';
import RecentPage from '../modules/business/objects/RecentPage.jsx';
import RecordListPage from '../modules/business/record/RecordListPage.jsx';
import RecordCreatePage from '../modules/business/record/RecordCreatePage.jsx';
import RecordEditPage from '../modules/business/record/RecordEditPage.jsx';
import RecordViewPage from '../modules/business/record/RecordViewPage.jsx';
import BulkActionsPage from '../modules/business/record/BulkActionsPage.jsx';
import ImportRecordsPage from '../modules/business/record/ImportRecordsPage.jsx';
import ExportRecordsPage from '../modules/business/record/ExportRecordsPage.jsx';
import SearchPage from '../modules/business/search/SearchPage.jsx';
import SavedViewsPage from '../modules/business/views/SavedViewsPage.jsx';
import ReportsPage from '../modules/business/reports/ReportsPage.jsx';
import ActivityPage from '../modules/business/activity/ActivityPage.jsx';
import HelpPage from '../modules/business/settings/HelpPage.jsx';
import BusinessSettingsPage from '../modules/business/settings/BusinessSettingsPage.jsx';

// System
import SystemDashboardPage from '../modules/system/dashboard/SystemDashboardPage.jsx';
import IndexMonitorPage from '../modules/system/pages/IndexMonitorPage.jsx';
import EventMonitorPage from '../modules/system/pages/EventMonitorPage.jsx';
import BackgroundJobsPage from '../modules/system/pages/BackgroundJobsPage.jsx';
import LookupResolverPage from '../modules/system/pages/LookupResolverPage.jsx';
import ValidationEnginePage from '../modules/system/pages/ValidationEnginePage.jsx';
import MetadataCachePage from '../modules/system/pages/MetadataCachePage.jsx';
import DataOverviewPage from '../modules/system/pages/DataOverviewPage.jsx';
import SystemAuditPage from '../modules/system/pages/SystemAuditPage.jsx';
import SystemLogsPage from '../modules/system/pages/SystemLogsPage.jsx';
import AlertsPage from '../modules/system/pages/AlertsPage.jsx';
import MetricsPage from '../modules/system/pages/MetricsPage.jsx';
import SystemSettingsPage from '../modules/system/pages/SystemSettingsPage.jsx';
import IntegrationsPage from '../modules/system/pages/IntegrationsPage.jsx';
import SecurityPage from '../modules/system/pages/SecurityPage.jsx';

/** Route table for all three consoles. `/` is the actor switcher (there is no login). */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<UserSwitcherPage />} />

      <Route element={<RoleRoute allow={[ROLE.PLATFORM_ADMIN]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="objects" element={<ObjectListPage />} />
          <Route path="objects/new" element={<ObjectCreatePage />} />
          <Route path="objects/:oid" element={<ObjectEditPage />} />
          <Route path="objects/:oid/lifecycle" element={<ObjectLifecyclePage />} />
          <Route path="objects/:oid/fields" element={<FieldListPage />} />
          <Route path="objects/:oid/fields/new" element={<FieldCreatePage />} />
          <Route path="objects/:oid/fields/reorder" element={<FieldReorderPage />} />
          <Route path="objects/:oid/fields/:fid" element={<FieldEditPage />} />
          <Route path="fields" element={<FieldBrowserPage />} />
          <Route path="relationships" element={<RelationshipsPage />} />
          <Route path="validation-rules" element={<ValidationRulesPage />} />
          <Route path="indexes" element={<IndexListPage />} />
          <Route path="indexes/:indexId" element={<IndexDetailPage />} />
          <Route path="records" element={<RecordBrowserPage />} />
          <Route path="records/:oid" element={<AdminRecordListPage />} />
          <Route path="records/:oid/bulk" element={<BulkOperationsPage />} />
          <Route path="records/:oid/:rid" element={<AdminRecordViewPage />} />
          <Route path="search" element={<AdminSearchPage />} />
          <Route path="users" element={<UsersRolesPage />} />
          <Route path="audit" element={<AuditLogPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow={[ROLE.BUSINESS_USER]} />}>
        <Route path="/business" element={<BusinessLayout />}>
          <Route index element={<BusinessDashboardPage />} />
          <Route path="objects" element={<MyObjectsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="recent" element={<RecentPage />} />
          <Route path="objects/:oid/records" element={<RecordListPage />} />
          <Route path="objects/:oid/records/new" element={<RecordCreatePage />} />
          <Route path="objects/:oid/records/:rid" element={<RecordViewPage />} />
          <Route path="objects/:oid/records/:rid/edit" element={<RecordEditPage />} />
          <Route path="objects/:oid/bulk" element={<BulkActionsPage />} />
          <Route path="objects/:oid/import" element={<ImportRecordsPage />} />
          <Route path="objects/:oid/export" element={<ExportRecordsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="views" element={<SavedViewsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="settings" element={<BusinessSettingsPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow={[ROLE.SYSTEM]} />}>
        <Route path="/system" element={<SystemLayout />}>
          <Route index element={<SystemDashboardPage />} />
          <Route path="indexes" element={<IndexMonitorPage />} />
          <Route path="events" element={<EventMonitorPage />} />
          <Route path="jobs" element={<BackgroundJobsPage />} />
          <Route path="lookups" element={<LookupResolverPage />} />
          <Route path="validation" element={<ValidationEnginePage />} />
          <Route path="cache" element={<MetadataCachePage />} />
          <Route path="data" element={<DataOverviewPage />} />
          <Route path="audit" element={<SystemAuditPage />} />
          <Route path="logs" element={<SystemLogsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRouter;
