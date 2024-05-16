import React, { useState, useEffect } from 'react'
import BasicForm from '../../components/formcomponents/BasicForm'
import { Fragment } from 'react'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import FormTextField from '../../components/generalcomponents/FormTextField'
import { CloseOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import { Drawer, Space, Button, Select } from 'antd'
import { fetchUpdatedLocationSuccess } from '../../store/reducers/UpdatedLocationSlice'
import { useDispatch } from 'react-redux'
import { getData, initialData } from '../../services/mainApp.service'


const City = () => {

  const dispatch = useDispatch()
  // variable for search
  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedProvince, setselectedProvince] = useState();
  const [searchCity, setsearchCity] = useState()
  // varaible for New data
  const [newCity, setnewCity] = useState()
  // State for drawer visibility
  const [visible, setVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
  const [cityData, setCityData] = useState()
  // seaching variable
  const [filteredCities, setFilteredCities] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); // Call the initialData function
        setCountriesData(response.DataSet.Table); // Log the response data
        setProvincesData(response.DataSet.Table1)
        setCityData(response.DataSet.Table2)
        setFilteredCities(response.DataSet.Table2)
        // Handle the response data as needed
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      }
    };
    fetchData()
  }, [])

  const payload = {
    "OperationId": 2,
    "Type": "city",
    "UserId": 1,
    "CountryId": selectedCountry,
    "ProvinceId": selectedProvince,
    "CityId": null,
    "TownId": null,
    "AreaId": null,
    "Country": null,
    "Province": null,
    "City": newCity,
    "Town": null,
    "Area": null
  }
  const url = 'SetupLocationConfig'

  const handleSearch = () => {
    const filteredCities = cityData.filter((city) => {
      const matchesCountry = selectedCountry ? city.CountryId === selectedCountry : true;
      const matchesProvince = selectedProvince ? city.ProvinceId === selectedProvince : true;
      const matchesCityName = searchCity ? city.City.toLowerCase().includes(searchCity.toLowerCase()) : true;
      return matchesCountry && matchesProvince && matchesCityName;
    });
    setFilteredCities(filteredCities)
    setSelectedCountry()
    setselectedProvince()
    setsearchCity()
  }

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleAdd = () => {
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        const updatedCitiesData = data.DataSet.Table1
        setCityData(updatedCitiesData)
        setFilteredCities(updatedCitiesData)
        // setCountriesData()
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
    setVisible(false)
    setnewCity()
    setselectedProvince()
    setSelectedCountry()

  }

  const onClose = () => {
    setVisible(false);
    setnewCity()
    setSelectedCountry()
    setselectedProvince()
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    console.log('edit record is comming', record)
  }
  // filteroption
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const searchPanel = (
    <div className='flex'>
      <Fragment>
        <FormSelect
          options={countriesData}
          name="Country"
          label="Country"
          value={selectedCountry}
          style={{
            width: '150px'
          }}
          onChange={(event) => {
            setSelectedCountry(event)
          }}
          filterOption={filterOption}
        />
        <div className='flex flex-col'>
          <p className='ml-3'>Province</p>
          <Select
            value={selectedProvince}
            placeholder={'Select Province'}
            label='Province'
            name='Province'
            style={{ width: 150, marginLeft: '10px' }}
            filterOption={filterOption}
            showSearch
            onChange={(event) => {
              setselectedProvince(event)
            }}
            options={provincesData && provincesData.map((option) => ({
              value: option.ProvinceId,
              label: option.Province,
              key: `${option.Province}-${option.ProvinceId}`,
            }))}
          />
        </div>
        <FormTextField
          label='City'
          value={searchCity}
          onChange={setsearchCity}
          style={{
            marginLeft: '10px'
          }}
        />
        <FormButton
          onClick={handleSearch}
          type='text'
          title='Search'
          style={{
            backgroundColor: 'blue',
            color: 'white',
            marginLeft: '20px',
            marginTop: '22px'
          }}
        />
      </Fragment>
    </div>
  );

  const formDrawer = (
    <div>
      <Drawer
        title="Add City"
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        size='large'
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <div className='flex'>
          <FormSelect
            options={countriesData}
            name="Country"
            label="Country"
            value={selectedCountry}
            filterOption={filterOption}
            style={{
              width: '150px'
            }}
            onChange={(event) => {
              setSelectedCountry(event)
            }}
          />
          <div className='flex flex-col'>
            <p className='ml-3'>Province</p>
            <Select
              value={selectedProvince}
              placeholder={'Select Province'}
              label='select'
              style={{ width: 150, marginLeft: '10px' }}
              onChange={(event) => {
                setselectedProvince(event)
              }}
              showSearch
              filterOption={filterOption}
              options={provincesData && provincesData.map((option) => ({
                value: option.ProvinceId,
                label: option.Province,
                key: `${option.Province}-${option.ProvinceId}`,
              }))}
            />
          </div>
          <FormTextField
            label="City"
            placeholder="Enter City Name"
            value={newCity}
            onChange={setnewCity}
            style={{
              width: '200px',
              marginLeft: '10px'
            }}
          />
        </div>
        <div className='flex justify-end'>
          <FormButton
            onClick={handleAdd}
            title='Add City'
            style={{
              color: 'white',
              backgroundColor: 'blue'
            }}
          />
        </div>
      </Drawer>
    </div>
  )

  const columns = [
    {
      title: 'Country',
      dataIndex: 'Country',
      key: 'CountryId',
      sorter: (a, b) => a.country.localeCompare(b.country),
      sortOrder: sortedInfo.columnKey === 'CountryId' && sortedInfo.order,
    },
    {
      title: 'Province',
      dataIndex: 'Province',
      key: 'ProvinceId',
      sorter: (a, b) => a.province.localeCompare(b.province),
      sortOrder: sortedInfo.columnKey === 'ProvinceId' && sortedInfo.order,
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'CityId',
      sorter: (a, b) => a.city.localeCompare(b.city),
      sortOrder: sortedInfo.columnKey === 'CityId' && sortedInfo.order,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="small">
          <Button type="text" onClick={() => handleEdit(record)}>
            <EditTwoTone />
          </Button>
          <Button type="danger">
            <DeleteTwoTone />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <BasicForm
        searchPanel={searchPanel}
        onOpen={onOpen}
        onClose={onClose}
        formDrawer={formDrawer}
        columns={columns}
        dataSource={filteredCities}
        addTitle='New City'
        handleChange={handleChange}
      />
    </div>
  )
}

export default City