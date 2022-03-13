import * as React from 'react';

import {uuidv4} from '../../utils/Guid';

import {ADD_ALERT, AlertReducer, initialState, REMOVE_ALERT} from './Alert.reducer';

export const AlertStoreProvider = ({children}) => {
  const [alertState, dispatch] = React.useReducer(AlertReducer, initialState);

  const addAlert = (alert) => {
    dispatch({type: ADD_ALERT, payload: {id: uuidv4(), ...alert}});
  };

  const removeAlert = (alertId) => {
    dispatch({type: REMOVE_ALERT, payload: {id: alertId}});
  };

  const createSuccessAlert = (message) => addAlert({type: 'success', message, msec: 5000});
  const createInfoAlert = (message) => addAlert({type: 'info', message, msec: 5000});
  const createWarningAlert = (message) => addAlert({type: 'warning', message});
  const createErrorAlert = (message) => addAlert({type: 'danger', message});

  return (
    <AlertContext.Provider value={{
      ...alertState,
      createSuccessAlert,
      createInfoAlert,
      createWarningAlert,
      createErrorAlert,
      removeAlert
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const AlertContext = React.createContext(initialState);
