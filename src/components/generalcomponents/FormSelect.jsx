import React from 'react';
import { Select } from 'antd'; // Assuming you're using Ant Design

const FormSelect = ({
  label,
  options = [], 
  defaultValue, 
  onChange, 
  disabled = false, 
  placeholder, 
  style
}) => {
  return (
    <div>
      {label && <label htmlFor={label} className=' text-gray-700 mr-2'>{`${label} : `}</label>}
      <Select
        id={label}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder || 'Select an option'}
        options={options.map((option) => ({
          value: option.Country,
          label: option.Country,
          key: `${option.Country}-${option.CountryId}`
        }))}
        style={style}
      />
    </div>
  );
};

export default FormSelect;
