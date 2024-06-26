import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Select, Table, Space, Popconfirm, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { initialBrand, getData } from '../../services/mainApp.service';
import RoundButton from '../../components/generalcomponents/RoundButton';

const { Option } = Select;

const Brand = () => {

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [brands, setBrands] = useState();
  const [filteredBrands, setFilteredBrands] = useState()

  const openMessage = (type, content) => {
    message[type](content);
  };

  const fetchBrands = async () => {
    try {
      const data = await initialBrand();
      // console.log('iniital brand is comming', data)
      setBrands(data.DataSet.Table);
      setFilteredBrands(data.DataSet.Table);

    } catch (error) {
      console.error('Error fetching Brand data:', error);
      openMessage('error', 'There was an error fetching the Brand data.');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);


  const payload = {
    "OperationId":1,
    "BrandId": null,
    "BrandName": null,
    "UserId":1,
    "UserIP": null
  }
  const url = "SetupBrand"

  const onFinish = async values => {

    const { brandName, BrandId } = values;
    const payloadToUse = {
      ...payload,
      OperationId: isEditing ? 3 : 2,
      BrandName: brandName,
      BrandId: isEditing ? editingBrand.BrandId : null,
    }
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Brand added/updated successfully!');
          const updatedBrandData = data.DataSet.Table1;
          setBrands(updatedBrandData);
          setFilteredBrands(updatedBrandData);
        } else {
          openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Brand.');
        }
      } catch (error) {
        console.error('Error fetching Brand data:', error);
        openMessage('error', 'There was an error adding/updating the Brand.');
      }
    };
    fetchData();
    onClose();
  };

  const onEditBrand = brand => {
   
    setIsEditing(true);
    setEditingBrand(brand);
    form.setFieldsValue({
      brandName: brand.BrandName,
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
    const { brandName } = values;
    if (values) {
      const searchBrands = brands.filter(brand => {
        return (!values.brandName || brand.BrandName.toLowerCase().includes(brandName.toLowerCase()));
      });
      setFilteredBrands(searchBrands);
    } else {
      setFilteredBrands(brands)
    }
  };



  const handleDelete = (brand) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      BrandId: brand.BrandId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Brand deleted successfully!');
          const updatedBrand = data.DataSet.Table1;
          setBrands(updatedBrand);
          setFilteredBrands(updatedBrand);
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
      title: 'Brand Name',
      dataIndex: 'BrandName',
      key: 'BrandName',
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
      <Form form={searchForm} layout="vertical" onFinish={onSearch} >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="brandName" label="Brand Name">
              <Input placeholder="Enter Brand Name" />
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
                setFilteredBrands(brands)
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

      <Table columns={columns} dataSource={filteredBrands} rowKey="id" pagination={{ pageSize: 5 }}/>

      <Drawer
        title={ isEditing ? "Edit Brand" : "Create New Brand"}
        width={360}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[{ required: true, message: 'Please enter brand name' }]}
          >
            <Input placeholder="Enter Brand Name" />
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

export default Brand;

