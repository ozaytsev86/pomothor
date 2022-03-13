export const SET_USER_INFO = 'SET_USER_INFO';

export const AppReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload
      };
    default:
      return state;
  }
};
