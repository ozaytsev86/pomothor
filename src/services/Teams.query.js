import * as React from 'react';
import {createTeam, fetchTeam, fetchTeams, fetchTeamUsers, inviteUserToTeam, joinTeam} from './Teams';
import {useMutationWithError, useQueryWithError} from '../hooks/UseQueries';
import {Queries} from '../constants/Queries';
import {useQueryClient} from 'react-query';

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

export const useFetchTeams = (userEmail) => {
  return useQueryWithError(
    [Queries.Teams],
    () => fetchTeams(userEmail)
  );
};

export const useFetchTeam = (id) => {
  return useQueryWithError(
    [Queries.Team],
    () => fetchTeam(id)
  );
};

export const useFetchTeamUsers = (id) => {
  return useQueryWithError(
    [Queries.TeamUsers],
    () => fetchTeamUsers(id)
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

export const useInviteUserToTeam = ({onSuccess}) => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    inviteUserToTeam,
    {
      successMessage: 'The user was successfully invited to the team',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.TeamUsers);
        onSuccess();
      }
    }
  );
};