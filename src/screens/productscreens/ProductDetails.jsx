import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, Select, Checkbox, Row, Col, Space, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ProductDetails = () => {


  const mockProducts = [
    {
      id: 1,
      category: 'Category1',
      product: 'Product1',
      size: 'Small',
      price: 10.0,
      isActive: true,
    },
    {
      id: 2,
      category: 'Category2',
      product: 'Product2',
      size: 'Medium',
      price: 20.0,
      isActive: false,
    },
    {
      id: 3,
      category: 'Category1',
      product: 'Product3',
      size: 'Large',
      price: 30.0,
      isActive: true,
    },
  ];

  const [products, setProducts] = useState(mockProducts);
  const [searchFilters, setSearchFilters] = useState({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  

  const handleSearch = (values) => {
    setSearchFilters(values);
    // Implement search functionality here
  };

  const handleReset = () => {
    form.resetFields();
    setSearchFilters({});
    // Reset search functionality here
  };

  const showDrawer = (product = null) => {
    setCurrentProduct(product);
    form.setFieldsValue(product);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setCurrentProduct(null);
    form.resetFields();
    setDrawerVisible(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (currentProduct) {
        // Update existing product
        await axios.put(`/api/products/${currentProduct.id}`, values);
        message.success('Product updated successfully');
      } else {
        // Create new product
        await axios.post('/api/products', values);
        message.success('Product created successfully');
      }
      fetchProducts();
      closeDrawer();
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (isActive) => (isActive ? 'Yes' : 'No') },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showDrawer(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Product Details</h1>
      <Form layout="inline" onFinish={handleSearch} form={form}>
        <Form.Item name="category">
          <Select placeholder="Category" style={{ width: 150 }}>
            <Option value="Category1">Category1</Option>
            <Option value="Category2">Category2</Option>
          </Select>
        </Form.Item>
        <Form.Item name="product">
          <Select placeholder="Product" style={{ width: 150 }}>
            <Option value="Product1">Product1</Option>
            <Option value="Product2">Product2</Option>
          </Select>
        </Form.Item>
        <Form.Item name="size">
          <Select placeholder="Size" style={{ width: 150 }}>
            <Option value="Small">Small</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Large">Large</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }} onClick={() => showDrawer()}>
        Create New Product Details
      </Button>
      <Table columns={columns} dataSource={products} rowKey="id" style={{ marginTop: 16 }} />

      <Drawer
        title={currentProduct ? 'Edit Product Details' : 'Create New Product Details'}
        width={480}
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Category">
              <Option value="Category1">Category1</Option>
              <Option value="Category2">Category2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="product" label="Product" rules={[{ required: true, message: 'Please select a product' }]}>
            <Select placeholder="Product">
              <Option value="Product1">Product1</Option>
              <Option value="Product2">Product2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="size" label="Size" rules={[{ required: true, message: 'Please select a size' }]}>
            <Select placeholder="Size">
              <Option value="Small">Small</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Large">Large</Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price' }]}>
            <Input type="number" placeholder="Price" />
          </Form.Item>
          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductDetails;
