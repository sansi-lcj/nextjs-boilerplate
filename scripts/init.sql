-- 创建数据库
CREATE DATABASE IF NOT EXISTS `asset_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `asset_management`;

-- 设置时区
SET time_zone = '+8:00';

-- 创建组织表
CREATE TABLE IF NOT EXISTS `t_organization` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '组织名称',
  `code` varchar(50) DEFAULT NULL COMMENT '组织代码',
  `type` varchar(20) DEFAULT NULL COMMENT '组织类型',
  `parent_id` bigint unsigned DEFAULT NULL COMMENT '上级组织ID',
  `sort` int DEFAULT '0' COMMENT '排序',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态',
  `street_id` bigint unsigned DEFAULT NULL COMMENT '所属街道ID',
  `district_id` bigint unsigned DEFAULT NULL COMMENT '所属区ID',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_code` (`code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织表';

-- 创建用户表
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `org_id` bigint unsigned DEFAULT NULL COMMENT '组织ID',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  KEY `idx_org_id` (`org_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建角色表
CREATE TABLE IF NOT EXISTS `t_role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL COMMENT '角色代码',
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态',
  `sort` int DEFAULT '0' COMMENT '排序',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_code` (`code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 创建权限表
CREATE TABLE IF NOT EXISTS `t_permission` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL COMMENT '权限代码',
  `name` varchar(50) NOT NULL COMMENT '权限名称',
  `module` varchar(50) DEFAULT NULL COMMENT '模块',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_code` (`code`),
  KEY `idx_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 创建菜单表
CREATE TABLE IF NOT EXISTS `t_menu` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '菜单名称',
  `code` varchar(50) DEFAULT NULL COMMENT '菜单代码',
  `path` varchar(200) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(200) DEFAULT NULL COMMENT '组件路径',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标',
  `type` varchar(20) DEFAULT NULL COMMENT '类型',
  `parent_id` bigint unsigned DEFAULT NULL COMMENT '父菜单ID',
  `sort` int DEFAULT '0' COMMENT '排序',
  `hidden` tinyint(1) DEFAULT '0' COMMENT '是否隐藏',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态',
  `permissions` varchar(500) DEFAULT NULL COMMENT '权限标识',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_code` (`code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS `t_user_role` (
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS `t_role_permission` (
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- 创建资产表
CREATE TABLE IF NOT EXISTS `t_asset` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `asset_code` varchar(50) NOT NULL COMMENT '资产编码',
  `asset_name` varchar(100) NOT NULL COMMENT '资产名称',
  `street_id` bigint unsigned NOT NULL COMMENT '街道ID',
  `address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `land_nature` varchar(50) DEFAULT NULL COMMENT '土地性质',
  `total_area` decimal(10,2) DEFAULT NULL COMMENT '总面积',
  `rentable_area` decimal(10,2) DEFAULT NULL COMMENT '可租赁面积',
  `asset_tags` json DEFAULT NULL COMMENT '资产标签',
  `description` text COMMENT '描述',
  `status` varchar(20) DEFAULT 'normal' COMMENT '状态',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_asset_code` (`asset_code`),
  KEY `idx_asset_name` (`asset_name`),
  KEY `idx_street_id` (`street_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资产表';

-- 创建楼宇表
CREATE TABLE IF NOT EXISTS `t_building` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_code` varchar(50) NOT NULL COMMENT '楼宇编码',
  `building_name` varchar(100) NOT NULL COMMENT '楼宇名称',
  `asset_id` bigint unsigned NOT NULL COMMENT '资产ID',
  `building_type` varchar(50) DEFAULT NULL COMMENT '楼宇类型',
  `total_floors` int DEFAULT NULL COMMENT '总楼层数',
  `underground_floors` int DEFAULT NULL COMMENT '地下楼层数',
  `total_area` decimal(10,2) DEFAULT NULL COMMENT '总面积',
  `rentable_area` decimal(10,2) DEFAULT NULL COMMENT '可租赁面积',
  `construction_year` varchar(10) DEFAULT NULL COMMENT '建造年份',
  `elevator_count` int DEFAULT NULL COMMENT '电梯数量',
  `parking_spaces` int DEFAULT NULL COMMENT '停车位数量',
  `green_rate` decimal(5,2) DEFAULT NULL COMMENT '绿化率',
  `property_company` varchar(100) DEFAULT NULL COMMENT '物业公司',
  `property_phone` varchar(20) DEFAULT NULL COMMENT '物业电话',
  `features` json DEFAULT NULL COMMENT '配套设施',
  `description` text COMMENT '描述',
  `status` varchar(20) DEFAULT 'normal' COMMENT '状态',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_building_code` (`building_code`),
  KEY `idx_building_name` (`building_name`),
  KEY `idx_asset_id` (`asset_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='楼宇表';

-- 创建楼层表
CREATE TABLE IF NOT EXISTS `t_floor` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_id` bigint unsigned NOT NULL COMMENT '楼宇ID',
  `floor_number` int DEFAULT NULL COMMENT '楼层号',
  `floor_name` varchar(50) DEFAULT NULL COMMENT '楼层名称',
  `floor_area` decimal(10,2) DEFAULT NULL COMMENT '楼层面积',
  `rentable_area` decimal(10,2) DEFAULT NULL COMMENT '可租赁面积',
  `rented_area` decimal(10,2) DEFAULT NULL COMMENT '已租赁面积',
  `avg_rent_price` decimal(10,2) DEFAULT NULL COMMENT '平均租金',
  `occupancy_rate` decimal(5,2) DEFAULT NULL COMMENT '出租率',
  `description` text COMMENT '描述',
  `status` varchar(20) DEFAULT 'normal' COMMENT '状态',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_building_id` (`building_id`),
  KEY `idx_floor_number` (`floor_number`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='楼层表';

-- 创建房间表
CREATE TABLE IF NOT EXISTS `t_room` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `floor_id` bigint unsigned NOT NULL COMMENT '楼层ID',
  `room_number` varchar(50) DEFAULT NULL COMMENT '房间号',
  `room_type` varchar(50) DEFAULT NULL COMMENT '房间类型',
  `room_area` decimal(10,2) DEFAULT NULL COMMENT '房间面积',
  `rent_price` decimal(10,2) DEFAULT NULL COMMENT '租金',
  `decoration` varchar(50) DEFAULT NULL COMMENT '装修情况',
  `orientation` varchar(50) DEFAULT NULL COMMENT '朝向',
  `has_window` tinyint(1) DEFAULT '0' COMMENT '是否有窗',
  `has_ac` tinyint(1) DEFAULT '0' COMMENT '是否有空调',
  `description` text COMMENT '描述',
  `status` varchar(20) DEFAULT 'available' COMMENT '状态',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT '更新人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_floor_id` (`floor_id`),
  KEY `idx_room_number` (`room_number`),
  KEY `idx_room_type` (`room_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- 创建操作日志表
CREATE TABLE IF NOT EXISTS `t_operation_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `module` varchar(50) DEFAULT NULL COMMENT '模块',
  `operation` varchar(50) DEFAULT NULL COMMENT '操作',
  `method` varchar(10) DEFAULT NULL COMMENT '请求方法',
  `path` varchar(200) DEFAULT NULL COMMENT '请求路径',
  `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '用户代理',
  `params` text COMMENT '请求参数',
  `result` text COMMENT '响应结果',
  `status` int DEFAULT NULL COMMENT '状态码',
  `duration` bigint DEFAULT NULL COMMENT '耗时(ms)',
  `error` text COMMENT '错误信息',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_module` (`module`),
  KEY `idx_operation` (`operation`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 创建登录日志表
CREATE TABLE IF NOT EXISTS `t_login_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `login_type` varchar(20) DEFAULT NULL COMMENT '登录类型',
  `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `location` varchar(100) DEFAULT NULL COMMENT '登录地点',
  `device` varchar(100) DEFAULT NULL COMMENT '设备信息',
  `os` varchar(50) DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(50) DEFAULT NULL COMMENT '浏览器',
  `status` varchar(20) DEFAULT NULL COMMENT '状态',
  `message` varchar(200) DEFAULT NULL COMMENT '消息',
  `login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_username` (`username`),
  KEY `idx_status` (`status`),
  KEY `idx_login_time` (`login_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';

-- 插入默认组织
INSERT INTO `t_organization` (`id`, `name`, `code`, `type`, `parent_id`, `sort`, `status`) VALUES
(1, '总公司', 'HQ001', 'company', NULL, 1, 'active'),
(2, '技术部', 'TECH001', 'department', 1, 1, 'active'),
(3, '财务部', 'FIN001', 'department', 1, 2, 'active'),
(4, '行政部', 'ADMIN001', 'department', 1, 3, 'active');

-- 插入默认角色
INSERT INTO `t_role` (`id`, `code`, `name`, `description`, `status`, `sort`) VALUES
(1, 'admin', '超级管理员', '拥有所有权限', 'active', 1),
(2, 'asset_manager', '资产管理员', '负责资产管理相关操作', 'active', 2),
(3, 'viewer', '普通用户', '只有查看权限', 'active', 3);

-- 插入默认权限
INSERT INTO `t_permission` (`id`, `code`, `name`, `module`, `description`) VALUES
-- 资产管理权限
(1, 'asset:view', '查看资产', '资产管理', '查看资产列表和详情'),
(2, 'asset:create', '创建资产', '资产管理', '创建新资产'),
(3, 'asset:update', '更新资产', '资产管理', '编辑资产信息'),
(4, 'asset:delete', '删除资产', '资产管理', '删除资产'),
-- 楼宇管理权限
(5, 'building:view', '查看楼宇', '楼宇管理', '查看楼宇列表和详情'),
(6, 'building:create', '创建楼宇', '楼宇管理', '创建新楼宇'),
(7, 'building:update', '更新楼宇', '楼宇管理', '编辑楼宇信息'),
(8, 'building:delete', '删除楼宇', '楼宇管理', '删除楼宇'),
-- 系统管理权限
(9, 'user:view', '查看用户', '系统管理', '查看用户列表和详情'),
(10, 'user:create', '创建用户', '系统管理', '创建新用户'),
(11, 'user:update', '更新用户', '系统管理', '编辑用户信息'),
(12, 'user:delete', '删除用户', '系统管理', '删除用户'),
(13, 'role:view', '查看角色', '系统管理', '查看角色列表和详情'),
(14, 'role:create', '创建角色', '系统管理', '创建新角色'),
(15, 'role:update', '更新角色', '系统管理', '编辑角色信息'),
(16, 'role:delete', '删除角色', '系统管理', '删除角色'),
(17, 'log:view', '查看日志', '系统管理', '查看系统日志');

-- 插入默认菜单
INSERT INTO `t_menu` (`id`, `name`, `code`, `path`, `component`, `icon`, `type`, `parent_id`, `sort`, `hidden`, `status`) VALUES
(1, '仪表盘', 'dashboard', '/dashboard', 'Dashboard', 'DashboardOutlined', 'menu', NULL, 1, 0, 'active'),
(2, '资产管理', 'asset', '/asset', NULL, 'DatabaseOutlined', 'menu', NULL, 2, 0, 'active'),
(3, '资产列表', 'asset-list', '/asset/list', 'AssetList', NULL, 'menu', 2, 1, 0, 'active'),
(4, '楼宇管理', 'building', '/asset/building', 'Building', NULL, 'menu', 2, 2, 0, 'active'),
(5, '地图展示', 'map', '/map', 'Map', 'EnvironmentOutlined', 'menu', NULL, 3, 0, 'active'),
(6, '数据统计', 'statistics', '/statistics', 'Statistics', 'BarChartOutlined', 'menu', NULL, 4, 0, 'active'),
(7, '系统管理', 'system', '/system', NULL, 'SettingOutlined', 'menu', NULL, 5, 0, 'active'),
(8, '用户管理', 'user', '/system/user', 'UserManagement', NULL, 'menu', 7, 1, 0, 'active'),
(9, '角色管理', 'role', '/system/role', 'RoleManagement', NULL, 'menu', 7, 2, 0, 'active'),
(10, '组织管理', 'organization', '/system/organization', 'Organization', NULL, 'menu', 7, 3, 0, 'active'),
(11, '操作日志', 'log', '/system/log', 'OperationLog', NULL, 'menu', 7, 4, 0, 'active');

-- 插入默认用户（密码：admin123）
-- 注意：实际密码需要使用bcrypt加密，这里使用的是示例哈希值
INSERT INTO `t_user` (`id`, `username`, `password`, `name`, `phone`, `email`, `org_id`, `status`) VALUES
(1, 'admin', '$2a$10$EhW7pneqxREAb0L9z8Dj8OJHh6L8U9Dxwqj.vBPUzUxtSzqMmVpGy', '系统管理员', '13800138000', 'admin@example.com', 1, 'active');

-- 分配角色给用户
INSERT INTO `t_user_role` (`user_id`, `role_id`) VALUES
(1, 1); -- admin用户拥有超级管理员角色

-- 分配权限给角色
-- 超级管理员拥有所有权限
INSERT INTO `t_role_permission` (`role_id`, `permission_id`) 
SELECT 1, id FROM `t_permission`;

-- 资产管理员拥有资产相关权限
INSERT INTO `t_role_permission` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4),
(2, 5), (2, 6), (2, 7), (2, 8);

-- 普通用户只有查看权限
INSERT INTO `t_role_permission` (`role_id`, `permission_id`) VALUES
(3, 1), (3, 5);

-- 插入示例数据（可选）
-- 插入示例资产
INSERT INTO `t_asset` (`asset_code`, `asset_name`, `street_id`, `address`, `longitude`, `latitude`, `land_nature`, `total_area`, `status`) VALUES
('AST001', '科技园区A座', 1, '北京市海淀区中关村大街1号', 116.3267, 39.9804, '商业用地', 50000.00, 'normal'),
('AST002', '创新大厦', 1, '北京市海淀区知春路2号', 116.3289, 39.9756, '商业用地', 35000.00, 'normal');

-- 插入示例楼宇
INSERT INTO `t_building` (`building_code`, `building_name`, `asset_id`, `building_type`, `total_floors`, `underground_floors`, `total_area`, `status`) VALUES
('B001', 'A座主楼', 1, '办公楼', 20, 2, 30000.00, 'normal'),
('B002', 'B座副楼', 1, '办公楼', 15, 2, 20000.00, 'normal');

-- 提交事务
COMMIT;