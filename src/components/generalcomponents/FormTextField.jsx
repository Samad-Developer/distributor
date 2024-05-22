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
  size
}) => {

  const handleChange = (event) => {
      onChange(event.target.value);
  };

  return (
    <div className='flex flex-col' style={style}>
      <p className='pb-1'>{label}</p>
      <Input
        size={size} // Adjust size as needed (options include 'large', 'middle', and 'small')
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        
      />
   
    </div>
  );
};

export default FormTextField;
