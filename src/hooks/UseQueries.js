import {useMutation, useQuery} from 'react-query';

import {useAlertStore} from './UseAlertStore';

export const useQueryWithError = (queryName, queryFunction, options = {}) => {
  const {createSuccessAlert, createErrorAlert} = useAlertStore();

  return useQuery(queryName, queryFunction, {
    ...options,
    onSuccess: (data) => {
      if (options.successMessage) createSuccessAlert(options.successMessage);
      options.onSuccess && options.onSuccess(data);
    },
    onError: createErrorAlert
  });
};

export const useMutationWithError = (queryFunction, options = {}) => {
  const {createSuccessAlert, createErrorAlert} = useAlertStore();

  return useMutation(queryFunction, {
    ...options,
    onSuccess: (data) => {
      if (options.successMessage) createSuccessAlert(options.successMessage);
      options.onSuccess && options.onSuccess(data);
    },
    onError: createErrorAlert
  });
};
