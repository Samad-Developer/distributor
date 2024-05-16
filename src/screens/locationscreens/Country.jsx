import React, { useState, useEffect, Fragment } from 'react'
import { Drawer, Space, Button } from 'antd'
import { CloseOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import BasicForm from '../../components/formcomponents/BasicForm'
import FormTextField from '../../components/generalcomponents/FormTextField'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import { getData, initialData } from '../../services/mainApp.service';

const Country = () => {

  const [countries, setCountries] = useState()
  console.log('countries data is chekcing', countries)
  // for search
  const [selectedCountry, setselectedCountry] = useState();
  // for Adding new data
  const [newCountry, setNewCountry] = useState('');
  // State for drawer visibility
  const [visible, setVisible] = useState(false); 
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); // Call the initialData function
        setCountries(response.DataSet.Table); // Log the response data
        // Handle the response data as needed
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      }
    };
    fetchData()
  }, [])

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
        const updatedCountriesData = data.DataSet.Table1
        setCountries(updatedCountriesData)
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
  
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
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
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
        addTitle='New Country'
      />
    </div>

  )
}

export default Country