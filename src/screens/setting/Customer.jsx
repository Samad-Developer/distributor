import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Drawer, Checkbox, Table, Space, Select, message, Row, Col, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const Customer = () => {
  const [searchForm] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Function to fetch customers (you should replace this with your API call)
  const fetchCustomers = async () => {
    // Dummy data for illustration
    const data = [
      {
        key: '1',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        contact1: '1234567890',
        contact2: '0987654321',
        area: 'Area 1',
        address: '123 Street',
        ntnNo: 'NTN123',
        isActive: true,
        creditDays: 30,
      },
      {
        key: '1',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        contact1: '1234567890',
        contact2: '0987654321',
        area: 'Area 1',
        address: '123 Street',
        ntnNo: 'NTN123',
        isActive: true,
        creditDays: 30,
      },
      {
        key: '1',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        contact1: '1234567890',
        contact2: '0987654321',
        area: 'Area 1',
        address: '123 Street',
        ntnNo: 'NTN123',
        isActive: true,
        creditDays: 30,
      },
      {
        key: '1',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        contact1: '1234567890',
        contact2: '0987654321',
        area: 'Area 1',
        address: '123 Street',
        ntnNo: 'NTN123',
        isActive: true,
        creditDays: 30,
      },
      {
        key: '1',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        contact1: '1234567890',
        contact2: '0987654321',
        area: 'Area 1',
        address: '123 Street',
        ntnNo: 'NTN123',
        isActive: true,
        creditDays: 30,
      },
      {
        key: '1',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        contact1: '1234567890',
        contact2: '0987654321',
        area: 'Area 1',
        address: '123 Street',
        ntnNo: 'NTN123',
        isActive: true,
        creditDays: 30,
      },
      // Add more dummy data as needed
    ];
    setCustomers(data);
    setFilteredCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showDrawer = () => {
    setIsEditing(false);
    setEditingCustomer(null);
    drawerForm.resetFields();
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const onSearch = values => {
    console.log('checking the seachf', values)
    const filteredData = customers.filter(customer => {
      return Object.keys(values).every(key => {
        if (!values[key]) return true;
        if (typeof customer[key] === 'string') {
          return customer[key].toLowerCase().includes(values[key].toLowerCase());
        }
        return customer[key] === values[key];
      });
    });
    setFilteredCustomers(filteredData);
  };

  const onFinish = async values => {
    if (isEditing) {
      // Handle update customer logic (you should replace this with your API call)
      const updatedCustomers = customers.map(customer =>
        customer.key === editingCustomer.key ? { ...customer, ...values } : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      message.success('Customer updated successfully');
    } else {
      // Handle create new customer logic (you should replace this with your API call)
      const newCustomer = { ...values, key: Date.now().toString() };
      setCustomers([...customers, newCustomer]);
      setFilteredCustomers([...customers, newCustomer]);
      message.success('Customer created successfully');
    }
    onCloseDrawer();
  };

  const onEditCustomer = customer => {
    setIsEditing(true);
    setEditingCustomer(customer);
    drawerForm.setFieldsValue(customer);
    setDrawerVisible(true);
  };

  const onDeleteCustomer = customer => {
    const updatedCustomers = customers.filter(c => c.key !== customer.key);
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    message.success('Customer deleted successfully');
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Contact 1',
      dataIndex: 'contact1',
      key: 'contact1',
    },
    {
      title: 'Contact 2',
      dataIndex: 'contact2',
      key: 'contact2',
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'NTN No',
      dataIndex: 'ntnNo',
      key: 'ntnNo',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: isActive => (isActive ? 'Yes' : 'No'),
    },
    {
      title: 'Credit Days',
      dataIndex: 'creditDays',
      key: 'creditDays',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditCustomer(record)}>

          </Button>
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => onDeleteCustomer(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger>

            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '5px' }}>
      <Title level={3}>Customer Management</Title>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '00px' }}>
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item name="area" label="Area">
              <Input placeholder="Enter area" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="customerName" label="Customer Name">
              <Input placeholder="Enter customer name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="contactPerson" label="Contact Person">
              <Input placeholder="Enter contact person" />
            </Form.Item>
          </Col>
          <Col className='mt-[30px]'>
            <Form.Item>
              <Button type="primary" htmlType="submit">Search</Button>
            </Form.Item>
          </Col>
          {/* Uncomment the reset button if needed */}
          <Col className='mt-[30px]'>
            <Form.Item>
              <Button type="default" onClick={() => {
                searchForm.resetFields();
                setFilteredCustomers(customers);
              }}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className='flex justify-end'>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showDrawer}
          style={{ marginBottom: '20px' }}
        >
          Create New Customer
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredCustomers} pagination={{ pageSize: 5 }} />

      <Drawer
        title={isEditing ? 'Edit Customer' : 'Create New Customer'}
        width={720}
        onClose={onCloseDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={drawerForm} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="Contact Person"
                rules={[{ required: true, message: 'Please enter contact person' }]}
              >
                <Input placeholder="Enter contact person" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contact1"
                label="Contact 1"
                rules={[{ required: true, message: 'Please enter contact 1' }]}
              >
                <Input placeholder="Enter contact 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact2"
                label="Contact 2"
              >
                <Input placeholder="Enter contact 2" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area"
                label="Area"
                rules={[{ required: true, message: 'Please select area' }]}
              >
                <Select placeholder="Select area">
                  <Option value="Area 1">Area 1</Option>
                  <Option value="Area 2">Area 2</Option>
                  <Option value="Area 3">Area 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ntnNo"
                label="NTN No"
              >
                <Input placeholder="Enter NTN No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                valuePropName="checked"
                label="Is Active"
              >
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="creditDays"
                label="Credit Days"
                rules={[{ required: true, message: 'Please enter credit days' }]}
              >
                <Input placeholder="Enter credit days" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditing ? 'Update Customer' : 'Create Customer'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Customer;
