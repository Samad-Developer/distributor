import { Divider, Table } from 'antd'
import React from 'react'
import FormButton from '../../components/generalcomponents/FormButton'


const BasicForm = ({ searchPanel, addTitle, formDrawer, columns, dataSource, handleChange, onOpen, onClose }) => {
  return (
    <div>
      <div className='mt-2'>
        {searchPanel}
      </div>
      <div className='flex justify-end'>
        <FormButton
          title={addTitle}
          style={{
            backgroundColor: 'blue',
            color: 'white'
          }}
          onClick={onOpen}
        />
      </div>
      <div>
        {formDrawer}
      </div>
      <div className='mt-1'>
        <Table
          columns={columns}
          dataSource={dataSource}
          onChange={handleChange}
          pagination={{ pageSize: 5 }} />
      </div>
    </div>
  )
}

export default BasicForm