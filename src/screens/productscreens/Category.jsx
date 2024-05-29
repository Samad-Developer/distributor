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
    const filteredCategories = categories.filter(category => {
      return (!values.categoryName || category.CategoryName.toLowerCase().includes(values.categoryName.toLowerCase()));
    });
    setFilteredCategories(filteredCategories);
  };

  const onFinish = (values) => {
    const { categoryName } = values;
    const payloadToUse = {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      CategoryName: categoryName,
      CategoryId: isEditing ? editingCategory.CategoryId : null,
    }
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Category added/updated successfully!');
          const updatedCategoryData = data.DataSet.Table1;
          setCategories(updatedCategoryData);
          setFilteredCategories(updatedCategoryData);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Category.');
        }
      } catch (error) {
        console.error('Error fetching Category data:', error);
        openMessage('error', 'There was an error adding/updating the Category.');
      }
    };
    fetchData();
    onClose();
  };

  const handleDelete = (category) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      CategoryId: category.CategoryId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Category deleted successfully!');
          const updatedCategory = data.DataSet.Table1;
          setCategories(updatedCategory);
          setFilteredCategories(updatedCategory);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error deleting the Category.');
        }
      } catch (error) {
        openMessage('error', 'There was an error deleting the Category');
      }
    };
    fetchData();
  };

  const onEditCategory = category => {
    setIsEditing(true);
    setEditingCategory(category);
    form.setFieldsValue({
      categoryName: category.CategoryName,
    });
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      key: 'CategoryName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEditCategory(record)} />
          <Popconfirm
            title="Are you sure to delete this Category ?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
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
                setFilteredCategories(categories);
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

      <Table columns={columns} dataSource={filteredCategories} rowKey="id" />

      <Drawer
        title={editingCategory ? "Edit Category" : "Create New Category"}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
