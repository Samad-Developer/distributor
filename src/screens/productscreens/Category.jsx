import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Category = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([
    // Sample data
    { id: 1, brandName: 'Brand 1', categoryName: 'Category 1' },
    { id: 2, brandName: 'Brand 2', categoryName: 'Category 2' },
  ]);

  const showDrawer = (category = null) => {
    setEditingCategory(category);
    setDrawerVisible(true);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (values) => {
    console.log('Search Values: ', values);
    const filteredCategories = categories.filter(category => {
      return (!values.brandName || category.brandName === values.brandName) &&
        (!values.categoryName || category.categoryName.toLowerCase().includes(values.categoryName.toLowerCase()));
    });
    setCategories(filteredCategories);
  };

  const onFinish = (values) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingCategory.id ? { ...item, ...values } : item
        )
      );
      message.success('Category updated successfully');
    } else {
      setCategories((prev) => [
        ...prev,
        { ...values, id: prev.length + 1 },
      ]);
      message.success('Category created successfully');
    }
    setDrawerVisible(false);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
    message.success('Category deleted successfully');
  };

  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="large">
          <EditOutlined onClick={() => showDrawer(record)} style={{ cursor: 'pointer', color: 'blue' }} />
          <Popconfirm title="Are you sure to delete this Category ?" onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="brandName" label="Brand">
              <Select placeholder="Select Brand">
                <Option value="Brand 1">Brand 1</Option>
                <Option value="Brand 2">Brand 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="categoryName" label="Category Name">
              <Input placeholder="Enter Category Name" />
            </Form.Item>
          </Col>
          <Col span={6} style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>Search</Button>
            </Form.Item>
            <Form.Item style={{ marginLeft: '10px' }}>
              <Button type="default" onClick={() => {
                searchForm.resetFields();
                setCategories([
                  { id: 1, brandName: 'Brand 1', categoryName: 'Category 1' },
                  { id: 2, brandName: 'Brand 2', categoryName: 'Category 2' },
                ]);
              }}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className='flex justify-end'>
        <Button type="primary" onClick={() => showDrawer()} style={{ marginBottom: '20px' }} icon={<PlusOutlined />}>
          Create New Category
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="id" />

      <Drawer
        title={editingCategory ? "Edit Category" : "Create New Category"}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="brandName"
            label="Brand"
            rules={[{ required: true, message: 'Please select a brand' }]}
          >
            <Select placeholder="Select Brand">
              <Option value="Brand 1">Brand 1</Option>
              <Option value="Brand 2">Brand 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter Category Name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Category;
