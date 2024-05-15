import React, { useState, useEffect, Fragment } from 'react'
import { Drawer, Table, Space, Button } from 'antd'
import { useSelector } from 'react-redux'
import { CloseOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import BasicForm from '../../components/formcomponents/BasicForm'
import FormTextField from '../../components/generalcomponents/FormTextField'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import { fetchUpdatedLocationSuccess } from '../../store/reducers/UpdatedLocationSlice';
import { useDispatch } from 'react-redux'
import { getData } from '../../services/mainApp.service';

const Country = () => {

  // const locationData = useSelector((state) => state.location.locationData)
  // dispatch(locationDataLocalStorage)
  // console.log('location Data is coming', locationData)
  const dispatch = useDispatch()
  const locationData = JSON.parse(localStorage.getItem('InitialLocationData'));
  const countriesData = locationData.Table
  const [countries, setCountries] = useState(countriesData)
  const [selectedCountry, setselectedCountry] = useState();
  const [newCountry, setNewCountry] = useState('');
  const [visible, setVisible] = useState(false); // State for drawer visibility
  const [sortedInfo, setSortedInfo] = useState({});

  const payload = {
    "OperationId": 2,
    "Type": "country",
    "UserId": 1,
    "CountryId": null,
    "ProvinceId": null,
    "CityId": null,
    "TownId": null,
    "AreaId": null,
    "Country": newCountry,
    "Province": null,
    "City": null,
    "Town": null,
    "Area": null
  }

  const url = 'SetupLocationConfig'

  // useDispatch(()=> {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getData(url, payload);
  //       dispatch(fetchLocationSuccess(data.DataSet))
  //       const updatedLocationData = JSON.parse(localStorage.getItem('locationData'));
  //       const updatedCountriesData = updatedLocationData.Table1
  //       setCountries(updatedCountriesData)

  //     } catch (error) {
  //       console.error('Error fetching location data:', error);
  //     }
  //   };

  //   fetchData();  
  // }, [])

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleEdit = () => {
    alert('working....')
  }

  const handleSearch = () => {
  }

  const handleAdd = () => {
    onClose();
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        dispatch(fetchUpdatedLocationSuccess(data.DataSet))
        const updatedLocationData = JSON.parse(localStorage.getItem('UpdatedLocationData'));
        const updatedCountriesData = updatedLocationData.Table1
        setCountries(updatedCountriesData)

      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
    console.log('updated Data after insertion', data)
  }

  const onClose = () => {
    setVisible(false);
    setNewCountry('')
  };

  const onOpen = () => {
    setVisible(true)
  }

  // searchPanel for Seaching Data
  const searchPanel = (
    <div className='flex'>
      <Fragment>
        <div className='flex'>
          <div>
            <FormSelect
              options={countries}
              name="Country"
              label="Country"
              value={selectedCountry}
              style={{
                width: '150px'
              }}
              onChange={(event) => {
                setselectedCountry(event)
              }}
            />
          </div>
          <div>
            <FormButton
              onClick={handleSearch}
              type='text'
              title='Search'
              style={{
                backgroundColor: 'blue',
                color: 'white',
                marginLeft: '10px',
                marginTop: '22px'
              }}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );

  // Adding and Editing form Drawer
  const formDrawer = (
    <div className='flex justify-between'>
      <Drawer
        title="Add Country"
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        closeIcon={<CloseOutlined />}
      >
        <FormTextField
          label="Country"
          placeholder="Enter Country Name"
          value={newCountry}
          onChange={setNewCountry}
        />
        <div className='flex justify-end'>
          <FormButton
            onClick={handleAdd}
            title='Add Country'
            style={{
              color: 'white',
              backgroundColor: 'blue',
              marginTop: '15px'
            }}
          />
        </div>
      </Drawer>
    </div>
  )

  const columns = [
    {
      title: 'Country',
      dataIndex: 'Country', // Match the key in your data array
      key: 'Country',
      sorter: (a, b) => a.Country.localeCompare(b.Country), // Sort alphabetically
      sortOrder: sortedInfo.columnKey === 'Country' && sortedInfo.order,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="small">
          <Button type="text">
            <EditTwoTone onClick={handleEdit} />
          </Button>
          <Button type="danger">
            <DeleteTwoTone onClick={handleEdit} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <BasicForm
        searchPanel={searchPanel}
        formDrawer={formDrawer}
        onOpen={onOpen}
        onClose={onClose}
        columns={columns}
        dataSource={countries}
        handleChange={handleChange}
      />
    </div>

  )
}

export default Country