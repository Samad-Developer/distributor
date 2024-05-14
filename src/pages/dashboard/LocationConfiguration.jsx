import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Country from '../../screens/locationscreens/Country';
import Province from '../../screens/locationscreens/Province';
import City from '../../screens/locationscreens/City'
import Town from '../../screens/locationscreens/Town'
import Area from '../../screens/locationscreens/Area'
// import { getData } from '../../services/mainApp.service';
// import { fetchLocationSuccess } from '../../store/reducers/locationSlice';
// import { useDispatch } from 'react-redux';

// const onChange = (event) => {
//   console.log("tabs are checkng now", event);
// };


const LocationConfiguration = () => {
  
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