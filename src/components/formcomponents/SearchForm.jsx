import React from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const SearchForm = ({ onSearch, onReset, formFields }) => {
  const [form] = Form.useForm();

  const handleSearch = values => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSearch} style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        {formFields.map(field => (
          <Col span={6} key={field.name}>
            <Form.Item name={field.name} label={field.label}>
              {field.type === 'input' ? (
                <Input placeholder={field.placeholder} />
              ) : (
                <Select placeholder={field.placeholder}>
                  {field.options.map(option => (
                    <Option value={option.value} key={option.value}>{option.label}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        ))}
        <Col span={6} style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Search</Button>
          </Form.Item>
          <Form.Item style={{ marginLeft: '10px' }}>
            <Button type="default" onClick={handleReset}>Reset</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
