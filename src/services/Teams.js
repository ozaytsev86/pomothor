import {supabase} from './Api';

export const createTeam = (requestData) => {
  return supabase
    .from('teams')
    .insert([requestData]);
};

export const fetchTeams = () => {
  return supabase
    .from('teams')
    .then(({data}) => data);
};