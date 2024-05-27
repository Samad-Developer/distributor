import React from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox } from 'antd';

const { Option } = Select;

const DrawerForm = ({ visible, onClose, onFinish, formFields, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Drawer
      title={initialValues ? "Edit" : "Create New"}
      width={360}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {formFields.map(field => (
          <Form.Item
            name={field.name}
            label={field.label}
            key={field.name}
            rules={field.rules}
          >
            {field.type === 'input' ? (
              <Input placeholder={field.placeholder} />
            ) : field.type === 'select' ? (
              <Select placeholder={field.placeholder}>
                {field.options.map(option => (
                  <Option value={option.value} key={option.value}>{option.label}</Option>
                ))}
              </Select>
            ) : (
              <Checkbox>{field.label}</Checkbox>
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
