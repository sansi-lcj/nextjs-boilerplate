# 楼宇管理平台数据模型设计

## 数据模型概述

本文档描述楼宇管理平台的核心数据模型设计，包括主要实体、属性和关系。

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
    status: varchar(20) -- 状态
    created_at: datetime
    updated_at: datetime
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
    rental_index: varchar(100) -- 租赁指标
    building_tags: varchar(500) -- 楼宇标签
    building_images: text -- 楼宇图片
    description: text -- 楼宇描述
    use_date: date -- 使用日期
    status: varchar(20)
    created_at: datetime
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
    status: varchar(20)
    created_at: datetime
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
    room_status: varchar(20) -- 状态（空置/已租/装修等）
    position: varchar(100) -- 区域位置
    asset_ownership: varchar(50) -- 资产权属
    created_at: datetime
    updated_at: datetime
}
```

### 2. 企业管理相关

#### 2.1 企业信息（Enterprise）
```sql
Enterprise {
    id: bigint (PK)
    enterprise_code: varchar(50) -- 企业编号
    enterprise_name: varchar(200) -- 企业名称
    unified_social_credit_code: varchar(50) -- 统一社会信用代码
    legal_person: varchar(50) -- 法人代表
    registered_capital: decimal(15,2) -- 注册资本
    establishment_date: date -- 成立日期
    enterprise_type: varchar(50) -- 企业类型
    industry_id: bigint (FK) -- 所属行业
    business_scope: text -- 经营范围
    registered_address: varchar(500) -- 注册地址
    contact_person: varchar(50) -- 联系人
    contact_phone: varchar(20) -- 联系电话
    employee_count: int -- 员工数量
    is_blacklist: boolean -- 是否黑名单
    tags: text -- 标签（JSON）
    status: varchar(20)
    created_at: datetime
    updated_at: datetime
}
```

#### 2.2 企业画像（EnterpriseProfile）
```sql
EnterpriseProfile {
    id: bigint (PK)
    enterprise_id: bigint (FK) -- 企业ID
    revenue_scale: decimal(15,2) -- 营收规模
    tax_contribution: decimal(15,2) -- 税收贡献
    growth_rate: decimal(5,2) -- 增长率
    innovation_level: varchar(20) -- 创新能力等级
    credit_rating: varchar(20) -- 信用评级
    risk_level: varchar(20) -- 风险等级
    development_potential: varchar(20) -- 发展潜力
    social_responsibility: varchar(20) -- 社会责任
    last_update_date: date
    created_at: datetime
    updated_at: datetime
}
```

#### 2.3 企业分类（EnterpriseCategory）
```sql
EnterpriseCategory {
    id: bigint (PK)
    parent_id: bigint -- 上级分类
    category_name: varchar(100) -- 分类名称
    category_code: varchar(50) -- 分类编码
    category_type: varchar(50) -- 分类类型
    sort_order: int -- 排序
    status: varchar(20)
    created_at: datetime
    updated_at: datetime
}
```

### 3. 租赁管理相关

#### 3.1 租赁合同（LeaseContract）
```sql
LeaseContract {
    id: bigint (PK)
    contract_no: varchar(50) -- 合同编号
    enterprise_id: bigint (FK) -- 企业ID
    building_id: bigint (FK) -- 楼宇ID
    room_ids: text -- 房间ID列表（JSON）
    lease_area: decimal(10,2) -- 租赁面积
    lease_price: decimal(10,2) -- 租赁单价
    total_amount: decimal(15,2) -- 租金总额
    payment_method: varchar(50) -- 收费方式
    payment_cycle: varchar(50) -- 收款周期
    lease_start_date: date -- 租赁开始日期
    lease_end_date: date -- 租赁结束日期
    contract_file: varchar(500) -- 合同文件
    recruit_year: int -- 招引年份
    status: varchar(20) -- 状态（生效/到期/终止）
    created_at: datetime
    updated_at: datetime
}
```

#### 3.2 租金账单（RentBill）
```sql
RentBill {
    id: bigint (PK)
    bill_no: varchar(50) -- 账单编号
    contract_id: bigint (FK) -- 合同ID
    enterprise_id: bigint (FK) -- 企业ID
    bill_period: varchar(20) -- 账期
    bill_amount: decimal(15,2) -- 应收金额
    paid_amount: decimal(15,2) -- 实收金额
    bill_date: date -- 账单日期
    due_date: date -- 到期日期
    payment_date: date -- 付款日期
    payment_status: varchar(20) -- 支付状态
    remark: text
    created_at: datetime
    updated_at: datetime
}
```

### 4. 能耗管理相关

#### 4.1 能耗设备（EnergyDevice）
```sql
EnergyDevice {
    id: bigint (PK)
    device_code: varchar(50) -- 设备编号
    device_name: varchar(100) -- 设备名称
    device_type: varchar(20) -- 设备类型（水表/电表/燃气表）
    asset_id: bigint (FK) -- 所属资产
    building_id: bigint (FK) -- 所属楼宇
    account_no: varchar(50) -- 账户编号
    owner: varchar(100) -- 表具所属主体
    status: varchar(20) -- 状态
    created_at: datetime
    updated_at: datetime
}
```

#### 4.2 能耗数据（EnergyData）
```sql
EnergyData {
    id: bigint (PK)
    device_id: bigint (FK) -- 设备ID
    period: varchar(20) -- 所属月份
    last_reading_date: datetime -- 上次抄表时间
    last_reading: decimal(10,2) -- 上次读数
    current_reading_date: datetime -- 本次抄表时间
    current_reading: decimal(10,2) -- 本次读数
    usage: decimal(10,2) -- 用量
    reader: varchar(50) -- 抄表人
    created_at: datetime
    updated_at: datetime
}
```

### 5. 系统管理相关

#### 5.1 组织机构（Organization）
```sql
Organization {
    id: bigint (PK)
    parent_id: bigint -- 上级机构
    org_code: varchar(50) -- 机构编号
    org_name: varchar(100) -- 机构名称
    contact_person: varchar(50) -- 联系人
    contact_phone: varchar(20) -- 联系电话
    sort_order: int
    status: varchar(20)
    created_at: datetime
    updated_at: datetime
}
```

#### 5.2 用户（User）
```sql
User {
    id: bigint (PK)
    username: varchar(50) -- 用户名
    password: varchar(255) -- 密码（加密）
    real_name: varchar(50) -- 真实姓名
    org_id: bigint (FK) -- 所属机构
    phone: varchar(20) -- 电话
    email: varchar(100) -- 邮箱
    status: varchar(20)
    last_login_time: datetime
    created_at: datetime
    updated_at: datetime
}
```

#### 5.3 角色（Role）
```sql
Role {
    id: bigint (PK)
    role_code: varchar(50) -- 角色编码
    role_name: varchar(100) -- 角色名称
    org_id: bigint (FK) -- 所属部门
    data_scope: varchar(20) -- 数据权限范围
    status: varchar(20)
    created_at: datetime
    updated_at: datetime
}
```

#### 5.4 菜单（Menu）
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
    sort_order: int
    status: varchar(20)
    created_at: datetime
    updated_at: datetime
}
```

### 6. 预警消息相关

#### 6.1 预警规则（AlertRule）
```sql
AlertRule {
    id: bigint (PK)
    rule_name: varchar(100) -- 规则名称
    rule_type: varchar(50) -- 规则类型
    condition_expression: text -- 条件表达式
    threshold_value: varchar(100) -- 阈值
    alert_level: varchar(20) -- 预警级别
    message_template: text -- 消息模板
    target_roles: text -- 推送角色（JSON）
    status: varchar(20)
    created_at: datetime
    updated_at: datetime
}
```

#### 6.2 预警记录（AlertRecord）
```sql
AlertRecord {
    id: bigint (PK)
    rule_id: bigint (FK) -- 规则ID
    alert_type: varchar(50) -- 预警类型
    alert_content: text -- 预警内容
    related_id: bigint -- 关联ID
    related_type: varchar(50) -- 关联类型
    alert_time: datetime -- 预警时间
    read_status: varchar(20) -- 阅读状态
    handle_status: varchar(20) -- 处理状态
    handle_user_id: bigint -- 处理人
    handle_time: datetime -- 处理时间
    handle_remark: text -- 处理备注
    created_at: datetime
}
```

## 关系模型

### 主要关联关系
1. **资产-楼宇**：一对多关系，一个资产可包含多栋楼宇
2. **楼宇-楼层**：一对多关系，一栋楼宇包含多个楼层
3. **楼层-房间**：一对多关系，一个楼层包含多个房间
4. **企业-租赁合同**：一对多关系，一个企业可有多份合同
5. **租赁合同-租金账单**：一对多关系，一份合同产生多个账单
6. **用户-角色**：多对多关系，通过中间表关联
7. **角色-菜单**：多对多关系，通过中间表关联

### 关联表示例

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
2. **索引优化**：为常用查询字段建立索引
3. **数据完整性**：使用外键约束保证引用完整性
4. **扩展性**：预留扩展字段，使用JSON存储灵活数据
5. **审计追踪**：所有表包含创建时间和更新时间
6. **软删除**：使用状态字段实现逻辑删除