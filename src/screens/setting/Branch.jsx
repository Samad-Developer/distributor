import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Drawer, Checkbox, Table, Space, Select, message, Row, Col, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const Branch = () => {
  const [searchForm] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filteredcompanies, setFilteredcompanies] = useState([]);
  const [editingCompany, seteditingCompany] = useState(null);

  // Function to fetch companies (you should replace this with your API call)
  const fetchcompanies = async () => {
    // Dummy data for illustration
    const data = [
      {
        key: '1',
        company: 'Solar Electronic',
        contactNo: '0987654321',
        faxNo: '1234567890',
        emailId: 'abdussamadkotha@gmail.com',
        address: '123 Street',
        branch: 'NTN123',
      },
      // Add more dummy data as needed
    ];
    setCompanies(data);
    setFilteredcompanies(data);
  };

  useEffect(() => {
    fetchcompanies();
  }, []);

  const showDrawer = () => {
    setIsEditing(false);
    seteditingCompany(null);
    drawerForm.resetFields();
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const onSearch = values => {
    const filteredData = companies.filter(customer => {
      return Object.keys(values).every(key => {
        if (!values[key]) return true;
        if (typeof customer[key] === 'string') {
          console.log('checking the customer is it  array or object',customer[key])
          return customer[key].toLowerCase().includes(values[key].toLowerCase());
        }
        return customer[key] === values[key];
      });
    });
    setFilteredcompanies(filteredData);
  };

  const onFinish = async values => {
    if (isEditing) {
      // Handle update customer logic (you should replace this with your API call)
      const updatedcompanies = companies.map(customer =>
        customer.key === editingCompany.key ? { ...customer, ...values } : customer
      );
      setCompanies(updatedcompanies);
      setFilteredcompanies(updatedcompanies);
      message.success('Branch updated successfully');
    } else {
      // Handle create new customer logic (you should replace this with your API call)
      const newCustomer = { ...values, key: Date.now().toString() };
      setCompanies([...companies, newCustomer]);
      setFilteredcompanies([...companies, newCustomer]);
      message.success('Branch created successfully');
    }
    onCloseDrawer();
  };

  const onEditCompany = customer => {
    setIsEditing(true);
    seteditingCompany(customer);
    drawerForm.setFieldsValue(customer);
    setDrawerVisible(true);
  };

  const onDeleteCompany = customer => {
    const updatedcompanies = companies.filter(c => c.key !== customer.key);
    setCompanies(updatedcompanies);
    setFilteredcompanies(updatedcompanies);
    message.success('Branch deleted successfully');
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Contact No',
      dataIndex: 'contactNo',
      key: 'contactNo',
    },
    {
      title: 'Fax No',
      dataIndex: 'faxNo',
      key: 'faxNo',
    },
    {
      title: 'Email Id',
      dataIndex: 'emailId',
      key: 'emailId',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEditCompany(record)}>

          </Button>
          <Popconfirm
            title="Are you sure to delete this Branch?"
            onConfirm={() => onDeleteCompany(record)}
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
      <Title level={3}>Branch Management</Title>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '00px' }}>
        <Row gutter={10}>
          <Col span={6}>
          <Form.Item
                name="company"
                label="Company"
              >
                <Select placeholder="Select area">
                  <Option value="Area 1">company 1</Option>
                  <Option value="Area 2">company 2</Option>
                  <Option value="Area 3">company 3</Option>
                </Select>
              </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="branch" label="Branch">
              <Input placeholder="Enter branch" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="faxNo" label="faxNo">
              <Input placeholder="faxNo" />
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
                setFilteredcompanies(companies);
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
          Create New Company
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredcompanies} pagination={{ pageSize: 5 }} />

      <Drawer
        title={isEditing ? 'Edit Branch' : 'Create New Branch'}
        width={720}
        onClose={onCloseDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={drawerForm} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="company"
                label="Company"
                rules={[{ required: true, message: 'Please company' }]}
              >
                <Select placeholder="Select area">
                  <Option value="Area 1">company 1</Option>
                  <Option value="Area 2">company 2</Option>
                  <Option value="Area 3">company 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="branch"
                label="Branch"
                rules={[{ required: true, message: 'Please branch' }]}
              >
                <Input placeholder="Enter branch" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactNo"
                label="Contact No"
                rules={[{ required: true, message: 'Please enter contact no' }]}
              >
                <Input placeholder="Enter contact no" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="faxNo"
                label="Fax No"
                rules={[{ required: true, message: 'Please enter fax no' }]}
              >
                <Input placeholder="Enter fax no" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emailId"
                label="Email Id"
              >
                <Input placeholder="Enter email Id" />
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
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditing ? 'Update Branch' : 'Create Branch'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Branch;
