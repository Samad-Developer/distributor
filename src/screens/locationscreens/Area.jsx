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


const Area = () => {

  const dispatch = useDispatch()
  // variable for search
  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedProvince, setselectedProvince] = useState();
  const [selectedCity, setSelectedCity] = useState()
  const [selectedTown, setSelectedTown] = useState()
  const [searchArea, setsearchArea] = useState()
  // varaible for New data
  const [newArea, setnewArea] = useState()
  // State for drawer visibility
  const [visible, setVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
  const [cityData, setCityData] = useState()
  const [townData, settownData] = useState()
  const [areaData, setAreaData] = useState()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); // Call the initialData function
        setCountriesData(response.DataSet.Table); // Log the response data
        setProvincesData(response.DataSet.Table1)
        setSelectedCity(response.DataSet.Table2)
        setCityData(response.DataSet.Table2)
        settownData(response.DataSet.Table3)
        setAreaData(response.DataSet.Table4)
        console.log('town Data', townData)
        // Handle the response data as needed
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      }
    };
    fetchData()
  }, [])

  const payload = {
    "OperationId": 2,
    "Type": "area",
    "UserId": 1,
    "CountryId": selectedCountry,
    "ProvinceId": selectedProvince,
    "CityId": selectedCity,
    "TownId": selectedTown,
    "AreaId": null,
    "Country": null,
    "Province": null,
    "City": null,
    "Town": null,
    "Area": newArea
}
  const url = 'SetupLocationConfig'

  const handleSearch = () => {
    console.log('seaching is working', selectedCountry, selectedProvince, selectedCity, selectedTown, searchArea)
    setSelectedCountry()
    setselectedProvince()
    setSelectedCity()
    setSelectedTown()
    setsearchArea()
  }

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleAdd = () => {
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        const updatedAreaData = data.DataSet.Table1
        setAreaData(updatedAreaData)
        // setCountriesData()
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
    setVisible(false)
    setnewArea()
    setselectedProvince()
    setSelectedCountry()
    setSelectedCity()
    setSelectedTown()

  }

  const onClose = () => {
    setVisible(false);
    setnewArea()
    setSelectedCountry()
    setselectedProvince()
    setSelectedTown()
    setSelectedCity()
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    console.log('edit record is comming', record)
  }

  const searchPanel = (
    <div className='flex'>
      <Fragment>
        {/* <FormSelect
          options={countriesData}
          name="Country"
          label="Country"
          value={selectedCountry}
          style={{
            width: '150px'
          }}
          
        /> */}

        <div className='flex flex-col'>
          <p>Country</p>
          <Select
            value={selectedCountry}
            onChange={(event) => {
              setSelectedCountry(event)
            }}
            style={{
              width: '150px'
            }}
            placeholder="Select Country"
          >
            {countriesData && countriesData.map((country) => (
              <Option key={country.CountryId} value={country.CountryId}>
                {country.Country}
              </Option>
            ))}
          </Select>
        </div>


        {/* <div className='flex flex-col'>
          <p className='ml-3'>Province</p>
          <Select
            value={selectedProvince}
            placeholder={'Select Province'}
            label='Province'
            name='Province'
            style={{ width: 150, marginLeft: '10px' }}
            onChange={(event) => {
              setselectedProvince(event)
            }}
            options={provincesData && provincesData.map((option) => ({
              value: option.ProvinceId,
              label: option.Province,
              key: `${option.Province}-${option.ProvinceId}`,
            }))}
          />
        </div> */}

        <div className='flex flex-col'>
          <p>Province</p>
          <Select
            value={selectedProvince}
            placeholder="Select Province"
            onChange={(event) => {
              setselectedProvince(event)
            }}
            style={{ width: 150, marginLeft: '10px' }}
          >
            {provincesData && provincesData
              // .filter((province) => province.CountryId === selectedCountry)
              .map((province) => (
                <Option key={province.ProvinceId} value={province.ProvinceId}>
                  {province.Province}
                </Option>
              ))}
          </Select>
        </div>
        <div className='flex flex-col'>
          <p className='ml-3'>City</p>
          <Select
            value={selectedCity}
            placeholder={'Select City'}
            style={{ width: 150, marginLeft: '10px' }}
            onChange={(value) => setSelectedCity(value)}
          >
            {cityData && cityData
              // .filter((city) => city.ProvinceId === selectedProvince)
              .map((city) => (
                <Option key={city.CityId} value={city.CityId}>
                  {city.City}
                </Option>
              ))}
          </Select>
        </div>
        <div className='flex flex-col'>
          <p className='ml-3'>Town</p>
          <Select
            value={selectedTown}
            placeholder={'Select Town'}
            style={{ width: 150, marginLeft: '10px' }}
            onChange={(value) => setSelectedTown(value)}
          >
            {townData && townData.map((town) => (
              <Option key={town.TownId} value={town.TownId}>
                {town.Town}
              </Option>
            ))}
          </Select>
        </div>

        <FormTextField
          label='Area'
          value={searchArea}
          onChange={setsearchArea}
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
        title="Add Area"
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
        <div className='flex flex-col'>
          <div className='flex flex-col ml-2'>
            <p>Country</p>
            <Select
              value={selectedCountry}
              onChange={(event) => {
                setSelectedCountry(event)
              }}
              style={{
                width: '200px'
              }}
              placeholder="Select Country"
            >
              {countriesData && countriesData.map((country) => (
                <Option key={country.CountryId} value={country.CountryId}>
                  {country.Country}
                </Option>
              ))}
            </Select>
          </div>
          <div className='flex flex-col'>
            <p className='ml-2'>Province</p>
            <Select
              value={selectedProvince}
              placeholder="Select Province"
              disabled={!selectedCountry} // Disable province selection until a country is selected
              onChange={(event) => {
                setselectedProvince(event)
              }}
              style={{ width: 200, marginLeft: '10px' }}
            >
              {provincesData && provincesData
                .filter((province) => province.CountryId === selectedCountry)
                .map((province) => (
                  <Option key={province.ProvinceId} value={province.ProvinceId}>
                    {province.Province}
                  </Option>
                ))}
            </Select>
          </div>
          <div className='flex flex-col'>
            <p className='ml-3'>City</p>
            <Select
              value={selectedCity}
              placeholder={'Select City'}
              style={{ width: 200, marginLeft: '10px' }}
              onChange={(value) => setSelectedCity(value)}
              disabled={!selectedProvince}
            >
              {cityData && cityData
                .filter((city) => city.ProvinceId === selectedProvince)
                .map((city) => (
                  <Option key={city.CityId} value={city.CityId}>
                    {city.City}
                  </Option>
                ))}
            </Select>
          </div>
          <div className='flex flex-col'>
            <p className='ml-3'>Town</p>
            <Select
              value={selectedTown}
              placeholder={'Select Town'}
              style={{ width: 200, marginLeft: '10px' }}
              onChange={(value) => setSelectedTown(value)}
              disabled={!selectedCity}
            >
              {townData && townData
              .filter((town) => town.CityId === selectedCity)
              .map((town) => (
                <Option key={town.TownId} value={town.TownId}>
                  {town.Town}
                </Option>
              ))}
            </Select>
          </div>
          <FormTextField
            label='Area'
            value={newArea}
            onChange={setnewArea}
            style={{
              marginLeft: '10px',
              width: '200px'
            }}
          />

        </div>
        <div className='flex justify-end mt-2'>
          <FormButton
            onClick={handleAdd}
            title='Add Town'
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
      title: 'Town',
      dataIndex: 'Town',
      key: 'TownId',
      sorter: (a, b) => a.town.localeCompare(b.town),
      sortOrder: sortedInfo.columnKey === 'TownId' && sortedInfo.order,
    },
    {
      title: 'Area',
      dataIndex: 'Area',
      key: 'AreaId',
      sorter: (a, b) => a.area.localeCompare(b.area),
      sortOrder: sortedInfo.columnKey === 'AreaId' && sortedInfo.order,
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
        dataSource={areaData}
        addTitle='New Area'
        handleChange={handleChange}
      />
    </div>
  )
}

export default Area