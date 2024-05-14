
const initialState = {
    isLoggedIn: false,
    userData: null,
    error: null,
    loading: false,
  };
  
  const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_REQUEST':
        return { ...state, loading: true };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isLoggedIn: true,
          userData: action.payload,
          loading: false,
          error: null,
        };
      case 'LOGIN_FAILURE':
        return { ...state, loading: false, error: action.payload };
      case 'LOGOUT':
        return { ...initialState };
      default:
        return state;
    }
  };

  export default loginReducer;