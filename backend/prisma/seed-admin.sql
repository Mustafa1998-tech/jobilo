-- Seed Admin Permissions (cast text to enum types)
INSERT INTO admin_permissions (id, module, action, description)
SELECT gen_random_uuid(), m.module::"AdminModule", a.action::"AdminAction", m.module || ' ' || a.action
FROM (VALUES 
  ('DASHBOARD'), ('USERS'), ('PROJECTS'), ('PROPOSALS'), ('CONTRACTS'),
  ('DISPUTES'), ('REPORTS'), ('SUBSCRIPTIONS'), ('CONTENT'),
  ('BLOG'), ('FAQ'), ('BANNERS'), ('SETTINGS'), ('ROLES'), ('AUDIT_LOGS'),
  ('ANALYTICS'), ('SECURITY')
) AS m(module)
CROSS JOIN (VALUES ('CREATE'), ('READ'), ('UPDATE'), ('DELETE'), ('APPROVE'), ('REJECT'), ('BLOCK'), ('UNBLOCK'), ('BAN'), ('WARN')) AS a(action)
ON CONFLICT (module, action) DO NOTHING;

-- Seed Super Admin Role
INSERT INTO admin_roles (id, name, "nameAr", description, "isSystem", priority, "updatedAt")
VALUES (gen_random_uuid(), 'Super Admin', 'مشرف عام', 'Full access to all features', true, 0, NOW())
ON CONFLICT (name) DO NOTHING;

-- Link Super Admin role to all permissions
INSERT INTO admin_role_permissions ("roleId", "permissionId")
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'Super Admin'
ON CONFLICT DO NOTHING;

-- Seed Admin Role (add updatedAt column)
INSERT INTO admin_roles (id, name, "nameAr", description, "isSystem", priority, "updatedAt")
VALUES (gen_random_uuid(), 'Admin', 'مسؤول', 'Administrator with most permissions', true, 1, NOW())
ON CONFLICT (name) DO NOTHING;

-- Seed Moderator Role
INSERT INTO admin_roles (id, name, "nameAr", description, "isSystem", priority, "updatedAt")
VALUES (gen_random_uuid(), 'Moderator', 'مراقب', 'Content and user moderation', true, 2, NOW())
ON CONFLICT (name) DO NOTHING;

-- Seed Support Role
INSERT INTO admin_roles (id, name, "nameAr", description, "isSystem", priority, "updatedAt")
VALUES (gen_random_uuid(), 'Support', 'دعم', 'Customer support access', true, 3, NOW())
ON CONFLICT (name) DO NOTHING;

-- Seed Content Manager Role
INSERT INTO admin_roles (id, name, "nameAr", description, "isSystem", priority, "updatedAt")
VALUES (gen_random_uuid(), 'Content Manager', 'مدير محتوى', 'Content management access', true, 5, NOW())
ON CONFLICT (name) DO NOTHING;

-- Link Admin to dashboard, users, projects, proposals, contracts, disputes, reports, subscriptions, content, settings, analytics, logs (no roles or security)
INSERT INTO admin_role_permissions ("roleId", "permissionId")
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'Admin'
  AND p.module NOT IN ('ROLES'::"AdminModule", 'SECURITY'::"AdminModule")
ON CONFLICT DO NOTHING;

-- Link Moderator to users (read, update), projects (read, update), proposals (read, update), reports (read, update), content (read, update)
INSERT INTO admin_role_permissions ("roleId", "permissionId")
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'Moderator'
  AND (
    (p.module = 'USERS'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'UPDATE'::"AdminAction"))
    OR (p.module = 'PROJECTS'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'UPDATE'::"AdminAction"))
    OR (p.module = 'PROPOSALS'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'UPDATE'::"AdminAction"))
    OR (p.module = 'REPORTS'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'UPDATE'::"AdminAction"))
    OR (p.module = 'CONTENT'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'UPDATE'::"AdminAction"))
  )
ON CONFLICT DO NOTHING;

-- Link Support to users (read), disputes (read, approve), reports (read, update)
INSERT INTO admin_role_permissions ("roleId", "permissionId")
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'Support'
  AND (
    (p.module = 'USERS'::"AdminModule" AND p.action IN ('READ'::"AdminAction"))
    OR (p.module = 'DISPUTES'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'APPROVE'::"AdminAction"))
    OR (p.module = 'REPORTS'::"AdminModule" AND p.action IN ('READ'::"AdminAction", 'UPDATE'::"AdminAction"))
  )
ON CONFLICT DO NOTHING;

-- Link Content Manager to content, blog, faq, banners (all actions)
INSERT INTO admin_role_permissions ("roleId", "permissionId")
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'Content Manager'
  AND p.module IN ('CONTENT'::"AdminModule", 'BLOG'::"AdminModule", 'FAQ'::"AdminModule", 'BANNERS'::"AdminModule")
ON CONFLICT DO NOTHING;

-- Assign admin@jobilo.com as Super Admin
INSERT INTO admin_user_roles ("userId", "roleId")
SELECT u.id, r.id
FROM users u, admin_roles r
WHERE u.email = 'admin@jobilo.com' AND r.name = 'Super Admin'
ON CONFLICT DO NOTHING;
