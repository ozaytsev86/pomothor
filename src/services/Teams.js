import {supabase} from './Api';
import {TeamUserStatuses} from '../enums/TeamUserStatuses';
import {sortBy} from '../utils/Sort';

export const createTeam = async ({name, creatorId, creatorEmail, isPrivate}) => {
  const {data: team} = await supabase
    .from('teams')
    .insert([{name, creatorId, isPrivate}]);

  return supabase
    .from('teams_users')
    .insert([{teamId: team[0].id, email: creatorEmail, status: TeamUserStatuses.accepted, online: true}])
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error.message);
      } else {
        return Promise.resolve(team[0]);
      }
    });
};

export const updateTeam = async ({teamId, creatorId, name, isPrivate}) => {
  return supabase
    .from('teams')
    .update([{name, isPrivate}])
    .match({id: teamId, creatorId})
    .then((data) => {
      if (data.error) {
        return Promise.reject('We weren\'t able to updated the team, please try again later');
      } else {
        return Promise.resolve();
      }
    });
};

export const fetchTeams = async (userEmail) => {
  const teamsIds = await supabase
    .from('teams_users')
    .select('teamId')
    .eq('email', userEmail)
    .then(({data}) => data);

  const publicTeams = await supabase
    .from('teams')
    .select()
    .match({isPrivate: false})
    .then(({data}) => data);

  const allTeams = publicTeams;

  if (teamsIds.length > 0) {
    const teamIdsFilter = teamsIds.map(t => `id.eq.${t.teamId}`).join();

    const userJoinedTeams = await supabase
      .from('teams')
      .select()
      .or(teamIdsFilter)
      .then(({data}) => data);

    if (userJoinedTeams.length > 0) {
      userJoinedTeams.forEach(team => {
        if (allTeams.filter(t => t.id === team.id).length === 0) {
          allTeams.push(team);
        }
      });
    }
  }

  return allTeams.sort(sortBy('id'));
};

export const fetchMyTeams = async ({userId, userEmail}) => {
  const teamsIds = await supabase
    .from('teams_users')
    .select('teamId')
    .eq('email', userEmail)
    .then(({data}) => data);

  const teamIdsFilter = teamsIds.map(t => `id.eq.${t.teamId}`).join();

  const createdTeams = await supabase
    .from('teams')
    .select()
    .match({creatorId: userId})
    .then(({data}) => data);

  const userJoinedTeamsAll = await supabase
    .from('teams')
    .select()
    .or(teamIdsFilter)
    .then(({data}) => data);

  const joinedTeams = [];

  if (userJoinedTeamsAll?.length > 0) {
    userJoinedTeamsAll.forEach(team => {
      if (createdTeams.filter(t => t.id === team.id).length === 0) {
        joinedTeams.push(team);
      }
    });
  }

  return {
    createdTeams,
    joinedTeams: joinedTeams.sort(sortBy('id'))
  };
};

export const fetchTeam = (id) => {
  return supabase
    .from('teams')
    .select()
    .eq('id', Number(id))
    .then(({data}) => {
      if (data.length === 0) {
        return Promise.reject('The team was not found');
      }
      return Promise.resolve(data[0]);
    });
};

export const joinTeam = async ({teamId, email}) => {
  await fetchTeam(teamId);

  const teamUser = await supabase
    .from('teams_users')
    .select()
    .limit(1)
    .single()
    .eq('teamId', teamId)
    .eq('email', email.toLowerCase())
    .then(({data}) => data);

  if (Boolean(teamUser) === false) {
    // new uninvited user
    return supabase
      .from('teams_users')
      .insert([{teamId, email: email.toLowerCase(), status: TeamUserStatuses.accepted, online: true}])
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error.message);
        } else {
          return Promise.resolve(data[0]);
        }
      });
  } else if (teamUser.status === TeamUserStatuses.invited) {
    // invited user
    return supabase
      .from('teams_users')
      .update([{teamId, email: email.toLowerCase(), status: TeamUserStatuses.accepted, online: true}])
      .match({email: teamUser.email})
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error.message);
        } else {
          return Promise.resolve(data[0]);
        }
      });
  }
};

export const removeTeam = async ({teamId, creatorId}) => {
  const team = await fetchTeam(teamId);

  if (team.creatorId === creatorId) {
    return supabase
      .from('teams_users')
      .delete()
      .match({teamId: Number(teamId)})
      .then(({data}) => {
        if (data === null) {
          return Promise.reject(`There was an error removing users from the team "${team.name}"`);
        }
        return supabase
          .from('teams')
          .delete()
          .match({id: Number(teamId), creatorId})
          .then(({data}) => {
            if (data === null) {
              return Promise.reject(`There was an error removing the team "${team.name}"`);
            }
            return Promise.resolve(data);
          });
      });
  } else {
    return Promise.reject(`You don't have permission to delete the team "${team.name}"`);
  }
  // remove teams_users where teamId
  // remove teams where teamId
};

export const leaveTeam = async ({teamId, email}) => {
  return supabase
    .from('teams_users')
    .delete()
    .match({teamId, email})
    .then(({data}) => {
      if (data.length === 0) {
        return Promise.reject('The team was not found');
      }
      return Promise.resolve(data[0]);
    });
};

export const inviteUserToTeam = async ({teamId, email, creatorId}) => {
  const {data} = await supabase
    .from('teams')
    .select()
    .eq('id', Number(teamId))
    .eq('creatorId', creatorId);

  if (data.length === 1) { // team exists
    return supabase
      .from('teams_users')
      .insert([{teamId: Number(teamId), email, status: TeamUserStatuses.invited}])
      .then(({data}) => {
        if (data.length === 0) {
          return Promise.reject('The team was not found');
        }
        return Promise.resolve(data[0]);
      });
  }

  return Promise.reject('The team was not found, please refresh the page and try again');
};

export const removeUserFromTheTeam = async ({teamUserId}) => {
  return supabase
    .from('teams_users')
    .delete()
    .match({id: Number(teamUserId)})
    .then(({data}) => {
      if (data === null) {
        return Promise.reject('The user was not found, please refresh the page and try again');
      }
      return Promise.resolve(data[0]);
    });
};

export const fetchTeamUsers = async (teamId) => {
  const teamUsers = await supabase
    .from('teams_users')
    .select()
    .eq('teamId', Number(teamId))
    .then(({data}) => data);

  const acceptedUsersEmails = teamUsers.filter(u => u.status === TeamUserStatuses.accepted).map(fu => `"${fu.email}"`).join();
  const invitedUsers = teamUsers.filter(u => u.status === TeamUserStatuses.invited);

  const acceptedUsers = await supabase
    .from('users')
    .select()
    .filter('email', 'in', `(${acceptedUsersEmails})`)
    .then(({data}) => {
      const joinedUsers = teamUsers.filter(u => u.status === TeamUserStatuses.accepted).map(teamUser => {
        const user = data.find(user => user.email === teamUser.email);

        return {
          id: teamUser.id,
          userId: user.id,
          name: user.name,
          avatarUrl: user.avatar_url,
          email: teamUser.email,
          teamId: teamUser.teamId,
          online: teamUser.online,
          time: teamUser.time
        };
      });

      return joinedUsers;
    });

  return {
    invitedUsers,
    acceptedUsers
  };
};

export const fetchTeamUser = async ({teamId, email}) => {
  return supabase
    .from('teams_users')
    .select()
    .eq('teamId', teamId)
    .eq('email', email)
    .then(({data}) => data);
};