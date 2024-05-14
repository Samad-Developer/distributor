import React, { useState } from 'react';
import { Form, Input } from 'antd';

const FormTextField = ({
  label,
  name,
  value,
  placeholder = '',
  type = 'text', // Default type is 'text'
  rules = [],
  disabled = false,
  onChange,
  onBlur,
  style,
  borderColor,
}) => {

  const handleChange = (event) => {
      onChange(event.target.value);
  };

  return (
    <Form.Item label={label} name={name} rules={rules} className='mb-3'>
      <Input
        size="large" // Adjust size as needed (options include 'large', 'middle', and 'small')
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        style={{
            borderColor: borderColor
        }}
      />
    </Form.Item>
  );
};

export default FormTextField;
