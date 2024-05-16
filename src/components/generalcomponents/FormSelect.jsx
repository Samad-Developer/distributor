import React from 'react';
import { Select } from 'antd'; // Assuming you're using Ant Design

const FormSelect = ({
  label,
  options = [], 
  defaultValue, 
  onChange, 
  disabled = false, 
  placeholder, 
  style, 
  value,
  filterOption
}) => {
  return (
    <div className='flex flex-col'>
      {label && <label htmlFor={label} className=' text-gray-700 mr-2'>{`${label} : `}</label>}
      <Select
        id={label}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder || 'Select an option'}
        options={options.map((option) => ({
          value: option.CountryId,
          label: option.Country,
          key: `${option.Country}-${option.CountryId}`
        }))}
        style={style}
        filterOption={filterOption}
        showSearch
      />
    </div>
  );
};

export default FormSelect;
