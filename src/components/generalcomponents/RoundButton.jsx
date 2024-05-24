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
        marginBottom: '20px'
      }}
    >
      {text}
    </Button>
  );
};

export default RoundButton;
