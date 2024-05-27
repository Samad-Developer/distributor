import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { initialSize, getData } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

const { Option } = Select;

const Size = () => {

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingSize, seteditingSize] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sizes, setsizes] = useState();
  const [filteredsizes, setFilteredsizes] = useState()

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchsizes = async () => {
    try {
      const data = await initialSize();
      // console.log('iniital brand is comming', data)
      setsizes(data.DataSet.Table);
      setFilteredsizes(data.DataSet.Table);

    } catch (error) {
      console.error('Error fetching size data:', error);
      openMessage('error', 'There was an error fetching the Size data.');
    }
  };

  useEffect(() => {
    fetchsizes();
  }, []);


  const payload = {
    "OperationId": 1,
    "SizeId": null,
    "SizeName": null,
    "UserId": 1,
    "UserIP": null
  }
  const url = "SetupSize"

  const onFinish = async values => {

    const { sizeName } = values;
    
    const payloadToUse = {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      SizeName: sizeName,
      SizeId: isEditing ? editingSize.SizeId : null,
    }
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Size added/updated successfully!');
          const updatedBrandData = data.DataSet.Table1;
          setsizes(updatedBrandData);
          setFilteredsizes(updatedBrandData);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Size.');
        }
      } catch (error) {
        console.error('Error fetching Size data:', error);
        openMessage('error', 'There was an error adding/updating the Size.');
      }
    };
    fetchData();
    onClose();
  };

  const onEditBrand = size => {
    setIsEditing(true);
    seteditingSize(size);
    form.setFieldsValue({
      sizeName: size.SizeName,
    });
    setDrawerVisible(true);
  };
  
  const showDrawer = (brand = null) => {
    setDrawerVisible(true);
    form.resetFields();
    setIsEditing(false)
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onSearch = (values) => {
    const { sizeName } = values;
    if (values) {
      const searchsizes = sizes.filter(size => {
        return (!values.sizeName || size.SizeName.toLowerCase().includes(sizeName.toLowerCase()));
      });
      setFilteredsizes(searchsizes);
    } else {
      setFilteredsizes(sizes)
    }
  };



  const handleDelete = (size) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      SizeId: size.SizeId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Brand deleted successfully!');
          const updatedBrand = data.DataSet.Table1;
          setsizes(updatedBrand);
          setFilteredsizes(updatedBrand);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error deleting the Brand.');
        }
      } catch (error) {
        openMessage('error', 'There was an error deleting the Brand');
      }
    };
    fetchData();
  };

  const columns = [
    {
      title: 'Size Name',
      dataIndex: 'SizeName',
      key: 'SizeName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEditBrand(record)} />
          <Popconfirm
            title="Are you sure to delete this Brand ?"
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
      <Form form={searchForm} layout="vertical" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="sizeName" label="Size Name">
              <Input placeholder="Enter Size Name" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" className='bg-[#4F46E5]' icon={<SearchOutlined/>} htmlType="submit" style={{ marginTop: '30px' }}>Search</Button>
            </Form.Item>
          </Col>
          <Col >
            <Form.Item>
              <Button type="default" onClick={() => {
                searchForm.resetFields();
                setFilteredsizes(sizes)
              }} style={{ marginTop: '30px' }}>
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

      <Table columns={columns} dataSource={filteredsizes} rowKey="id" pagination={{ pageSize: 5 }}/>

      <Drawer
        title={isEditing ? "Edit Size" : "Create New Size"}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="sizeName"
            label="Size Name"
            rules={[{ required: true, message: 'Please enter size name' }]}
          >
            <Input placeholder="Enter Size Name" />
          </Form.Item>
          <Form.Item>
          
            <Button type="primary" htmlType="submit" className='w-full'>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Size;

