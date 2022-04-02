import {useQueryClient} from 'react-query';
import {useMutationWithError} from '../hooks/UseQueries';
import {Queries} from '../constants/Queries';
import {createPomodoro, removePomodoro} from './Pomodoro';

export const useCreatePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    createPomodoro,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Teams);
      }
    }
  );
};

export const useRemovePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    removePomodoro,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Teams);
      }
    }
  );
};
