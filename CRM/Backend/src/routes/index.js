import { Router } from 'express';
import objectRoutes from '../modules/object/object.routes.js';
import searchRoutes from '../modules/search/search.routes.js';
import indexRoutes from '../modules/index/index.routes.js';
import lookupRoutes from '../modules/lookup/lookup.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';
import viewRoutes from '../modules/view/view.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import systemRoutes from '../modules/system/system.routes.js';
import { roleRoutes, permissionRoutes } from '../modules/permission/permission.routes.js';
import { fieldController } from '../modules/field/field.controller.js';
import { userController } from '../modules/user/user.controller.js';

export const router = Router();

router.get('/field-types', fieldController.catalogue);
router.get('/me', userController.me);

router.use('/users', userRoutes);
router.use('/objects', objectRoutes);
router.use('/search', searchRoutes);
router.use('/views', viewRoutes);
router.use('/indexes', indexRoutes);
router.use('/lookups', lookupRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/audit', auditRoutes);
router.use('/system', systemRoutes);
