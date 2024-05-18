import React, { useState, useEffect, Fragment } from 'react'
import { CloseOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import FormTextField from '../../components/generalcomponents/FormTextField'
import FormSelect from '../../components/generalcomponents/FormSelect'
import FormButton from '../../components/generalcomponents/FormButton'
import { getData, initialData } from '../../services/mainApp.service';
import BasicForm from '../../components/formcomponents/BasicForm'
import { Drawer, Space, Button, Popconfirm, message } from 'antd'

const Country = () => {

  const [countries, setCountries] = useState()
  const [selectedCountry, setselectedCountry] = useState();   // State for searching
  const [newCountry, setNewCountry] = useState('');  // State for Adding new data
  const [visible, setVisible] = useState(false);   // State for drawer visibility
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredCountries, setFilteredCountries] = useState();   // State for filtered countries
  const [editingCountry, setEditingCountry] = useState(null); // State for the country being edited
  const [messageApi, contextHolder] = message.useMessage();

  const openMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };
  
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

  const handleEdit = (record) => {
    setNewCountry(record.Country);
    setEditingCountry(record.CountryId); // Set the country being edited
    setVisible(true); // Open the drawer
  }
  const handleDelete = (record) => {
  
    const payloadToUse = {
      ...payload,
      OperationId: 4, // Edit operation
      CountryId: record.CountryId,
      Country: null,
    };

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
      
          openMessage('success', 'Deleted Successfully!');
        
        const updatedCountriesData = data.DataSet.Table1;
        setCountries(updatedCountriesData);
        setFilteredCountries(updatedCountriesData); // Update filteredCountries after adding or editing a country
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
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

    const payloadToUse = editingCountry ? {
      ...payload,
      OperationId: 3, // Edit operation
      CountryId: editingCountry,
      Country: newCountry
    } : payload;

    const fetchData = async () => {
      try {
        const data = await getData(url, payloadToUse);
        const updatedCountriesData = data.DataSet.Table1;
        setCountries(updatedCountriesData);
        setFilteredCountries(updatedCountriesData); // Update filteredCountries after adding or editing a country
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    onClose();
    fetchData();
  };


  const onClose = () => {
    setVisible(false);
    setNewCountry('');
    setEditingCountry(null); // Reset the editing state
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
        title={editingCountry ? "Edit Country" : "Add Country"}
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleAdd}>
              {editingCountry ? "Update" : "OK"}
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
            title={editingCountry ? "Update" : "Add Country"}
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
          {contextHolder}
            <EditTwoTone onClick={() => handleEdit(record)} />
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this Country?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="danger">
              <DeleteTwoTone/>
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