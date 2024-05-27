import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const RoundButton = ({ text, onClick, style }) => {
  return (
    <Button
      type="primary"
      shape="round"
      icon={<PlusOutlined />}
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        marginBottom: '10px',
        backgroundColor: '#4F46E5'
      }}
    >
      {text}
    </Button>
  );
};

export default RoundButton;
