import React, { useState, useEffect } from 'react';
import { loginRequest, loginSuccess, loginFailure } from '../../store/actions/login';
import { fetchMenuItemsRequest, fetchMenuItemsSuccess, fetchMenuItemsFailure } from '../../store/reducers/menuSlice'; // Import actions
import FormTextField from '../../components/generalcomponents/FormTextField'; // Assuming the path
import { login } from '../../services/mainApp.service';
import { Form, Button, message, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../../services/mainApp.service';
import { fetchLocationSuccess } from '../../store/reducers/locationSlice';

const Login = () => {
  const loading = useSelector((state) => state.login.userData);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // getting initial data of locations here .....................
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


  const handleSubmit = async (event) => {
    event.preventDefault();
    // Form validation (optional, customize as needed)
    if (!username || !password) {
      message.error('Please enter username and password');
      return;
    }
    try {
      dispatch(loginRequest()); // Dispatch login request action
      const { userData, menuItems } = await login(username, password);

      if (userData) {
        dispatch(fetchMenuItemsSuccess(menuItems));
        localStorage.setItem('ADMIN_TOKEN', userData.JWT);
        dispatch(loginSuccess(userData)); // Dispatch login success action
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(response.data.ResponseMessage)); // Dispatch login failure action
        message.error(response.data.ResponseMessage);
      }
    } catch (error) {
      dispatch(loginFailure(error.message)); // Dispatch login failure action on any errors
      message.error('Login failed: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 ">Sign in to your account</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <FormTextField // Use InputText component for Username
            label="Username"
            placeholder="example@gmail.com"
            value={username}
            onChange={setUsername}
            size={"large"}
          />
          <FormTextField // Use InputText component for Password
            label="Password"
            placeholder="********"
            type="password" // Set type to password for security
            value={password}
            onChange={setPassword}
            size={"large"}
          />
          <Form.Item>
            <div className="mt-5">
              <button
                htmlType="submit" onClick={handleSubmit} disabled={loading}
                className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                type="submit"
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>

            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
