import {supabase} from './Api';

export const createTiming = async (requestParams) => {
  return supabase
    .from('users_settings_timings')
    .insert(requestParams)
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error.message);
      } else {
        return Promise.resolve();
      }
    });
};

export const removeTiming = (id) => {
  return supabase
    .from('users_settings_timings')
    .delete()
    .match({id});
};

export const fetchTimings = (userId) => {
  console.log('caca');
  return supabase
    .from('users_settings_timings')
    .select()
    .eq('userId', userId)
    .then(({data}) => {
      console.log('data', data);
      return data;
    });
};
