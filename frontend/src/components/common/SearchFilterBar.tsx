import React from 'react';
import { Card, Row, Col, Input, Select, DatePicker, Button, Space, Form } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import './SearchFilterBar.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export interface FilterField {
  key: string;
  label: string;
  type: 'search' | 'select' | 'date' | 'dateRange';
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  allowClear?: boolean;
  style?: React.CSSProperties;
  span?: number; // 栅格列数，默认为6
}

interface SearchFilterBarProps {
  fields: FilterField[];
  values: Record<string, any>;
  onSearch: (values: Record<string, any>) => void;
  onReset: () => void;
  loading?: boolean;
  showResetButton?: boolean;
  collapseCount?: number; // 默认显示的字段数量，超过则折叠
  className?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  fields,
  values,
  onSearch,
  onReset,
  loading = false,
  showResetButton = true,
  collapseCount = 3,
  className = '',
}) => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = React.useState(true);

  const visibleFields = collapsed ? fields.slice(0, collapseCount) : fields;
  const hasMore = fields.length > collapseCount;

  React.useEffect(() => {
    form.setFieldsValue(values);
  }, [values, form]);

  const handleSearch = () => {
    const formValues = form.getFieldsValue();
    onSearch(formValues);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleFieldChange = () => {
    // 实时搜索或延迟搜索可以在这里实现
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'search':
        return (
          <Search
            placeholder={field.placeholder || `请输入${field.label}`}
            allowClear
            onSearch={handleSearch}
            style={field.style}
          />
        );
        
      case 'select':
        return (
          <Select
            placeholder={field.placeholder || `请选择${field.label}`}
            allowClear={field.allowClear !== false}
            onChange={handleFieldChange}
            style={{ width: '100%', ...field.style }}
          >
            {field.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
        
      case 'date':
        return (
          <DatePicker
            placeholder={field.placeholder || `请选择${field.label}`}
            allowClear={field.allowClear !== false}
            onChange={handleFieldChange}
            style={{ width: '100%', ...field.style }}
          />
        );
        
      case 'dateRange':
        return (
          <RangePicker
            placeholder={['开始时间', '结束时间']}
            allowClear={field.allowClear !== false}
            onChange={handleFieldChange}
            style={{ width: '100%', ...field.style }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className={`search-filter-bar ${className}`} bordered={false}>
      <Form
        form={form}
        layout="vertical"
        initialValues={values}
        onValuesChange={handleFieldChange}
      >
        <Row gutter={[16, 16]} align="bottom">
          {visibleFields.map((field) => (
            <Col key={field.key} span={field.span || 6}>
              <Form.Item
                name={field.key}
                label={field.label}
                className="filter-form-item"
              >
                {renderField(field)}
              </Form.Item>
            </Col>
          ))}
          
          {/* 操作按钮 */}
          <Col span={hasMore ? 6 : Math.max(24 - visibleFields.length * (visibleFields[0]?.span || 6), 6)}>
            <Form.Item className="filter-actions">
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
                >
                  搜索
                </Button>
                {showResetButton && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                )}
                {hasMore && (
                  <Button
                    type="link"
                    onClick={() => setCollapsed(!collapsed)}
                    className="collapse-btn"
                  >
                    {collapsed ? '展开' : '收起'}
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchFilterBar; 