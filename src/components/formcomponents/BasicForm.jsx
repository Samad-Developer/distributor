import { Divider } from 'antd'
import React from 'react'
import FormButton from '../../components/generalcomponents/FormButton'


const BasicForm = ({searchPanel, formDrawer, tableDisplay}) => {
  return (
    <div>
      {searchPanel}
      <Divider />
      <div className='flex justify-end'>
        <FormButton 
          title='+ Add New'
          style={{
            backgroundColor: 'blue',
            color: 'white'
          }}
        />
      </div>
    </div>
  )
}

export default BasicForm