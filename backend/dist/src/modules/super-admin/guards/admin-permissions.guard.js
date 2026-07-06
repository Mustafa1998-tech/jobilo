"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPermissionsGuard = exports.ADMIN_PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.ADMIN_PERMISSIONS_KEY = 'admin_permissions';
let AdminPermissionsGuard = class AdminPermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(exports.ADMIN_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        const hasAllPermissions = requiredPermissions.every(req => user.permissions?.includes(`${req.module}_${req.action}`));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException('You do not have permission to perform this action');
        }
        return true;
    }
};
exports.AdminPermissionsGuard = AdminPermissionsGuard;
exports.AdminPermissionsGuard = AdminPermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AdminPermissionsGuard);
//# sourceMappingURL=admin-permissions.guard.js.map