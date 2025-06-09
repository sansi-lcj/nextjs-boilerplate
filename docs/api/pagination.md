# API 分页规范

## 概述

本文档定义了楼宇资产管理平台 API 的分页规范，所有返回列表数据的接口都应遵循此规范。

## 分页参数

### 请求参数

分页参数通过 URL 查询字符串传递：

| 参数名 | 类型 | 必填 | 默认值 | 说明 | 示例 |
|--------|------|------|--------|------|------|
| page | integer | 否 | 1 | 页码，从1开始 | page=1 |
| pageSize | integer | 否 | 20 | 每页条数 | pageSize=20 |
| sort | string | 否 | -createTime | 排序字段和方向 | sort=-createTime |
| filter | object | 否 | - | 过滤条件 | filter[status]=active |

### 参数限制

- `page`: 最小值为 1
- `pageSize`: 最小值为 1，最大值为 100
- 超出限制将返回参数错误

### 排序规则

排序参数格式：`[+|-]fieldName`
- `+` 或无符号：升序排序
- `-`：降序排序
- 多字段排序：用逗号分隔，如 `sort=-createTime,+name`

## 分页响应

### 响应格式

所有分页接口都返回统一的响应格式：

```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "资产1",
        "createTime": "2024-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 响应字段说明

**data.items**
- 类型：Array
- 说明：当前页的数据列表

**data.pagination**
- `page`: 当前页码
- `pageSize`: 每页条数
- `total`: 总记录数
- `totalPages`: 总页数

## 使用示例

### 基础分页请求

**请求**：
```http
GET /api/v1/assets?page=2&pageSize=10
Authorization: Bearer <token>
```

**响应**：
```json
{
  "code": 20000,
  "message": "获取成功",
  "data": {
    "items": [
      {
        "id": 11,
        "assetCode": "IT-2024-0011",
        "assetName": "ThinkPad笔记本",
        "assetType": "IT设备",
        "purchaseDate": "2024-01-15",
        "assetValue": 8500.00,
        "status": "在用",
        "createTime": "2024-01-15T09:30:00Z"
      },
      // ... 更多数据
    ],
    "pagination": {
      "page": 2,
      "pageSize": 10,
      "total": 156,
      "totalPages": 16
    }
  }
}
```

### 带排序的分页

**请求**：
```http
GET /api/v1/assets?page=1&pageSize=20&sort=-assetValue,+createTime
```

说明：按资产价值降序排序，价值相同时按创建时间升序排序

### 带过滤的分页

**请求**：
```http
GET /api/v1/assets?page=1&pageSize=20&filter[status]=在用&filter[assetType]=IT设备
```

**复杂过滤条件**：
```http
GET /api/v1/assets?page=1&pageSize=20&filter[assetValue][$gte]=10000&filter[assetValue][$lte]=50000
```

### 过滤操作符

| 操作符 | 说明 | 示例 |
|--------|------|------|
| $eq | 等于（默认） | filter[status][$eq]=active 或 filter[status]=active |
| $ne | 不等于 | filter[status][$ne]=deleted |
| $gt | 大于 | filter[price][$gt]=100 |
| $gte | 大于等于 | filter[price][$gte]=100 |
| $lt | 小于 | filter[price][$lt]=1000 |
| $lte | 小于等于 | filter[price][$lte]=1000 |
| $in | 包含在列表中 | filter[status][$in]=active,pending |
| $nin | 不在列表中 | filter[status][$nin]=deleted,archived |
| $like | 模糊匹配 | filter[name][$like]=%笔记本% |
| $between | 区间查询 | filter[createTime][$between]=2024-01-01,2024-12-31 |

## 前端实现示例

### React Hooks 实现

```typescript
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';

interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  filter?: Record<string, any>;
}

interface PaginationResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

function usePagination<T>(url: string, initialParams?: Partial<PaginationParams>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    ...initialParams
  });

  const fetchData = useCallback(async (params?: Partial<PaginationParams>) => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...params
      };

      const response = await axios.get<{
        code: number;
        data: PaginationResponse<T>;
      }>(url, { params: queryParams });

      if (response.data.code === 20000) {
        setData(response.data.data.items);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [url, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changePage = (page: number, pageSize?: number) => {
    fetchData({ page, pageSize });
  };

  const refresh = () => {
    fetchData();
  };

  return {
    data,
    loading,
    pagination,
    changePage,
    refresh
  };
}

// 使用示例
function AssetList() {
  const { data, loading, pagination, changePage } = usePagination<Asset>(
    '/api/v1/assets',
    { pageSize: 50 }
  );

  return (
    <Table
      dataSource={data}
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: changePage,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
    />
  );
}
```

### 高级分页组件

```typescript
import React, { useState } from 'react';
import { Table, Input, Select, DatePicker, Space } from 'antd';
import type { TableProps } from 'antd';

interface AdvancedTableProps<T> extends TableProps<T> {
  apiUrl: string;
  searchFields?: Array<{
    field: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'dateRange';
    options?: Array<{ label: string; value: any }>;
  }>;
}

function AdvancedTable<T extends { id: number }>({
  apiUrl,
  searchFields = [],
  columns,
  ...tableProps
}: AdvancedTableProps<T>) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorter, setSorter] = useState<string>('-createTime');
  
  const { data, loading, pagination, changePage, refresh } = usePagination<T>(
    apiUrl,
    { 
      filter: filters,
      sort: sorter
    }
  );

  const handleSearch = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    changePage(1); // 搜索时回到第一页
  };

  const handleTableChange: TableProps<T>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    // 处理排序
    if (sorter && !Array.isArray(sorter)) {
      const order = sorter.order === 'descend' ? '-' : '+';
      setSorter(`${order}${sorter.field}`);
    }
    
    // 处理分页
    changePage(pagination.current || 1, pagination.pageSize);
  };

  return (
    <div>
      {/* 搜索栏 */}
      <Space style={{ marginBottom: 16 }}>
        {searchFields.map(field => (
          <div key={field.field}>
            {field.type === 'text' && (
              <Input.Search
                placeholder={field.label}
                onSearch={(value) => handleSearch(field.field, value)}
                style={{ width: 200 }}
              />
            )}
            {field.type === 'select' && (
              <Select
                placeholder={field.label}
                onChange={(value) => handleSearch(field.field, value)}
                style={{ width: 200 }}
                allowClear
              >
                {field.options?.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        ))}
      </Space>

      {/* 表格 */}
      <Table<T>
        {...tableProps}
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
```

## 后端实现指南

### Go Gin 实现示例

```go
// 分页请求结构
type PaginationRequest struct {
    Page     int               `form:"page,default=1" binding:"min=1"`
    PageSize int               `form:"pageSize,default=20" binding:"min=1,max=100"`
    Sort     string            `form:"sort"`
    Filter   map[string]string `form:"filter"`
}

// 分页响应结构
type PaginationResponse struct {
    Items      interface{} `json:"items"`
    Pagination Pagination  `json:"pagination"`
}

type Pagination struct {
    Page       int `json:"page"`
    PageSize   int `json:"pageSize"`
    Total      int `json:"total"`
    TotalPages int `json:"totalPages"`
}

// 分页辅助函数
func Paginate(db *gorm.DB, req *PaginationRequest) *gorm.DB {
    offset := (req.Page - 1) * req.PageSize
    return db.Offset(offset).Limit(req.PageSize)
}

// 解析排序参数
func ParseSort(sort string) (string, string) {
    if sort == "" {
        return "created_at", "DESC"
    }
    
    if strings.HasPrefix(sort, "-") {
        return sort[1:], "DESC"
    } else if strings.HasPrefix(sort, "+") {
        return sort[1:], "ASC"
    }
    
    return sort, "ASC"
}

// 控制器示例
func GetAssets(c *gin.Context) {
    var req PaginationRequest
    if err := c.ShouldBindQuery(&req); err != nil {
        response.Error(c, 40001, "参数错误", err.Error())
        return
    }
    
    // 构建查询
    query := db.Model(&model.Asset{})
    
    // 应用过滤条件
    if status, ok := req.Filter["status"]; ok {
        query = query.Where("status = ?", status)
    }
    if assetType, ok := req.Filter["assetType"]; ok {
        query = query.Where("asset_type = ?", assetType)
    }
    
    // 获取总数
    var total int64
    query.Count(&total)
    
    // 应用排序
    field, order := ParseSort(req.Sort)
    query = query.Order(fmt.Sprintf("%s %s", field, order))
    
    // 应用分页
    var assets []model.Asset
    query = Paginate(query, &req)
    if err := query.Find(&assets).Error; err != nil {
        response.Error(c, 50001, "查询失败", err.Error())
        return
    }
    
    // 构建响应
    totalPages := int(math.Ceil(float64(total) / float64(req.PageSize)))
    
    response.Success(c, PaginationResponse{
        Items: assets,
        Pagination: Pagination{
            Page:       req.Page,
            PageSize:   req.PageSize,
            Total:      int(total),
            TotalPages: totalPages,
        },
    })
}
```

## 性能优化

### 1. 索引优化

确保对常用的排序和过滤字段建立索引：

```sql
-- 为常用查询字段创建索引
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_create_time ON assets(created_at);
CREATE INDEX idx_assets_composite ON assets(status, asset_type, created_at);
```

### 2. 查询优化

```go
// 只查询需要的字段
query = query.Select("id", "asset_code", "asset_name", "status", "created_at")

// 预加载关联数据
query = query.Preload("Building").Preload("Room")

// 使用子查询优化计数
var total int64
countQuery := db.Model(&model.Asset{}).Where(conditions)
go countQuery.Count(&total) // 并行执行计数查询
```

### 3. 缓存策略

```go
// 缓存分页结果
cacheKey := fmt.Sprintf("assets:page:%d:size:%d:sort:%s", req.Page, req.PageSize, req.Sort)
if cached, err := redis.Get(cacheKey); err == nil {
    c.JSON(200, cached)
    return
}

// 查询数据库...

// 缓存结果（设置适当的过期时间）
redis.Set(cacheKey, response, 5*time.Minute)
```

### 4. 游标分页（大数据集）

对于超大数据集，可以使用游标分页替代偏移分页：

```go
type CursorPaginationRequest struct {
    Cursor   string `form:"cursor"`
    PageSize int    `form:"pageSize,default=20"`
}

func GetAssetsWithCursor(c *gin.Context) {
    var req CursorPaginationRequest
    c.ShouldBindQuery(&req)
    
    query := db.Model(&model.Asset{})
    
    // 解析游标
    if req.Cursor != "" {
        decoded, _ := base64.StdEncoding.DecodeString(req.Cursor)
        lastID, _ := strconv.Atoi(string(decoded))
        query = query.Where("id > ?", lastID)
    }
    
    // 查询数据
    var assets []model.Asset
    query.Order("id ASC").Limit(req.PageSize + 1).Find(&assets)
    
    // 判断是否有下一页
    hasMore := len(assets) > req.PageSize
    if hasMore {
        assets = assets[:req.PageSize]
    }
    
    // 生成下一页游标
    var nextCursor string
    if hasMore && len(assets) > 0 {
        lastAsset := assets[len(assets)-1]
        nextCursor = base64.StdEncoding.EncodeToString(
            []byte(strconv.Itoa(lastAsset.ID))
        )
    }
    
    c.JSON(200, gin.H{
        "items":      assets,
        "nextCursor": nextCursor,
        "hasMore":    hasMore,
    })
}
```

## 最佳实践

1. **合理的默认值**：默认每页20条，最大100条
2. **总数查询优化**：使用缓存或估算值避免每次都 COUNT
3. **避免深度分页**：限制最大页数或使用游标分页
4. **字段投影**：只返回需要的字段
5. **并发控制**：对耗时查询加锁或限流
6. **监控告警**：监控慢查询和大分页请求