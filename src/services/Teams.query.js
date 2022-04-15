import * as React from 'react';
import {createTeam, fetchTeam, fetchTeams, fetchTeamUser, fetchTeamUsers, inviteUserToTeam, joinTeam, removeUserFromTheTeam} from './Teams';
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

export const useFetchTeamUser = ({teamId, email}) => {
  return useQueryWithError(
    [Queries.TeamUser],
    () => fetchTeamUser({teamId, email})
  );
};

export const useJoinTeam = ({onSuccess}) => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    joinTeam,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.TeamUsers);
        onSuccess();
      }
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

export const useRemoveUserFromTheTeam = () => {
  const queryClient = useQueryClient();

  return useMutationWithError(
    removeUserFromTheTeam,
    {
      successMessage: 'The user was successfully removed from the team',
      onSuccess: () => {
        queryClient.invalidateQueries(Queries.TeamUsers);
      }
    }
  );
};