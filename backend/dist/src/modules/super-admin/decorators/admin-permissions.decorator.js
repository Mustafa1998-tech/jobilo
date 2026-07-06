"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPermissionsMulti = exports.AdminPermissions = exports.ADMIN_PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ADMIN_PERMISSIONS_KEY = 'admin_permissions';
const AdminPermissions = (permissions) => (0, common_1.SetMetadata)(exports.ADMIN_PERMISSIONS_KEY, [permissions]);
exports.AdminPermissions = AdminPermissions;
const AdminPermissionsMulti = (permissions) => (0, common_1.SetMetadata)(exports.ADMIN_PERMISSIONS_KEY, permissions);
exports.AdminPermissionsMulti = AdminPermissionsMulti;
//# sourceMappingURL=admin-permissions.decorator.js.map