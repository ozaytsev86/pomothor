import {useQueryClient} from 'react-query';
import {useMutationWithError, useQueryWithError} from '../hooks/UseQueries';
import {Queries} from '../constants/Queries';
import {createPomodoro, fetchPomodoro, removePomodoro, updatePomodoro} from './Pomodoro';

export const useCreatePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    createPomodoro,
    {
      successMessage: 'The pomodoro was successfully started',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Pomodoros);
        queryClient.invalidateQueries(Queries.UserPomodoro);
      }
    }
  );
};

export const useUpdatePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    updatePomodoro,
    {
      successMessage: 'The pomodoro was successfully updated',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Pomodoros);
        queryClient.invalidateQueries(Queries.UserPomodoro);
      }
    }
  );
};

export const useRemovePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    removePomodoro,
    {
      successMessage: 'The pomodoro was successfully stopped',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Pomodoros);
        queryClient.invalidateQueries(Queries.UserPomodoro);
      }
    }
  );
};

export const useFetchPomodoro = ({userId, enabled}) => {
  return useQueryWithError(
    [Queries.UserPomodoro, userId],
    () => fetchPomodoro({userId}),
    {enabled}
  );
};
