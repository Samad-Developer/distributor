import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Brand = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brands, setBrands] = useState([
    // Sample data
    { id: 1, vendorName: 'Vendor 1', brandName: 'Brand 1' },
    { id: 2, vendorName: 'Vendor 2', brandName: 'Brand 2' },
  ]);
  const [filteredBrands, setFilteredBrands] = useState(brands)

  const showDrawer = (brand = null) => {
    setEditingBrand(brand);
    setDrawerVisible(true);
    if (brand) {
      form.setFieldsValue(brand);
    } else {
      form.resetFields();
    }
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (values) => {
    if (values) {
      console.log('Search Values: ', values);
      const searchBrands = brands.filter(brand => {
        return (!values.vendorName || brand.vendorName === values.vendorName) &&
          (!values.brandName || brand.brandName.toLowerCase().includes(values.brandName.toLowerCase()));
      });
      setFilteredBrands(searchBrands);
    } else {
      setFilteredBrands(brands)
    }
  };

  const onFinish = (values) => {
    if (editingBrand) {
      
        const updatedBrands = brands.map((item) =>
          item.id === editingBrand.id ? { ...item, ...values } : item
        )
        setBrands(updatedBrands)
        setFilteredBrands(updatedBrands)
      
      message.success('Brand updated successfully');
    } else {
      const newBrand = {...values}
      setFilteredBrands([...brands, newBrand])
      setBrands([...brands, newBrand])
      message.success('Brand created successfully');
    }
    setDrawerVisible(false);
  };

  const handleDelete = (id) => {
    const deletedBrands = brands.filter((item) => item.id !== id);
    setFilteredBrands(deletedBrands)
    setBrands(deletedBrands)
    message.success('Brand deleted successfully');
  };

  const columns = [
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="large">
          <EditOutlined onClick={() => showDrawer(record)} style={{ cursor: 'pointer', color: 'blue' }} />
          <Popconfirm title="Are you sure to delete this Brand ?" onConfirm={() => handleDelete(record.id)}>
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
            <Form.Item name="vendorName" label="Vendor">
              <Select placeholder="Select Vendor" showSearch optionFilterProp="children">
                <Option value="Vendor 1">Vendor 1</Option>
                <Option value="Vendor 2">Vendor 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="brandName" label="Brand Name">
              <Input placeholder="Enter Brand Name" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined/>} htmlType="submit" style={{ marginTop: '30px' }}>Search</Button>
            </Form.Item>
          </Col>
          <Col >
            <Form.Item>
              <Button type="default" onClick={() => {
                searchForm.resetFields();
              }} style={{ marginTop: '30px' }}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>


      <div className='flex justify-end'>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()} style={{ margin: '20px 0' }}>
          Create New Brand
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredBrands} rowKey="id" pagination={{ pageSize: 5 }}/>

      <Drawer
        title={editingBrand ? "Edit Brand" : "Create New Brand"}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="vendorName"
            label="Vendor"
            rules={[{ required: true, message: 'Please select a vendor' }]}
          >
            <Select placeholder="Select Vendor">
              <Option value="Vendor 1">Vendor 1</Option>
              <Option value="Vendor 2">Vendor 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[{ required: true, message: 'Please enter brand name' }]}
          >
            <Input placeholder="Enter Brand Name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBrand ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Brand;
