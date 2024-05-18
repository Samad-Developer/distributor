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


const Town = () => {

  const dispatch = useDispatch()
  // variable for search
  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedProvince, setselectedProvince] = useState();
  const [selectedCity, setSelectedCity] = useState()
  const [searchTown, setsearchTown] = useState()
  // varaible for New data
  const [newTown, setnewTown] = useState()
  const [drawerSelectCountry, setDrawerSelectCountry] = useState();
  const [drawerSelectProvince, setDrawerSelectProvince] = useState();
  const [drawerSelectCity, setDrawerSelectCity] = useState();

  // State for drawer visibility
  const [visible, setVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
  const [cityData, setCityData] = useState()
  const [TownData, setTownData] = useState()
  // seaching variable
  const [filteredTownData, setFilteredTownData] = useState()

  // variable for editing
  const [editTown, setEditTown] = useState()
  const [editDisplay, setEditDisplay] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); // Call the initialData function
        setCountriesData(response.DataSet.Table); // Log the response data
        setProvincesData(response.DataSet.Table1)
        setSelectedCity(response.DataSet.Table2)
        setCityData(response.DataSet.Table2)
        setTownData(response.DataSet.Table3)
        setFilteredTownData(response.DataSet.Table3)
        // Handle the response data as needed
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      }
    };
    fetchData()
  }, [])

  const payload = {
    "OperationId": 2,
    "Type": "town",
    "UserId": 1,
    "CountryId": drawerSelectCountry,
    "ProvinceId": drawerSelectProvince,
    "CityId": drawerSelectCity,
    "TownId": null,
    "AreaId": null,
    "Country": null,
    "Province": null,
    "City": null,
    "Town": newTown,
    "Area": null
}
  const url = 'SetupLocationConfig'

  const handleSearch = () => {
    let filteredData = TownData.filter((town) => {
      const matches = {
        country: !selectedCountry || town.CountryId === selectedCountry,
        province: !selectedProvince || town.ProvinceId === selectedProvince,
        city: !selectedCity || town.CityId === selectedCity,
        search: !searchTown || town.Town.toLowerCase().includes(searchTown.toLowerCase()),
      };
    
      // Check if all conditions match
      return Object.values(matches).every((match) => match);
    });
    
    setFilteredTownData(filteredData);
    setSelectedCountry()
    setselectedProvince()
    setSelectedCity()
    setsearchTown()
  }

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleAdd = () => {
    onClose();
    const payloadToUse = editDisplay ? {
      ...payload,
      OperationId: 3, // Edit operation
      CountryId: drawerSelectCountry,
      ProvinceId: drawerSelectProvince,
      CityId: drawerSelectCity,
      TownId: editTown,
      Town: newTown,
    } : payload;

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        console.log('response', data)
        const updatedTownData = data.DataSet.Table1
        setTownData(updatedTownData)
        setFilteredTownData(updatedTownData)
        // setCountriesData()
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
    // setVisible(false)
    // setnewTown()
    // setselectedProvince()
    // setSelectedCountry()
    // setDrawerSelectCountry()
    // setDrawerSelectProvince()
    // setDrawerSelectCity()

  }

  const onClose = () => {
    setVisible(false);
    setnewTown()
    setSelectedCountry()
    setselectedProvince()
    setSelectedCity()
    setDrawerSelectCountry()
    setDrawerSelectProvince()
    setDrawerSelectCity()
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    setVisible(true); // Open the drawer
    setnewTown(record.Town);
    setEditDisplay(record.CityId)
    setEditTown(record.TownId)
    setDrawerSelectCountry(record.CountryId)
    setDrawerSelectProvince(record.ProvinceId)
    setDrawerSelectCity(record.CityId)
  }

  const handleDelete = (record) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      CountryId: record.CountryId,
      ProvinceId: record.ProvinceId,
      CityId: record.CityId,
      TownId: record.TownId
    } ;
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        console.log('responnse', data)
        const updatedTownData = data.DataSet.Table1
        setTownData(updatedTownData)
        setFilteredTownData(updatedTownData)
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }

    fetchData();
  }
  // filteroption
  // const filterOption = (input, option) =>
  //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const searchPanel = (
    <div className='flex'>
      <Fragment>
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
        <FormTextField
          label='Town'
          value={searchTown}
          onChange={setsearchTown}
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
        title={editDisplay ? "Edit Town" : "Add Town"}
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
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <p>Country</p>
            <Select
              value={drawerSelectCountry}
              onChange={(event) => {
                setDrawerSelectCountry(event)
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
            <p>Province</p>
            <Select
              value={drawerSelectProvince}
              placeholder="Select Province"
              disabled={!drawerSelectCountry} // Disable province selection until a country is selected
              onChange={(event) => {
                setDrawerSelectProvince(event)
              }}
              style={{ width: '200px'}}
            >
              {provincesData && provincesData
                .filter((province) => province.CountryId === drawerSelectCountry)
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
              value={drawerSelectCity}
              placeholder={'Select City'}
              style={{ width: '200px' }}
              onChange={(value) => setDrawerSelectCity(value)}
              disabled={!drawerSelectProvince}
            >
              {cityData && cityData
                .filter((city) => city.ProvinceId === drawerSelectProvince)
                .map((city) => (
                  <Option key={city.CityId} value={city.CityId}>
                    {city.City}
                  </Option>
                ))}
            </Select>
          </div>
          <FormTextField
            label='Town'
            value={newTown}
            onChange={setnewTown}
            style={{
              width: '200px'
            }}
          />

        </div>
        <div className='flex justify-end mt-2'>
          <FormButton
            onClick={handleAdd}
            title={editDisplay ? "Update" : "Add Town"}
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
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="small">
          <Button type="text" onClick={() => handleEdit(record)}>
            <EditTwoTone />
          </Button>
          <Button type="danger" onClick={() => handleDelete(record)}>
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
        dataSource={filteredTownData}
        addTitle='New Town'
        handleChange={handleChange}
      />
    </div>
  )
}

export default Town