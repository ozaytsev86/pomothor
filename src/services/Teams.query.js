import * as React from 'react';
import {createTeam, fetchTeams} from './Teams';
import {useAppStore} from '../hooks/UseAppStore';
import {useMutationWithError, useQueryWithError} from '../hooks/UseQueries';
import {Queries} from '../constants/Queries';
import {useQueryClient} from 'react-query';

export const useCreateTeam = ({onSuccess}) => {
  const {userInfo} = useAppStore();
  const queryClient = useQueryClient();

  return useMutationWithError(
    (data) => createTeam({...data, creatorId: userInfo.id}),
    {
      successMessage: 'The team was successfully created',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Teams);
        onSuccess();
      }
    }
  );
};

export const useFetchTeams = () => {
  return useQueryWithError(
    [Queries.Teams],
    fetchTeams
  );
};