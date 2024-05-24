import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Drawer, Checkbox, Table, Space, Select, message, Row, Col, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getData, initialCustomer } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

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
  const [areas, setAreas] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const data = await initialCustomer();
      setCustomers(data.DataSet.Table);
      setFilteredCustomers(data.DataSet.Table);
      setAreas(data.DataSet.Table5);
    } catch (error) {
      console.error('Error fetching location data:', error);
      openMessage('error', 'There was an error fetching the customer data.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openMessage = (type, content) => {
    message[type](content);
  };

  const payload = {
    OperationId: 2,
    CustomerId: null,
    CustomerName: null,
    ContactPerson: null,
    Contact1: null,
    Contact2: null,
    Address: null,
    AreaId: null,
    NTN: null,
    UserId: 1,
    UserIP: null,
    CreditDaysCount: null,
  };

  const url = "SetupCustomer";

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    drawerForm.resetFields();
    setIsEditing(false);
    setCustomerId(null);
  };

  const onSearch = values => {
    const { area, customerName, contactPerson } = values;
  
    const filteredData = customers.filter(customer => {
      return (
        // (!area || customer.AreaId?.toString() === area) &&
        (!customerName || customer.CustomerName.toLowerCase().includes(customerName.toLowerCase())) &&
        (!contactPerson || customer.ContactPerson.toLowerCase().includes(contactPerson.toLowerCase()))
      );
    });
    setFilteredCustomers(filteredData);
  };

  const onFinish = async values => {
    const {
      address,
      area,
      contact1,
      contact2,
      contactPerson,
      creditDays,
      customerName,
      isActive,
      ntnNo,
    } = values;

    console.log('CustomerId before payload:', customerId); // Log the customerId here

    const payloadToUse =  {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      CustomerName: customerName,
      ContactPerson: contactPerson,
      CustomerId: customerId,  // Ensure customerId is used correctly
      Contact1: contact1,
      Contact2: contact2,
      Address: address,
      AreaId: area,
      NTN: ntnNo,
      CreditDaysCount: creditDays,
      IsActive: isActive,
    }

    console.log('Payload to use:', payloadToUse); // Log the payload here

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        console.log("response is here", data)
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Customer added/updated successfully!');
          const updatedCustomerData = data.DataSet.Table1;
          setCustomers(updatedCustomerData);
          setFilteredCustomers(updatedCustomerData);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Customer.');
        }
      } catch (error) {
        console.error('Error fetching Customer data:', error);
        openMessage('error', 'There was an error adding/updating the Customer.');
      }
    };
    fetchData();
    onCloseDrawer();
  };

  const onEditCustomer = customer => {
    setIsEditing(true);
    setEditingCustomer(customer);
    setCustomerId(customer.CustomerId);  // Ensure customerId is set correctly
    drawerForm.setFieldsValue({
      customerName: customer.CustomerName,
      contactPerson: customer.ContactPerson,
      contact1: customer.Contact1,
      contact2: customer.Contact2,
      area: customer.AreaId,
      address: customer.Address,
      ntnNo: customer.NTN,
      isActive: customer.IsActive,
      creditDays: customer.CreditDaysCount,
    });
    setDrawerVisible(true);
  };

  const onDeleteCustomer = customer => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      CustomerId: customer.CustomerId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Customer deleted successfully!');
          const updatedCustomers = data.DataSet.Table1;
          setCustomers(updatedCustomers);
          setFilteredCustomers(updatedCustomers);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error deleting the Customer.');
        }
      } catch (error) {
        openMessage('error', 'There was an error deleting the Customer.');
      }
    };
    fetchData();
  };

  const getAreaName = (areaId) => {
    const area = areas.find(a => a.AreaId === areaId);
    return area ? area.Area : 'Unknown';
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'CustomerName',
      key: 'CustomerName',
    },
    {
      title: 'Contact Person',
      dataIndex: 'ContactPerson',
      key: 'ContactPerson',
    },
    {
      title: 'Contact 1',
      dataIndex: 'Contact1',
      key: 'Contact1',
    },
    {
      title: 'Area',
      dataIndex: 'AreaId',
      key: 'AreaId',
      render: (text, record) => getAreaName(record.AreaId),
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    },

    {
      title: 'Active',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: isActive => (isActive ? 'Yes' : 'No'),
    },
    {
      title: 'Credit Days',
      dataIndex: 'CreditDaysCount',
      key: 'CreditDaysCount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEditCustomer(record)} />
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => onDeleteCustomer(record)}
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
      <Title level={3}>Customer Management</Title>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={10}>
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
          <Col className='mt-[30px]'>
          <Button
                type="default"
                onClick={() => {
                  searchForm.resetFields();
                  setFilteredCustomers(customers);
                }}
              >
                Reset
              </Button>
          </Col>
        </Row>
      </Form>
      <div className='flex justify-end '>
        <RoundButton
          onClick={showDrawer}
        />
      </div>
      <Table columns={columns} dataSource={filteredCustomers} rowKey="CustomerId" pagination={{ pageSize: 5 }}/>
      <Drawer
        title={isEditing ? "Edit Customer" : "Create a New Customer"}
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
                rules={[{ required: true, message: 'Please enter primary contact number' }]}
              >
                <Input placeholder="Enter primary contact number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact2"
                label="Contact 2"
              >
                <Input placeholder="Enter secondary contact number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area"
                label="Area"
                rules={[{ required: true, message: 'Please enter area' }]}
              >
                <Select placeholder="Select an area">
                  {areas.map(area => (
                    <Option key={area.AreaId} value={area.AreaId}>{area.Area}</Option>
                  ))}
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
                name="creditDays"
                label="Credit Days"
              >
                <Input type="number" placeholder="Enter credit days count" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Active"
                valuePropName="checked"
              >
                <Checkbox />
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
