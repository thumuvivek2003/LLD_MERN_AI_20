import { Router } from 'express';
import { permissionController } from './permission.controller.js';
import { requireMetadataAdmin } from './permission.middleware.js';

export const roleRoutes = Router();
roleRoutes.get('/', permissionController.listRoles);
roleRoutes.post('/', requireMetadataAdmin('create'), permissionController.createRole);
roleRoutes.patch('/:roleId', requireMetadataAdmin('update'), permissionController.patchRole);
roleRoutes.delete('/:roleId', requireMetadataAdmin('delete'), permissionController.deleteRole);

export const permissionRoutes = Router();
permissionRoutes.get('/', permissionController.getMatrix);
permissionRoutes.put('/', requireMetadataAdmin('update'), permissionController.putMatrix);
