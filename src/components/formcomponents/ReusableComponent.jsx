import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ReusableComponent = ({ entityName, fields, data, setData }) => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const showDrawer = (item = null) => {
    setEditingItem(item);
    setDrawerVisible(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (values) => {
    const searchData = data.filter(item => {
      return fields.every(field => {
        const value = values[field.name];
        if (!value) return true;
        if (field.type === 'text') {
          return item[field.name].toLowerCase().includes(value.toLowerCase());
        } else {
          return item[field.name] === value;
        }
      });
    });
    setFilteredData(searchData);
  };

  const onFinish = (values) => {
    if (editingItem) {
      const updatedData = data.map((item) =>
        item.id === editingItem.id ? { ...item, ...values } : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      message.success(`${entityName} updated successfully`);
    } else {
      const newItem = { ...values, id: data.length + 1 };
      setData([...data, newItem]);
      setFilteredData([...data, newItem]);
      message.success(`${entityName} created successfully`);
    }
    setDrawerVisible(false);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
    message.success(`${entityName} deleted successfully`);
  };

  const columns = fields.map(field => ({
    title: field.label,
    dataIndex: field.name,
    key: field.name,
    render: field.render || null
  })).concat({
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="large">
        <EditOutlined onClick={() => showDrawer(record)} style={{ cursor: 'pointer', color: 'blue' }} />
        <Popconfirm title={`Are you sure to delete this ${entityName}?`} onConfirm={() => handleDelete(record.id)}>
          <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
        </Popconfirm>
      </Space>
    )
  });

  return (
    <div style={{ padding: '20px' }}>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          {fields.filter(field => field.searchable).map(field => (
            <Col span={6} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                {field.type === 'select' ? (
                  <Select placeholder={`Select ${field.label}`} showSearch optionFilterProp="children">
                    {field.options.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                ) : (
                  <Input placeholder={`Enter ${field.label}`} />
                )}
              </Form.Item>
            </Col>
          ))}
          <Col>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit" style={{ marginTop: '30px' }}>
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="default" onClick={() => searchForm.resetFields()} style={{ marginTop: '30px' }}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className='flex justify-end'>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()} style={{ margin: '20px 0' }}>
          Create New {entityName}
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 5 }} />

      <Drawer
        title={editingItem ? `Edit ${entityName}` : `Create New ${entityName}`}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {fields.map(field => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: field.required, message: `Please enter ${field.label.toLowerCase()}` }]}
            >
              {field.type === 'select' ? (
                <Select placeholder={`Select ${field.label}`}>
                  {field.options.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              ) : field.type === 'checkbox' ? (
                <Checkbox>{field.label}</Checkbox>
              ) : (
                <Input placeholder={`Enter ${field.label}`} />
              )}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingItem ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ReusableComponent;
