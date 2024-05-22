import React, { useState } from 'react';
import { Form, Input, Select, Checkbox, Button, Drawer, Table, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductDetails = () => {
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');

  const categories = ['Electronics', 'Clothing', 'Books'];
  const products = {
    Electronics: ['TV', 'Laptop', 'Phone'],
    Clothing: ['Shirt', 'Pants', 'Jacket'],
    Books: ['Fiction', 'Non-Fiction', 'Comics'],
  };
  const sizes = ['Small', 'Medium', 'Large'];

  const handleFinish = (values) => {
    if (editingKey !== null) {
      const newData = dataSource.map((item) => (item.key === editingKey ? { ...values, key: editingKey } : item));
      setDataSource(newData);
      setEditingKey(null);
    } else {
      const newData = [...dataSource, { ...values, key: Date.now() }];
      setDataSource(newData);
    }
    form.resetFields();
    setDrawerVisible(false);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setDrawerVisible(true);
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSearch = () => {
    // Implement search logic based on form values
    console.log('Search values:', form.getFieldsValue(['searchCategory', 'searchProduct']));
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (active ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this item?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form layout="inline" style={{ marginBottom: 16 }} form={form}>
        <Form.Item name="searchCategory" label="Category">
          <Select placeholder="Select Category" showSearch style={{ width: 200 }}>
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="searchProduct" label="Product">
          <Select placeholder="Select Product" style={{ width: 200 }}>
            {products.Electronics.map((product) => (
                <Option key={product} value={product}>
                  {product}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Form.Item>
      </Form>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)} style={{ marginBottom: 16 }}>
        Create New Product
      </Button>

      <Table
        dataSource={dataSource.filter((item) =>
          Object.values(item).some((val) => val.toString().toLowerCase().includes(searchText.toLowerCase()))
        )}
        columns={columns}
        rowKey="key"
      />

      <Drawer
        title={editingKey === null ? 'Add New Product' : 'Edit Product'}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select Category">
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: 'Please select a product!' }]}
          >
            <Select placeholder="Select Product">
              {products.Electronics.map((product) => (
                  <Option key={product} value={product}>
                    {product}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="size"
            label="Size"
            rules={[{ required: true, message: 'Please select a size!' }]}
          >
            <Select placeholder="Select Size">
              {sizes.map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter the price!' },
              { pattern: /^[0-9]+$/, message: 'Please enter a valid price!' },
            ]}
          >
            <Input placeholder="Enter Price" />
          </Form.Item>

          <Form.Item
            name="active"
            valuePropName="checked"
          >
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
