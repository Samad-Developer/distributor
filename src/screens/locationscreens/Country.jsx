import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import BasicForm from '../../components/formcomponents/BasicForm'
import FormTextField from '../../components/generalcomponents/FormTextField'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'


const Country = () => {
  const locationData = useSelector((state) => state.location.locationData)
  const selectOptions = locationData.Table
  const [selectedCity, setselectedCity] = useState();
  const handleSearch = () => {
    console.log('until now it is working on seach you get city', selectedCity)
  }

  const searchPanel = (
    <div className='flex'>
      <Fragment>
        <FormSelect
          options={selectOptions}
          name="Country"
          label="Country"
          value={selectedCity}
          style={{
            width: '150px'
          }}
          onChange={(event) => {
            setselectedCity(event)
          }}
        />
        <FormButton
          onClick={handleSearch}
          type='text'
          title='Search'
          style={{
            backgroundColor: 'blue',
            color: 'white',
            marginLeft: '10px'
          }}
        />
      </Fragment>
    </div>
  );
  return (
    <div>
      <BasicForm
        searchPanel={searchPanel}
      />
    </div>
  )
}

export default Country