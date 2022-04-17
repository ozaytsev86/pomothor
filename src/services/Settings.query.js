import {useQueryClient} from 'react-query';
import {useMutationWithError, useQueryWithError} from '../hooks/UseQueries';
import {Queries} from '../constants/Queries';
import {createTiming, fetchTimings, removeTiming} from './Settings';

export const useCreateTiming = ({onSuccess}) => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    createTiming,
    {
      successMessage: 'The timing was successfully created',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Timings);
        onSuccess();
      }
    }
  );
};

export const useRemoveTiming = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    removeTiming,
    {
      successMessage: 'The timing was successfully created',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Timings);
      }
    }
  );
};

export const useFetchTimings = (userId) => {
  return useQueryWithError(
    [Queries.Timings],
    () => fetchTimings(userId)
  );
};