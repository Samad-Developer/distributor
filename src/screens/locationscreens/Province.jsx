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


const Province = () => {

  const dispatch = useDispatch()
  // variable for search
  const [selectedCountry, setSelectedCountry] = useState()
  const [searchProvince, setsearchProvince] = useState()
  // varaible for New data
  const [newProvince, setNewProvince] = useState();
  // todo
  const [drawerSelectCountry, setDrawerSelectCountry] = useState();
  // State for drawer visibility
  const [visible, setVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
    // State for filtered provinces
    const [filteredProvinces, setFilteredProvinces] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData(); // Call the initialData function
        console.log('response is coming in province jsx')
        setCountriesData(response.DataSet.Table); // Log the response data
        setProvincesData(response.DataSet.Table1)
        setFilteredProvinces(response.DataSet.Table1)
        // Handle the response data as needed
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      }
    };
    fetchData()
  }, [])

  const payload = {
    "OperationId": 2,
    "Type": "province",
    "UserId": 1,
    "CountryId": drawerSelectCountry,       
    "ProvinceId": null,
    "CityId": null,
    "TownId": null,
    "AreaId": null,
    "Country": null,
    "Province": newProvince,
    "City": null,
    "Town": null,
    "Area": null
  }
  const url = 'SetupLocationConfig'

  const handleSearch = () => {
    if (!selectedCountry && !searchProvince) {
      setFilteredProvinces(provincesData); // Reset filter if no country and no search input
    } else {
      const filtered = provincesData.filter(province =>
        (!selectedCountry || province.CountryId === selectedCountry) &&
        (!searchProvince || province.Province.toLowerCase().includes(searchProvince.toLowerCase()))
      );
      setFilteredProvinces(filtered);
    }
    setSelectedCountry()
    setsearchProvince()
  }
  

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleAdd = () => {
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        const updatedProvinceData = data.DataSet.Table1
        setProvincesData(updatedProvinceData)
        setFilteredProvinces(updatedProvinceData)
        // setCountriesData()
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
    setVisible(false)

  }

  const onClose = () => {
    setVisible(false);
    setNewProvince('')
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    console.log('edit record is comming', record)
    setNewProvince(record.Province)
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
        <FormTextField
          label='province'
          value={searchProvince}
          onChange={setsearchProvince}
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
        title="Add Province"
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
            style={{
              width: '150px'
            }}
            filterOption={filterOption}
            onChange={(event) => {
              setDrawerSelectCountry(event)
            }}
          />
          <FormTextField
            label="Province"
            placeholder="Enter Province Name"
            value={newProvince}
            onChange={setNewProvince}
            style={{
              width: '200px',
              marginLeft: '10px'
            }}
          />
        </div>
        <div className='flex justify-end'>
          <FormButton
            onClick={handleAdd}
            title='Add Province'
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
        dataSource={filteredProvinces}
        addTitle='New Province'
        handleChange={handleChange}
      />
    </div>
  )
}

export default Province