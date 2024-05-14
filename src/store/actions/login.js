export const loginRequest = () => ({ type: 'LOGIN_REQUEST' });
export const loginSuccess = (userData) => ({ type: 'LOGIN_SUCCESS', payload: userData });
export const loginFailure = (error) => ({ type: 'LOGIN_FAILURE', payload: error });
export const logout = () => ({ type: 'LOGOUT' });
