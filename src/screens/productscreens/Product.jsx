import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { initialProduct, getData } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

const { Option } = Select;

const Product = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState();
  const [filteredProducts, setFilteredProducts] = useState();

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchProducts = async () => {
    try {
      const data = await initialProduct();
      // console.log('iniital brand is comming', data)
      setProducts(data.DataSet.Table);
      setFilteredProducts(data.DataSet.Table);

    } catch (error) {
      console.error('Error fetching Product data:', error);
      openMessage('error', 'There was an error fetching the Product data.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const payload = {
    "OperationId": 1,
    "ProductId": null,
    "ProductName": null,
    "CategoryId": null,
    "UserId": 1,
    "UserIP": null
  }
  
  const url = "SetupProduct"

  const onFinish = async values => {

    const { productName } = values;
    const payloadToUse = {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      ProductName: productName,
      ProductId: isEditing ? editingProduct.ProductId : null,
    }
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Product added/updated successfully!');
          const updatedProductData = data.DataSet.Table1;
          setProducts(updatedProductData);
          setFilteredProducts(updatedProductData);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Product.');
        }
      } catch (error) {
        console.error('Error fetching Product data:', error);
        openMessage('error', 'There was an error adding/updating the Product.');
      }
    };
    fetchData();
    onClose();
  };

  const showDrawer = (product = null) => {
    setIsEditing(false)
    setDrawerVisible(true);
    form.resetFields();
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

  const onEditProduct = product => {
   
    setIsEditing(true);
    setEditingProduct(product);
    console.log("the current product category id is ", product.CategoryId)
    form.setFieldsValue({
      productName: product.ProductName,
      categoryName: product.CategoryId
    });
    setDrawerVisible(true);
  };

  const handleDelete = (record) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      ProductId: record.ProductId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Product deleted successfully!');
          const updatedProducts = data.DataSet.Table1;
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error deleting the Product.');
        }
      } catch (error) {
        openMessage('error', 'There was an error deleting the Product');
      }
    };
    fetchData();
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'CategoryId',
      key: 'CategoryId',
    },
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      key: 'ProductName',
    },
    // {
    //   title: 'Is Active',
    //   dataIndex: 'IsActive',
    //   key: 'IsActive',
    //   render: isActive => (isActive ? 'Yes' : 'No')
    // },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space >
          <Button icon={<EditOutlined />} onClick={() => onEditProduct(record)} />
          <Popconfirm title="Are you sure to delete this Product ?" onConfirm={() => handleDelete(record)}>
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
            <Form.Item name="categoryName"  label="Category">
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
              <Button type="primary" className='bg-[#4F46E5]' htmlType="submit" icon={<SearchOutlined />}>Search</Button>
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
      <RoundButton
          onClick={() => showDrawer()}
        />
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" />

      <Drawer
        title={isEditing ? "Edit Product" : "Create New Product"}
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
          {/* <Form.Item
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Is Active</Checkbox>
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className='w-full '>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Product;

