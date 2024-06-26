import React, { useState, useEffect } from 'react'
import { fetchUpdatedLocationSuccess } from '../../store/reducers/UpdatedLocationSlice'
import { CloseOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'; // Import CloseOutlined icon from Ant Design
import FormTextField from '../../components/generalcomponents/FormTextField'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import { getData, initialData } from '../../services/mainApp.service'
import BasicForm from '../../components/formcomponents/BasicForm'
import { Drawer, Space, Button, Popconfirm, message} from 'antd'
import { useDispatch } from 'react-redux'
import { Fragment } from 'react'


const Province = () => {

  const dispatch = useDispatch()
  const [selectedCountry, setSelectedCountry] = useState()  // variable for search
  const [searchProvince, setsearchProvince] = useState()
  const [newProvince, setNewProvince] = useState();  // varaible for New data
  const [drawerSelectCountry, setDrawerSelectCountry] = useState();
  const [visible, setVisible] = useState(false);  // State for drawer visibility
  const [sortedInfo, setSortedInfo] = useState({});
  const [countriesData, setCountriesData] = useState()
  const [provincesData, setProvincesData] = useState()
  const [filteredProvinces, setFilteredProvinces] = useState();    // State for filtered provinces
  const [editingCountry, setEditingCountry] = useState(null); // State for the country being edited
  const [editingProvince, setEditingProvince] = useState(null); // State for the country being edited

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await initialData();
        setCountriesData(response.DataSet.Table);
        setProvincesData(response.DataSet.Table1)
        setFilteredProvinces(response.DataSet.Table1)
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
    onClose();

    const payloadToUse = editingProvince ? {
      ...payload,
      OperationId: 3, // Edit operation
      CountryId: editingCountry,
      ProvinceId: editingProvince,
      Province: newProvince,
    } : payload;

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
        openMessage('success', data.DataSet.Table[0].Message || 'Province added/updated successfully!');
        const updatedProvinceData = data.DataSet.Table1
        setProvincesData(updatedProvinceData)
        setFilteredProvinces(updatedProvinceData)
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error adding/updating the province.');
      }
      } catch (error) {
        console.error('Error fetching location data:', error);
        openMessage('error', 'There was an error adding/updating the province.');
      }
    };

    fetchData();
    setEditingCountry(null)
  };

  const handleDelete = (record) => {

    const payloadToUse = {
      ...payload,
      OperationId: 4,
      CountryId: record.CountryId,
      ProvinceId: record.ProvinceId,
    };
    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        if (data.Response) {
          openMessage('success', data.DataSet.Table[0].Message || 'Province deleted successfully!');
        const updatedProvinceData = data.DataSet.Table1
        setProvincesData(updatedProvinceData)
        setFilteredProvinces(updatedProvinceData)
      } else {
        openMessage('error', data.ResponseMessage || 'There was an error deleting the province.');
      }
      } catch (error) {
        console.error('Error fetching location data:', error);
        openMessage('error', 'There was an error deleting the province.');
      }
    };
    fetchData();
  }

  const onClose = () => {
    setVisible(false);
    setNewProvince('');
    setEditingCountry(null);
    setEditingProvince(null);
    setDrawerSelectCountry()
  };

  const onOpen = () => {
    setVisible(true)
  }

  const handleEdit = (record) => {
    setNewProvince(record.Province);
    setEditingCountry(record.CountryId); // Set the country being edited
    setEditingProvince(record.ProvinceId)
    setDrawerSelectCountry(record.Country)
    setVisible(true); // Open the drawer
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
          placeholder={'Select Country'}
          value={selectedCountry}
          style={{
            width: '250px'
          }}

          onChange={(event) => {
            setSelectedCountry(event)
          }}
          filterOption={filterOption}
        />
        <FormTextField
          label='Province'
          value={searchProvince}
          placeholder={'Enter Province Name'}
          onChange={setsearchProvince}
          style={{
            marginLeft: '10px',
            width: '250px'
          }}
        />
        <FormButton
          onClick={handleSearch}
          type='text'
          title='Search'
          icon={<SearchOutlined/>}
          style={{
            backgroundColor: '#4F46E5',
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
        title={editingProvince ? "Edit Province" : "Add Province"}
        placement="right"
        onClose={onClose}
        open={visible}
        width={360}
      >
        <div className='flex flex-col'>
          <FormSelect
            options={countriesData}
            name="Country"
            label="Country"
            value={drawerSelectCountry}
            style={{
              width: '310px'
            }}
            filterOption={filterOption}
            onChange={(event) => {
              setDrawerSelectCountry(event)
              setEditingCountry(event)
            }}
          />
          <FormTextField
            label="Province"
            placeholder="Enter Province Name"
            value={newProvince}
            onChange={setNewProvince}
            style={{
              width: '310px',
              marginTop: '20px' 
            }}
          />
        </div>
        <div className=''>
          <FormButton
            onClick={handleAdd}
            title={editingProvince ? "Update" : "Add Province"}
            style={{
              color: 'white',
              backgroundColor: 'blue',
              marginTop: '30px',
              width: '100%',
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
      sorter: (a, b) => a.CountryId.localeCompare(b.CountryId),
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
        <Space >
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
        </Space >
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
      addTitle='Create New Province'
      handleChange={handleChange}
    />
  </div>
)
}

export default Province