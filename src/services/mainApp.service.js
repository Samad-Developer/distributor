import axios from "axios";
axios.defaults.baseURL = 'http://144.91.110.241:8086'

// mainApp.service.js
export const login = async (username, password) => {
    try {
      const response = await axios.post('/UserLogin', {
        UserName: username,
        Password: password,
      });
  
      if (response.data.Response === true) {
        const userData = response.data.DataSet.Table1[0];
        const menuItems = response.data.DataSet.Table2; // Assuming menu items are here
        return { userData, menuItems }; // Return both user data and menu items
      } else {
        throw new Error(response.data.ResponseMessage); // Throw error on failure
      }
    } catch (error) {
      throw error; // Re-throw error for handling in Login component
    }
  };

  function getNonNullValues(obj) {
    return Object.entries(obj)
      .filter(([key, value]) => value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }
  
  export const getData = async (url, payload = {}) => {
    try {
      const response = await axios.post(url, payload);
  
      if (response.status === 200) { // Check for successful HTTP status code
        return response.data; // Return the parsed data from the response
      } else {
        throw new Error(`API request failed with status code: ${response.status}`); // Throw a more informative error
      }
    } catch (error) {
      console.error('Error fetching data:', error); // Log the error for debugging
      throw error; // Re-throw the error for handling in calling components
    }
  };

  export const initialData = async () => {
    console.log('initial data is calling ')
    try {
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
      const response = await axios.post('SetupLocationConfig', payload);
  
      if (response.status === 200) { // Check for successful HTTP status code
        console.log('initial data response is coming', response.data)
        return response.data; // Return the parsed data from the response
      } else {
        throw new Error(`API request failed with status code: ${response.status}`); // Throw a more informative error
      }
    } catch (error) {
      console.error('Error fetching data:', error); // Log the error for debugging
      throw error; // Re-throw the error for handling in calling components
    }
  };
  