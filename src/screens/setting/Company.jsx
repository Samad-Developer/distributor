import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Drawer, Table, Space, Select, message, Row, Col, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { initialCompany, getData } from '../../services/mainApp.service';

const { Option } = Select;
const { Title } = Typography;

const Company = () => {
  const [searchForm] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filteredcompanies, setFilteredcompanies] = useState([]);
  const [editingCompany, seteditingCompany] = useState(null);

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchCustomers = async () => {
    try {
      const data = await initialCompany();
      setCompanies(data.DataSet.Table);
      setFilteredcompanies(data.DataSet.Table);
    } catch (error) {
      console.error('Error fetching location data:', error);
      openMessage('error', 'There was an error fetching the customer data.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const payload = {
    OperationId: 2,
    CompanyId: null,
    CompanyName: null,
    ContactNo: null,
    Email: null,
    Fax: null,
    NTN: null,
    Address: null,
    UserId: 1,
    UserIP: null,
  };

  const url = 'SetupCompany';

  const showDrawer = () => {
    setIsEditing(false);
    seteditingCompany(null);
    drawerForm.resetFields();
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const onSearch = ({ companyName, faxNo, ntnNo }) => {
    const filteredData = companies.filter((company) => {
      return (
        (!companyName || company.CompanyName.toLowerCase().includes(companyName.toLowerCase())) &&
        (!faxNo || company.Fax === faxNo) &&
        (!ntnNo || company.NTN === ntnNo)
      );
    });
  
    setFilteredcompanies(filteredData);
  };
  
  const onFinish = async (values) => {
    const { address, companyName, contactNo, emailId, faxNo, ntnNo } = values;

    const payloadToUse = {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      CompanyId: isEditing ? editingCompany.CompanyId : null,
      CompanyName: companyName,
      ContactNo: contactNo,
      Email: emailId,
      Fax: faxNo,
      NTN: ntnNo,
      Address: address,
    };

    console.log('Payload to use:', payloadToUse); // Log the payload here

    try {
      const data = await getData(url, payloadToUse);
      if (data.Response) {
        openMessage('success', data.DataSet.Table[0].Message || 'Company added/updated successfully!');
        const updatedCompanyData = data.DataSet.Table;
        setCompanies(updatedCompanyData);
        setFilteredcompanies(updatedCompanyData);
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Company.');
      }
    } catch (error) {
      console.error('Error fetching Customer data:', error);
      openMessage('error', 'There was an error adding/updating the Company.');
    }

    onCloseDrawer();
  };

  const onEditCompany = (company) => {
    setIsEditing(true);
    seteditingCompany(company);
    drawerForm.setFieldsValue({
      companyName: company.CompanyName,
      contactNo: company.ContactNo,
      faxNo: company.Fax,
      emailId: company.Email,
      address: company.Address,
      ntnNo: company.NTN,
    });
    setDrawerVisible(true);
  };

  const onDeleteCompany = (customer) => {
    const updatedcompanies = companies.filter((c) => c.CompanyId !== customer.CompanyId);
    setCompanies(updatedcompanies);
    setFilteredcompanies(updatedcompanies);
    message.success('Customer deleted successfully');
  };

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'CompanyName',
      key: 'CompanyName',
    },
    {
      title: 'Contact No',
      dataIndex: 'ContactNo',
      key: 'ContactNo',
    },
    {
      title: 'Fax No',
      dataIndex: 'Fax',
      key: 'Fax',
    },
    {
      title: 'Email Id',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title: 'NTN No',
      dataIndex: 'NTN',
      key: 'NTN',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEditCompany(record)} />
          <Popconfirm
            title="Are you sure to delete this Company?"
            onConfirm={() => onDeleteCompany(record)}
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
    <div style={{ padding: '5px' }}>
      <Title level={3}>Company Management</Title>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '0px' }}>
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item name="companyName" label="Company Name">
              <Input placeholder="Enter Company Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="faxNo" label="Fax No">
              <Input placeholder="Enter Fax No" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ntnNo" label="NTN No">
              <Input placeholder="Enter NTN No" />
            </Form.Item>
          </Col>
          <Col className="mt-[30px]">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col className="mt-[30px]">
            <Form.Item>
              <Button
                type="default"
                onClick={() => {
                  searchForm.resetFields();
                  setFilteredcompanies(companies);
                }}
              >
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showDrawer}
          style={{ marginBottom: '20px' }}
        >
          Create New Company
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredcompanies} rowKey="CompanyId" />

      <Drawer
        title={isEditing ? 'Edit Company' : 'Create a New Company'}
        width={720}
        onClose={onCloseDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={drawerForm} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="Enter Company Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactNo"
                label="Contact No"
                rules={[{ required: true, message: 'Please enter contact number' }]}
              >
                <Input placeholder="Enter Contact No" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="faxNo"
                label="Fax No"
                rules={[{ required: true, message: 'Please enter fax number' }]}
              >
                <Input placeholder="Enter Fax No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emailId"
                label="Email Id"
                rules={[{ required: true, message: 'Please enter email ID' }]}
              >
                <Input placeholder="Enter Email ID" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ntnNo"
                label="NTN No"
                rules={[{ required: true, message: 'Please enter NTN number' }]}
              >
                <Input placeholder="Enter NTN No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Enter Address" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           

              <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                {isEditing ? 'Update' : 'Submit'}
              </Button>
          
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default Company;
