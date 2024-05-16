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
  // for search
  const [selectedCountry, setselectedCountry] = useState();
  // for Adding new data
  const [newCountry, setNewCountry] = useState('');
  // State for drawer visibility
  const [visible, setVisible] = useState(false); 
  const [sortedInfo, setSortedInfo] = useState({});
  // State for filtered countries
  const [filteredCountries, setFilteredCountries] = useState(); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); // Call the initialData function
        setCountries(response.DataSet.Table); // Log the response data
        setFilteredCountries(response.DataSet.Table); // Initialize filteredCountries with all countries
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
    if (!selectedCountry) {
      setFilteredCountries(countries); // Reset filter if no country is selected
    } else {
      const filtered = countries.filter(country =>
        country.CountryId === selectedCountry
      );
      setFilteredCountries(filtered);
      setselectedCountry()
    }
  }

  const handleAdd = () => {
    onClose();
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        const updatedCountriesData = data.DataSet.Table1
        setCountries(updatedCountriesData)
        // Update filteredCountries after adding a new country
        setFilteredCountries(updatedCountriesData); 

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

  // filteroption
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
              filterOption={filterOption}
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
        dataSource={filteredCountries}
        handleChange={handleChange}
        addTitle='New Country'
      />
    </div>

  )
}

export default Country