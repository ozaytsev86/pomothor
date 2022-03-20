import {supabase} from './Api';

export const createTeam = async ({name, creatorId, creatorEmail, isPrivate}) => {
  const {data: team} = await supabase
    .from('teams')
    .insert([{name, creatorId, isPrivate}]);

  return supabase
    .from('teams_users')
    .insert([{teamId: team[0].id, email: creatorEmail, userId: creatorId}])
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error.message);
      } else {
        return Promise.resolve(team[0]);
      }
    });
};

export const fetchTeams = () => {
  return supabase
    .from('teams')
    .select()
    .eq('isPrivate', false)
    .then(({data}) => data);
};

export const fetchTeam = (id) => {
  return supabase
    .from('teams')
    .select()
    .eq('id', Number(id))
    .then(({data}) => {
      if (data.length === 0) {
        return Promise.reject('Team not found');
      }
      return Promise.resolve(data[0]);
    });
};

export const joinTeam = async (requestData) => {
  const {data} = await supabase
    .from('teams_users')
    .select()
    .eq('teamId', requestData.teamId)
    .eq('userId', requestData.userId)
    .eq('email', requestData.email);

  if (data.length === 0) {
    return supabase
      .from('teams_users')
      .insert([{...requestData}])
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error.message);
        } else {
          return Promise.resolve(data);
        }
      });
  }

  return Promise.resolve(data);
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
      .insert([{teamId, email}])
      .then(({data}) => {
        if (data.length === 0) {
          return Promise.reject('Team not found');
        }
        return Promise.resolve(data[0]);
      });
  }

  return Promise.reject('The team was not found, please refresh the page and try again');
};

export const fetchTeamUsers = (teamId) => {
  return supabase
    .from('teams_users')
    .select()
    .eq('teamId', Number(teamId))
    .then(({data}) => data);
};