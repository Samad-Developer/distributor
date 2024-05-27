import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Drawer, Checkbox, Table, Space, Select, message, Row, Col, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { initialBranch, getData } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

const { Option } = Select;
const { Title } = Typography;

const Branch = () => {
  const [searchForm] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [branches, setbranches] = useState([]);
  const [filteredbranches, setFilteredbranches] = useState([]);
  const [editingBranch, seteditingBranch] = useState(null);
  const [companies, setCompanies] = useState([])

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchBranches = async () => {
    try {
      const data = await initialBranch();
      console.log('iniital branch is comming', data)
      setbranches(data.DataSet.Table);
      setFilteredbranches(data.DataSet.Table);
      const comp = data.DataSet.Table1.map(({ CompanyId, CompanyName }) => ({ CompanyId, CompanyName }));
      setCompanies(comp)
    } catch (error) {
      console.error('Error fetching Branch data:', error);
      openMessage('error', 'There was an error fetching the Branch data.');
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const showDrawer = () => {
    setIsEditing(false);
    seteditingBranch(null);
    drawerForm.resetFields();
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const onSearch = values => {
    const { branch, company, faxNo } = values;
    const filteredData = branches.filter((branchItem) => {
      return (
        (!company || branchItem.CompanyName.toLowerCase().includes(company.toLowerCase())) &&
        (!faxNo || company.Fax === faxNo) &&
        (!branch || branchItem.BranchName.toLowerCase().includes(branch.toLowerCase()))
      );
    })
    setFilteredbranches(filteredData);
  };

  const payload = {
    "OperationId": 1,
    "BranchId": null,
    "BranchName": null,
    "CompanyId": null,
    "ContactNo": null,
    "Email": null,
    "Fax": null,
    "UserId": 1,
    "UserIP": null
  }
  const url = "SetupBranch"

  const onFinish = async values => {

    const { address, branch, company, contactNo, emailId, faxNo } = values;

    const payloadToUse = {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      BranchName: branch,
      BranchId: isEditing ? editingBranch.BranchId : null,
      CompanyId: company,
      ContactNo: contactNo,
      Email: emailId,
      Fax: faxNo,
    }

    console.log('Payload to use:', payloadToUse); // Log the payload here

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Branch added/updated successfully!');
          const updatedBranchData = data.DataSet.Table1;
          setbranches(updatedBranchData);
          setFilteredbranches(updatedBranchData);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Branch.');
        }
      } catch (error) {
        console.error('Error fetching Branch data:', error);
        openMessage('error', 'There was an error adding/updating the Branch.');
      }
    };
    fetchData();
    onCloseDrawer();
  };

  const onEditBranch = branch => {
    setIsEditing(true);
    seteditingBranch(branch);
    drawerForm.setFieldsValue({
      company: branch.CompanyId,
      branch: branch.BranchName,
      contactNo: branch.ContactNo,
      faxNo: branch.Fax,
      emailId: branch.Email,
      address: branch.Address,
    });
    setDrawerVisible(true);
  };

  const onDeleteCompany = branch => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      BranchId: branch.BranchId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Branch deleted successfully!');
          const updatedBranch = data.DataSet.Table1;
          setbranches(updatedBranch);
          setFilteredbranches(updatedBranch);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error deleting the Branch.');
        }
      } catch (error) {
        openMessage('error', 'There was an error deleting the Branch.');
      }
    };
    fetchData();
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.CompanyId === companyId);
    return company ? company.CompanyName : 'Unknown';
  };

  const columns = [

    {
      title: 'Branch',
      dataIndex: 'BranchName',
      key: 'BranchName',
    },
    {
      title: 'Company',
      dataIndex: 'CompanyId',
      key: 'CompanyId',
      render: (text, record) => getCompanyName(record.CompanyId),
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEditBranch(record)} />
          <Popconfirm
            title="Are you sure to delete this Branch?"
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
      <Title level={3}>Branch Management</Title>
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '00px' }}>
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item
              name="company"
              label="Company"
            >
              <Select placeholder="Select area">
                {companies.map(({ CompanyId, CompanyName }) => (
                  <Option key={CompanyId} value={CompanyId}>
                    {CompanyName}
                  </Option>
                ))}
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
              <Button className='bg-[#4F46E5]' type="primary" htmlType="submit" icon={<SearchOutlined />}>Search</Button>
            </Form.Item>
          </Col>
          {/* Uncomment the reset button if needed */}
          <Col className='mt-[30px]'>
            <Form.Item>
              <Button type="default" onClick={() => {
                searchForm.resetFields();
                setFilteredbranches(branches);
              }}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className='flex justify-end'>
        <RoundButton
          onClick={showDrawer}
        />
      </div>

      <Table columns={columns} dataSource={filteredbranches} pagination={{ pageSize: 5 }} />

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
                rules={[{ required: true, message: 'Please select a company' }]}
              >
                <Select placeholder="Select a company">
                  {companies.map(({ CompanyId, CompanyName }) => (
                    <Option key={CompanyId} value={CompanyId}>
                      {CompanyName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="branch"
                label="Branch"
                rules={[
                  { required: true, message: 'Please enter the branch name' },
                  { min: 2, message: 'Branch name must be at least 2 characters' }
                ]}
              >
                <Input placeholder="Enter branch" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactNo"
                label="Contact No"
                rules={[
                  { required: true, message: 'Please enter contact no' },
                  { pattern: /^(\+92|0)?3\d{9}$/, message: 'Please enter a valid contact number' }
                ]}
              >
                <Input placeholder="+923485497976" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="faxNo"
                label="Fax No"
                rules={[
                  { required: true, message: 'Please enter your fax number' },
                  { pattern: /^\+?\d{6,15}$/, message: 'Please enter a valid fax number' }
                ]}
              >
                <Input placeholder="123-4567890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emailId"
                label="Email Id"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input placeholder="example@gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: 'Please enter your address' },
                  { min: 10, message: 'Address must be at least 10 characters' }
                ]}
              >
                <Input placeholder="123 Main St, City, Country" />
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
