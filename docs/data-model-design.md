# 楼宇资产管理平台数据模型设计

## 数据模型概述

本文档描述楼宇资产管理平台的核心数据模型设计，包括资产管理、系统管理相关的实体、属性和关系。

## 核心实体模型

### 1. 资产管理相关

#### 1.1 资产（Asset）
```sql
Asset {
    id: bigint (PK)
    asset_code: varchar(50) -- 资产编号
    asset_name: varchar(100) -- 资产名称
    street_id: bigint (FK) -- 所属街道
    address: varchar(200) -- 载体地址
    longitude: decimal(10,7) -- 经度
    latitude: decimal(10,7) -- 纬度
    land_nature: varchar(50) -- 土地性质
    total_area: decimal(10,2) -- 建筑总面积
    rentable_area: decimal(10,2) -- 可出租面积
    asset_tags: varchar(500) -- 资产标签（JSON）
    asset_images: text -- 资产图片（JSON）
    description: text -- 资产描述
    use_date: date -- 使用日期
    status: varchar(20) -- 状态（正常/停用）
    created_by: bigint -- 创建人
    created_at: datetime -- 创建时间
    updated_by: bigint -- 更新人
    updated_at: datetime -- 更新时间
}
```

#### 1.2 楼宇（Building）
```sql
Building {
    id: bigint (PK)
    asset_id: bigint (FK) -- 所属资产
    building_code: varchar(50) -- 楼宇编号
    building_name: varchar(100) -- 楼宇名称
    building_short_name: varchar(50) -- 楼宇简称
    building_type: varchar(20) -- 类型（园区/独栋）
    investor: varchar(100) -- 载体投资主体
    location: varchar(200) -- 坐落
    total_area: decimal(10,2) -- 建筑面积
    rentable_area: decimal(10,2) -- 可出租面积
    building_height: decimal(6,2) -- 建筑高度
    floor_count: int -- 楼层数量
    building_tags: varchar(500) -- 楼宇标签
    building_images: text -- 楼宇图片
    description: text -- 楼宇描述
    build_date: date -- 建成日期
    status: varchar(20) -- 状态（正常/停用/装修）
    created_by: bigint
    created_at: datetime
    updated_by: bigint
    updated_at: datetime
}
```

#### 1.3 楼层（Floor）
```sql
Floor {
    id: bigint (PK)
    building_id: bigint (FK) -- 所属楼宇
    floor_code: varchar(50) -- 楼层编号
    floor_name: varchar(50) -- 楼层名称
    floor_number: int -- 楼层号
    total_area: decimal(10,2) -- 建筑面积
    rentable_area: decimal(10,2) -- 可出租面积
    floor_type: varchar(50) -- 楼层类型
    floor_plan: varchar(500) -- 平面图URL
    remark: text -- 备注
    status: varchar(20) -- 状态（正常/装修/停用）
    created_by: bigint
    created_at: datetime
    updated_by: bigint
    updated_at: datetime
}
```

#### 1.4 房间（Room）
```sql
Room {
    id: bigint (PK)
    floor_id: bigint (FK) -- 所属楼层
    room_code: varchar(50) -- 房间编号
    room_number: varchar(20) -- 房间号
    area: decimal(10,2) -- 面积
    room_type: varchar(50) -- 房间类型
    room_status: varchar(20) -- 状态（空置/已租/装修/自用）
    position: varchar(100) -- 区域位置
    asset_ownership: varchar(50) -- 资产权属
    remark: text -- 备注
    created_by: bigint
    created_at: datetime
    updated_by: bigint
    updated_at: datetime
}
```

### 2. 系统管理相关

#### 2.1 组织机构（Organization）
```sql
Organization {
    id: bigint (PK)
    parent_id: bigint -- 上级机构
    org_code: varchar(50) -- 机构编号（GS+信用代码后六位）
    org_name: varchar(100) -- 机构名称
    org_type: varchar(20) -- 机构类型
    contact_person: varchar(50) -- 联系人
    contact_phone: varchar(20) -- 联系电话
    address: varchar(200) -- 机构地址
    sort_order: int -- 排序号
    status: varchar(20) -- 状态
    created_at: datetime
    updated_at: datetime
}
```

#### 2.2 用户（User）
```sql
User {
    id: bigint (PK)
    username: varchar(50) -- 用户名（唯一）
    password: varchar(255) -- 密码（加密）
    real_name: varchar(50) -- 真实姓名
    org_id: bigint (FK) -- 所属机构
    phone: varchar(20) -- 手机号码
    email: varchar(100) -- 电子邮箱
    status: varchar(20) -- 账号状态
    last_login_time: datetime -- 最后登录时间
    last_login_ip: varchar(50) -- 最后登录IP
    created_at: datetime
    updated_at: datetime
}
```

#### 2.3 角色（Role）
```sql
Role {
    id: bigint (PK)
    role_code: varchar(50) -- 角色编码
    role_name: varchar(100) -- 角色名称
    role_type: varchar(20) -- 角色类型
    data_scope: varchar(20) -- 数据权限范围（全部/本级/本级及以下）
    description: text -- 角色描述
    status: varchar(20) -- 状态
    created_at: datetime
    updated_at: datetime
}
```

#### 2.4 菜单（Menu）
```sql
Menu {
    id: bigint (PK)
    parent_id: bigint -- 上级菜单
    menu_name: varchar(100) -- 菜单名称
    menu_type: varchar(20) -- 类型（目录/菜单/按钮）
    menu_icon: varchar(100) -- 图标
    menu_path: varchar(200) -- 路径
    component: varchar(200) -- 组件
    permission: varchar(100) -- 权限标识
    sort_order: int -- 排序号
    visible: boolean -- 是否显示
    status: varchar(20) -- 状态
    created_at: datetime
    updated_at: datetime
}
```

#### 2.5 数据字典（Dictionary）
```sql
Dictionary {
    id: bigint (PK)
    parent_id: bigint -- 上级字典
    dict_type: varchar(50) -- 字典类型
    dict_name: varchar(100) -- 字典名称
    dict_code: varchar(50) -- 字典编码
    dict_value: varchar(200) -- 字典值
    sort_order: int -- 排序号
    remark: text -- 备注
    status: varchar(20) -- 状态
    created_at: datetime
    updated_at: datetime
}
```

### 3. 日志相关

#### 3.1 登录日志（LoginLog）
```sql
LoginLog {
    id: bigint (PK)
    user_id: bigint -- 用户ID
    username: varchar(50) -- 用户名
    login_time: datetime -- 登录时间
    login_ip: varchar(50) -- 登录IP
    login_location: varchar(100) -- 登录地点
    browser: varchar(100) -- 浏览器
    os: varchar(100) -- 操作系统
    login_status: varchar(20) -- 登录状态（成功/失败）
    msg: varchar(500) -- 消息
}
```

#### 3.2 操作日志（OperationLog）
```sql
OperationLog {
    id: bigint (PK)
    user_id: bigint -- 操作用户ID
    username: varchar(50) -- 操作用户名
    operation_module: varchar(100) -- 操作模块
    operation_type: varchar(20) -- 操作类型（增/删/改/查/导入/导出）
    operation_object: varchar(200) -- 操作对象
    operation_content: text -- 操作内容
    operation_time: datetime -- 操作时间
    operation_ip: varchar(50) -- 操作IP
    operation_result: varchar(20) -- 操作结果（成功/失败）
    error_msg: text -- 错误信息
}
```

## 关系模型

### 主要关联关系
1. **资产-楼宇**：一对多关系，一个资产可包含多栋楼宇
2. **楼宇-楼层**：一对多关系，一栋楼宇包含多个楼层
3. **楼层-房间**：一对多关系，一个楼层包含多个房间
4. **组织-用户**：一对多关系，一个组织包含多个用户
5. **用户-角色**：多对多关系，通过中间表关联
6. **角色-菜单**：多对多关系，通过中间表关联

### 关联表

#### 用户角色关联（UserRole）
```sql
UserRole {
    user_id: bigint (FK)
    role_id: bigint (FK)
    PRIMARY KEY (user_id, role_id)
}
```

#### 角色菜单关联（RoleMenu）
```sql
RoleMenu {
    role_id: bigint (FK)
    menu_id: bigint (FK)
    PRIMARY KEY (role_id, menu_id)
}
```

## 数据库设计原则

1. **规范化**：遵循数据库第三范式，避免数据冗余
2. **索引优化**：为常用查询字段建立索引（如：编号、名称、状态）
3. **数据完整性**：使用外键约束保证引用完整性
4. **扩展性**：预留扩展字段，使用JSON存储灵活数据
5. **审计追踪**：所有表包含创建人、创建时间、更新人、更新时间
6. **软删除**：使用状态字段实现逻辑删除，保留历史数据

## 索引设计建议

### 资产表索引
- asset_code（唯一索引）
- asset_name
- street_id
- status

### 楼宇表索引
- building_code（唯一索引）
- building_name
- asset_id
- status

### 用户表索引
- username（唯一索引）
- phone
- org_id
- status

### 日志表索引
- user_id + operation_time（组合索引）
- operation_module
- operation_type