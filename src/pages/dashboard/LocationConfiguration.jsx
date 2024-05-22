import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import Country from '../../screens/locationscreens/Country';
import Province from '../../screens/locationscreens/Province';
import City from '../../screens/locationscreens/City'
import Town from '../../screens/locationscreens/Town'
import Area from '../../screens/locationscreens/Area'


const onChange = (event) => {
  console.log("tabs are checkng now", event);
};

const { TabPane } = Tabs;

const LocationConfiguration = () => {
  
  return (
    <div style={{ padding: '20px' }}>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Country" key="1">
        <Country />
      </TabPane>
      <TabPane tab="Province" key="2">
        <Province />
      </TabPane>
      <TabPane tab="City" key="3">
        <City />
      </TabPane>
      <TabPane tab="Town" key="4">
        <Town />
      </TabPane>
      <TabPane tab="Area" key="5">
        <Area />
      </TabPane>
    </Tabs>
  </div>
  );
}
export default LocationConfiguration;