import {supabase} from './Api';

export const createTeam = (requestData) => {
  return supabase
    .from('teams')
    .insert([requestData])
    .then(({data}) => data[0]);
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
    .eq('userId', requestData.userId);

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