import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Product = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([
    // Sample data
    { id: 1, categoryName: 'Category 1', productName: 'Product 1', isActive: true },
    { id: 2, categoryName: 'Category 2', productName: 'Product 2', isActive: false },
  ]);

  const showDrawer = (product = null) => {
    setEditingProduct(product);
    setDrawerVisible(true);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (values) => {
    console.log('Search Values: ', values);
    const filteredProducts = products.filter(product => {
      return (!values.categoryName || product.categoryName === values.categoryName) &&
        (!values.productName || product.productName.toLowerCase().includes(values.productName.toLowerCase()));
    });
    setProducts(filteredProducts);
  };

  const onFinish = (values) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id ? { ...item, ...values } : item
        )
      );
      message.success('Product updated successfully');
    } else {
      setProducts((prev) => [
        ...prev,
        { ...values, id: prev.length + 1 },
      ]);
      message.success('Product created successfully');
    }
    setDrawerVisible(false);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    message.success('Product deleted successfully');
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: isActive => (isActive ? 'Yes' : 'No')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="large">
          <EditOutlined onClick={() => showDrawer(record)} style={{ cursor: 'pointer', color: 'blue' }} />
          <Popconfirm title="Are you sure to delete this Product ?" onConfirm={() => handleDelete(record.id)}>
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
            <Form.Item name="categoryName" label="Category">
              <Select placeholder="Select Category">
                <Option value="Category 1">Category 1</Option>
                <Option value="Category 2">Category 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="productName" label="Product Name">
              <Input placeholder="Enter Product Name" />
            </Form.Item>
          </Col>
          <Col span={6} style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>Search</Button>
            </Form.Item>
            <Form.Item style={{ marginLeft: '10px' }}>
              <Button type="default" onClick={() => {
                searchForm.resetFields();
                setProducts([
                  { id: 1, categoryName: 'Category 1', productName: 'Product 1', isActive: true },
                  { id: 2, categoryName: 'Category 2', productName: 'Product 2', isActive: false },
                ]);
              }}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className='flex justify-end'>
        <Button type="primary" onClick={() => showDrawer()} style={{ marginBottom: '20px' }}>
          Create New Product
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" />

      <Drawer
        title={editingProduct ? "Edit Product" : "Create New Product"}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="categoryName"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select Category">
              <Option value="Category 1">Category 1</Option>
              <Option value="Category 2">Category 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter Product Name" />
          </Form.Item>
          <Form.Item
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Is Active</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Product;
