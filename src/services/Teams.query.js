import * as React from 'react';
import {createTeam, fetchTeam, fetchTeams, inviteUserToTeam, joinTeam} from './Teams';
import {useMutationWithError, useQueryWithError} from '../hooks/UseQueries';
import {Queries} from '../constants/Queries';
import {useQuery, useQueryClient} from 'react-query';

export const useCreateTeam = ({onSuccess}) => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    createTeam,
    {
      successMessage: 'The team was successfully created',
      onSuccess: ({id}) => {
        queryClient.invalidateQueries(Queries.Teams);
        onSuccess(id);
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

export const useFetchTeam = (id) => {
  return useQuery(
    [Queries.Team],
    () => fetchTeam(id)
  );
};

export const useJoinTeam = ({onSuccess}) => {
  return useMutationWithError(
    joinTeam,
    {
      onSuccess
    }
  );
};

export const useInviteUserToTeam = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    inviteUserToTeam,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.Teams);
      }
    }
  );
};