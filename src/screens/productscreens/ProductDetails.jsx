import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, Popconfirm, Select, Checkbox, Row, Col, Space, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { initialProductDetail, getData } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

const { Option } = Select;

const ProductDetails = () => {

  const [products, setProducts] = useState();
  const [searchFilters, setSearchFilters] = useState({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditing, setIsEditing] = useState();
  const [filteredProducts, setFilteredProducts] = useState()
  const [form] = Form.useForm();

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchProducts = async () => {
    try {
      const data = await initialProductDetail();
      setProducts(data.DataSet.Table);
      setFilteredProducts(data.DataSet.Table);
      // setCategoriesForProduct(data.DataSet.Table1);
    } catch (error) {
      console.error('Error fetching ProductDetails data:', error);
      openMessage('error', 'There was an error fetching the ProductDetails data.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const payload = {
    "OperationId": 1,
    "ProductId": null,
    "ProductDetailId": null,
    "SizeId": null,
    "BrandId": null,
    "UserId": 1,
    "UserIP": null,
    "Amount": null
  };

  const url = "SetupProductDetail";

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
    { title: 'Category', dataIndex: 'CategoryName', key: 'CategoryName' },
    { title: 'Product', dataIndex: 'ProductName', key: 'ProductName' },
    { title: 'Size', dataIndex: 'SizeName', key: 'SizeName' },
    { title: 'Price', dataIndex: 'Amount', key: 'Amount' },
    {
      title: 'Brand',
      dataIndex: 'BrandName',
      key: 'BrandName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space >
          <Button icon={<EditOutlined />} onClick={() => onEditProductDetail(record)} />
          <Popconfirm title="Are you sure to delete this ProductDetails ?" onConfirm={() => handleDelete(record)}>
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form layout="vertical" onFinish={handleSearch} form={form}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="category" label="Category">
              <Select placeholder="Category" style={{ width: '100%' }}>
                <Option value="Category1">Category1</Option>
                <Option value="Category2">Category2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="product" label="Product">
              <Select placeholder="Product" style={{ width: '100%' }}>
                <Option value="Product1">Product1</Option>
                <Option value="Product2">Product2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="size" label="Size">
              <Select placeholder="Size" style={{ width: '100%' }}>
                <Option value="Small">Small</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Large">Large</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className='mt-[30px]'>
            <Form.Item>
              <Button className='bg-[#4F46E5]' type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col className='mt-[30px]'>
            <Form.Item>
              <Button onClick={handleReset}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className='flex justify-end'>
        <RoundButton onClick={() => showDrawer()} />
      </div>

      <Table columns={columns} dataSource={filteredProducts} rowKey="id" style={{ marginTop: 16 }} />

      <Drawer
        title={isEditing ? 'Edit Product Details' : 'Create New Product Details'}
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
            <Button type="primary" htmlType="submit" className='w-full'>
              {isEditing ? 'Updated' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductDetails;
