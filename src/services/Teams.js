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
    .eq('email', requestData.userEmail);

  if (data.length === 0) {
    return supabase
      .from('teams_users')
      .insert([{...requestData, isActive: true}])
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
    .eq('teamId', Number(teamId))
    .eq('creatorId', creatorId);

  if (data.length === 0) { // team exists
    return supabase
      .from('teams_users')
      .insert([{teamId, email, isActive: false}])
      .then(({data}) => {
        if (data.length === 0) {
          return Promise.reject('Team not found');
        }
        return Promise.resolve(data[0]);
      });
  }
};