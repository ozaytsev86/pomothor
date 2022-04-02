import {supabase} from './Api';

export const createPomodoro = async ({teamId, email, time}) => {
  return supabase
    .from('teams_users')
    .update([{time}])
    .match({teamId, email})
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error.message);
      } else {
        return Promise.resolve(data);
      }
    });
};

export const removePomodoro = ({teamId, email}) => {
  return supabase
    .from('teams_users')
    .update([{time: null}])
    .match({teamId, email})
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error.message);
      } else {
        return Promise.resolve(data);
      }
    });
};
