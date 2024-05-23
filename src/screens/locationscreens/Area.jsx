import React, { useState, useEffect } from 'react'
import BasicForm from '../../components/formcomponents/BasicForm'
import { Fragment } from 'react'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import FormTextField from '../../components/generalcomponents/FormTextField'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import { Drawer, Space, Button, Select, Popconfirm, message } from 'antd'
import { fetchUpdatedLocationSuccess } from '../../store/reducers/UpdatedLocationSlice'
import { useDispatch } from 'react-redux'
import { getData, initialData } from '../../services/mainApp.service'

const Area = () => {

  // variable for search
  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedProvince, setselectedProvince] = useState();
  const [selectedCity, setSelectedCity] = useState()
  const [selectedTown, setSelectedTown] = useState()
  const [searchArea, setsearchArea] = useState()
  // varaible for New data
  const [newArea, setnewArea] = useState()
  const [drawerSelectCountry, setDrawerSelectCountry] = useState();
  const [drawerSelectProvince, setDrawerSelectProvince] = useState();
  const [drawerSelectCity, setDrawerSelectCity] = useState();
  const [drawerSelectTown, setDrawerSelectTown] = useState();
  // State for drawer visibility
  const [visible, setVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
  const [cityData, setCityData] = useState()
  const [townData, settownData] = useState()
  const [areaData, setAreaData] = useState()
   // seaching variable
   const [filteredAreaData, setFilteredAreaData] = useState()
     // variable for editing
  const [editArea, setEditArea] = useState()
  const [editDisplay, setEditDisplay] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); 
        setCountriesData(response.DataSet.Table); 
        setProvincesData(response.DataSet.Table1)
        setSelectedCity(response.DataSet.Table2)
        setCityData(response.DataSet.Table2)
        settownData(response.DataSet.Table3)
        setAreaData(response.DataSet.Table4)
        setFilteredAreaData(response.DataSet.Table4)
      } catch (error) {
        console.error('Error fetching data:', error); 
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
    "Type": "area",
    "UserId": 1,
    "CountryId": drawerSelectCountry,
    "ProvinceId": drawerSelectProvince,
    "CityId": drawerSelectCity,
    "TownId": drawerSelectTown,
    "AreaId": null,
    "Country": null,
    "Province": null,
    "City": null,
    "Town": null,
    "Area": newArea
}
  const url = 'SetupLocationConfig'

  const handleSearch = () => {
    const filteredData = areaData.filter((area) => {
      let matchCountry = true;
      let matchProvince = true;
      let matchCity = true;
      let matchTown = true;
      let matchSearch = true;

      if (selectedCountry) {
        matchCountry = area.CountryId === selectedCountry;
      }

      if (selectedProvince) {
        matchProvince = area.ProvinceId === selectedProvince;
      }

      if (selectedCity) {
        matchCity = area.CityId === selectedCity;
      }

      if (selectedTown) {
        matchTown = area.TownId === selectedTown;
      }

      if (searchArea) {
        matchSearch = area.Area.toLowerCase().includes(searchArea.toLowerCase());
      }

      return matchCountry && matchProvince && matchCity && matchTown && matchSearch;
    });

    setFilteredAreaData(filteredData);
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
    onClose();
    const payloadToUse = editDisplay ? {
      ...payload,
      OperationId: 3, // Edit operation
      CountryId: drawerSelectCountry,
      ProvinceId: drawerSelectProvince,
      CityId: drawerSelectCity,
      TownId: drawerSelectTown,
      AreaId: editArea,
      Area: newArea,
    } : payload;
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
        openMessage('success', data.DataSet.Table[0].Message || 'Area added/updated successfully!');
        const updatedAreaData = data.DataSet.Table1
        setAreaData(updatedAreaData)
        setFilteredAreaData(updatedAreaData)
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error adding/updating the Area.');
      }
      } catch (error) {
        console.error('Error fetching location data:', error);
        openMessage('error', 'There was an error adding/updating the Area.');
      }
    };
    fetchData();
  }

  const onClose = () => {
    setVisible(false);
    setnewArea()
    setSelectedCountry()
    setselectedProvince()
    setSelectedTown()
    setSelectedCity()
    setDrawerSelectCountry()
    setDrawerSelectProvince()
    setDrawerSelectTown()
    setDrawerSelectCity()
    setEditDisplay()
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    setVisible(true); // Open the drawer
    setnewArea(record.Area);
    setEditDisplay(record.CityId)
    setEditArea(record.AreaId)
    setDrawerSelectCountry(record.CountryId)
    setDrawerSelectProvince(record.ProvinceId)
    setDrawerSelectCity(record.CityId)
    setDrawerSelectTown(record.TownId)
  }

  const handleDelete = (record) => {
    const payloadToUse = {
      ...payload,
      OperationId: 4,
      CountryId: record.CountryId,
      ProvinceId: record.ProvinceId,
      CityId: record.CityId,
      TownId: record.TownId,
      AreaId: record.AreaId
    } ;
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Area deleted successfully!');
        const updatedAreaData = data.DataSet.Table1
        setAreaData(updatedAreaData)
        setFilteredAreaData(updatedAreaData)
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error deleting the Area.');
      }
      } catch (error) {
        console.error('Error fetching location data:', error);
        openMessage('error', 'There was an error deleting the Area.');
      }
    };
    fetchData();
  }

  const searchPanel = (
    <div className='flex'>
      <Fragment>
        <div className='flex flex-col'>
          <p className='pb-1'>Country</p>
          <Select
            value={selectedCountry}
            showSearch
            optionFilterProp="children"
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
          <p className='pb-1 mr'>Province</p>
          <Select
            value={selectedProvince}
            showSearch
            optionFilterProp="children"
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
          <p className='ml-3 pb-1'>City</p>
          <Select
            value={selectedCity}
            placeholder='Select City'
            showSearch
            optionFilterProp="children"
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
          <p className='ml-3 pb-1'>Town</p>
          <Select
            value={selectedTown}
            placeholder={'Select Town'}
            showSearch
            optionFilterProp="children"
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
          placeholder={'Enter Area Name'}
          onChange={setsearchArea}
          style={{
            marginLeft: '10px'
          }}
        />
        <FormButton
          onClick={handleSearch}
          type='text'
          title='Search'
          icon={<SearchOutlined/>}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            marginLeft: '20px',
            marginTop: '26px'
          }}
        />
      </Fragment>
    </div>
  );

  const formDrawer = (
    <div>
      <Drawer
        title={editDisplay ? "Edit Area" : "Add Area"}
        placement="right"
        onClose={onClose}
        open={visible}
        size='large'
      >
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col ml-2'>
            <p className='pb-1'>Country</p>
            <Select
              value={drawerSelectCountry}
              showSearch
              optionFilterProp="children"
              onChange={(event) => {
                setDrawerSelectCountry(event)
              }}
              style={{
                width: '310px'
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
            <p className='ml-2 pb-1'>Province</p>
            <Select
              value={drawerSelectProvince}
              placeholder="Select Province"
              disabled={!drawerSelectCountry}
              showSearch
              optionFilterProp="children"
              onChange={(event) => {
                setDrawerSelectProvince(event)
              }}
              style={{ width: 310, marginLeft: '10px' }}
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
            <p className='ml-3 pb-1'>City</p>
            <Select
              value={drawerSelectCity}
              placeholder={'Select City'}
              style={{ width: 310, marginLeft: '10px' }}
              onChange={(value) => setDrawerSelectCity(value)}
              disabled={!drawerSelectProvince}
              showSearch
              optionFilterProp="children"
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
          <div className='flex flex-col'>
            <p className='ml-3 pb-1'>Town</p>
            <Select
              value={drawerSelectTown}
              placeholder={'Select Town'}
              style={{ width: 310, marginLeft: '10px' }}
              onChange={(value) => setDrawerSelectTown(value)}
              disabled={!drawerSelectCity}
              showSearch
              optionFilterProp="children"
            >
              {townData && townData
              .filter((town) => town.CityId === drawerSelectCity)
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
              width: '310px'
            }}
          />
        </div>
        <div className=' mt-6 ml-2'>
          <FormButton
            onClick={handleAdd}
            title={editDisplay ? "Edit Area" : "Add Area"}
            style={{
              color: 'white',
              backgroundColor: 'blue',
              width: '660px'
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
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this Province?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
          <Button icon={<DeleteOutlined />} />
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
        dataSource={filteredAreaData}
        addTitle='Create New Area'
        handleChange={handleChange}
      />
    </div>
  )
}

export default Area