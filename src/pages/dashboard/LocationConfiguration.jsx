import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Country from '../../screens/locationscreens/Country';
import Province from '../../screens/locationscreens/Province';
import City from '../../screens/locationscreens/City'
import Town from '../../screens/locationscreens/Town'
import Area from '../../screens/locationscreens/Area'
import { getData } from '../../services/mainApp.service';
import { fetchLocationSuccess } from '../../store/reducers/locationSlice';
import { useDispatch } from 'react-redux';

// const onChange = (event) => {
//   console.log("tabs are checkng now", event);
// };


const LocationConfiguration = () => {
  const dispatch = useDispatch();

  // Payload for First page open
  const payload = {
    "OperationId": 1,
    "Type": "all",
    "UserId": 1,
    "CountryId": null,
    "ProvinceId": null,
    "CityId": null,
    "TownId": null,
    "AreaId": null,
    "Country": null,
    "Province": null,
    "City": null,
    "Town": null,
    "Area": null
  }
  // url
  const url = 'SetupLocationConfig'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(url, payload);
        dispatch(fetchLocationSuccess(data.DataSet))
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchData();
  }, [])


  return (
    <Tabs
      defaultActiveKey="1"
      onChange={(event) => onChange(event)}
      items={[
        {
          label: `Country`,
          key: '1',
          children: <Country />,
        },
        {
          label: `Province`,
          key: '2',
          children: <Province />,
        },
        {
          label: `City`,
          key: '3',
          children: <City />,
        },
        {
          label: `Town`,
          key: '4',
          children: <Town />,
        },
        {
          label: `Area`,
          key: '5',
          children: <Area />,
        }
      ]}
    />
  );
}
export default LocationConfiguration;