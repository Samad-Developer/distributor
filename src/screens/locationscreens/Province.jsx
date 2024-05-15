import React, { useState } from 'react'
import BasicForm from '../../components/formcomponents/BasicForm'
import { Fragment } from 'react'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import FormTextField from '../../components/generalcomponents/FormTextField'
import { CloseOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import { Drawer, Space, Button } from 'antd'
import { fetchUpdatedLocationSuccess } from '../../store/reducers/UpdatedLocationSlice'
import { useDispatch } from 'react-redux'
import { getData } from '../../services/mainApp.service'


const Province = () => {

  const dispatch = useDispatch()
  const [selectedCountry, setSelectedCountry] = useState()
  const [selectedProvince, setselectedProvince] = useState()
  const [newProvince, setNewProvince] = useState();
  const [visible, setVisible] = useState(false); // State for drawer visibility
  const locationData = JSON.parse(localStorage.getItem('InitialLocationData'));
  const [sortedInfo, setSortedInfo] = useState({});
  const countriesData = locationData.Table
  const initialProvincesData = locationData.Table1
  console.log('country  id', selectedCountry)
  const [provincesData, setProvincesData] = useState(initialProvincesData)
  const payload = {
    "OperationId": 2,
    "Type": "province",
    "UserId": 1,
    "CountryId": selectedCountry,
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

  }

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleAdd = () => {
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        dispatch(fetchUpdatedLocationSuccess(data.DataSet))
        const updatedLocationData = JSON.parse(localStorage.getItem('UpdatedLocationData'));
        const updatedCountriesData = updatedLocationData.Table1
        setProvincesData(updatedCountriesData)

      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
    setVisible(false)

  }

  const onClose = () => {
    setVisible(false);
    setNewCountry('')
  };

  const onOpen = () => {
    setVisible(true)
  }

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
        />
        <FormTextField
          label='province'
          value={selectedProvince}
          onChange={setselectedProvince}
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
    <div >
      <Drawer
        title="Add Province"
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <div className=''>
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
          />
          <FormTextField
            label="Province"
            placeholder="Enter Province Name"
            value={newProvince}
            onChange={setNewProvince}
            style={{
              width: '150px',
              marginTop: '10px'
            }}
          />
        </div>
        <div className='flex justify-end'>
          <FormButton
            onClick={handleAdd}
            title='Add Country'
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
          <Button type="text" >
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
        dataSource={provincesData}
      />
    </div>
  )
}

export default Province