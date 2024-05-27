import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { initialCategory, getData } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

const { Option } = Select;

const Category = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState();
  const [filteredCategories, setFilteredCategories] = useState();

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchCategory = async () => {
    try {
      const data = await initialCategory();
      // console.log('iniital brand is comming', data)
      setCategories(data.DataSet.Table);
      setFilteredCategories(data.DataSet.Table);

    } catch (error) {
      console.error('Error fetching Categories data:', error);
      openMessage('error', 'There was an error fetching the Categories data.');
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const payload = {
    "OperationId": 1,
    "CategoryId": null,
    "CategoryName": null,
    "UserId": 1,
    "UserIP": null
}
  const url = "SetupCategory"

  const showDrawer = () => {
    setIsEditing(false);
    setDrawerVisible(true);
    form.resetFields()
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (values) => {
    console.log('Search Values: ', values);
    const filteredCategories = categories.filter(category => {
      return (!values.brandName || category.BrandName === values.brandName) &&
        (!values.categoryName || category.CategoryName.toLowerCase().includes(values.categoryName.toLowerCase()));
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
    <div >
      <Form form={searchForm} layout="vertical" onFinish={onSearch}>
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
              <Button type="primary" className='bg-[#4F46E5]' htmlType="submit" icon={<SearchOutlined/>}>Search</Button>
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
      <RoundButton
          onClick={() => showDrawer()}
        />
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
