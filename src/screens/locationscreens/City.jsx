import React, { useState, useEffect } from 'react'
import BasicForm from '../../components/formcomponents/BasicForm'
import { Fragment } from 'react'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import FormTextField from '../../components/generalcomponents/FormTextField'
import { CloseOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import { Drawer, Space, Button, Select, Popconfirm, message } from 'antd'
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
  const [drawerSelectCountry, setDrawerSelectCountry] = useState();
  const [drawerSelectProvince, setDrawerSelectProvince] = useState();


  // State for drawer visibility
  const [visible, setVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
  const [cityData, setCityData] = useState()
  // seaching variable
  const [filteredCities, setFilteredCities] = useState()
  // for editing
  const [editDisplay, setEditDisplay] = useState();
  const [editingCity, setEditingCity] = useState(null);

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

  const openMessage = (type, content) => {
    // messageApi.open({
    //   type: type,
    //   content: content,
    // });
    message[type](content);
  };

  const payload = {
    "OperationId": 2,
    "Type": "city",
    "UserId": 1,
    "CountryId": drawerSelectCountry,
    "ProvinceId": drawerSelectProvince,
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
    onClose();
    const payloadToUse = editDisplay ? {
      ...payload,
      OperationId: 3, // Edit operation
      CountryId: drawerSelectCountry,
      ProvinceId: drawerSelectProvince,
      CityId: editingCity,
      City: newCity,
    } : payload;

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
        openMessage('success', data.DataSet.Table[0].Message || 'City added/updated successfully!');
        const updatedCitiesData = data.DataSet.Table1
        setCityData(updatedCitiesData)
        setFilteredCities(updatedCitiesData)
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error adding/updating the City.');
      }
      } catch (error) {
        console.error('Error fetching location data:', error);
        openMessage('error', 'There was an error adding/updating the City.');
      }
    };

    fetchData();
  }

  const onClose = () => {
    setVisible(false);
    setnewCity()
    setDrawerSelectCountry()
    setDrawerSelectProvince()
    setEditingCity(null)
    setEditDisplay(null)
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    setnewCity(record.City);
    setEditDisplay(record.CityId)
    setEditingCity(record.CityId)
    setDrawerSelectCountry(record.CountryId)
    setDrawerSelectProvince(record.ProvinceId)
    setVisible(true); // Open the drawer
  }

  const handleDelete = (record) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      CountryId: record.CountryId,
      ProvinceId: record.ProvinceId,
      CityId: record.CityId
    } ;
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
        openMessage('success', data.DataSet.Table[0].Message || 'City Deleted successfully!');
        const updatedCitiesData = data.DataSet.Table1
        setCityData(updatedCitiesData)
        setFilteredCities(updatedCitiesData)
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error deleting the City.');
      }
      } catch (error) {
        console.error('Error fetching location data:', error);
        openMessage('error', 'There was an error deleting the City.');

      }
    };

    fetchData();
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
        title={editDisplay ? "Edit City" : "Add City"}
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
            value={drawerSelectCountry}
            filterOption={filterOption}
            style={{
              width: '150px'
            }}
            onChange={(event) => {
              setDrawerSelectCountry(event)
              
            }}
          />
          <div className='flex flex-col'>
            <p className='ml-3'>Province</p>
            <Select
              value={drawerSelectProvince}
              placeholder={'Select Province'}
              label='select'
              style={{ width: 150, marginLeft: '10px' }}
              onChange={(event) => {
                setDrawerSelectProvince(event)
              }}
              showSearch
              filterOption={filterOption}
              disabled={!drawerSelectCountry}
              options={provincesData && provincesData
                .filter((province) => province.CountryId === drawerSelectCountry)
                .map((option) => ({
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
            title={editDisplay ? "Update" : "Add City"}
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
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this City?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
          <Button type="danger">
            <DeleteTwoTone />
          </Button>
        </Popconfirm>
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