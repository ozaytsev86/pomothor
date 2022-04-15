import {supabase} from './Api';

export const createPomodoro = async ({userId, workTime, breakTime, pomodoros, longBreakTime, status, startedAt, isOnWork = true}) => {
  const currentPomodoro = await supabase
    .from('current_pomodoros')
    .select()
    .eq('userId', userId)
    .then(({data}) => data);

  if (currentPomodoro.length > 0) {
    return supabase
      .from('current_pomodoros')
      .update([{workTime, breakTime, pomodoros, longBreakTime, status, startedAt, isOnWork}])
      .match({userId})
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error.message);
        } else {
          return Promise.resolve(data);
        }
      });
  } else {
    return supabase
      .from('current_pomodoros')
      .insert([{userId, workTime, breakTime, pomodoros, longBreakTime, status, startedAt, isOnWork}])
      .then((data) => {
        if (data.error) {
          return Promise.reject(data.error.message);
        } else {
          return Promise.resolve(data);
        }
      });
  }
};

export const removePomodoro = ({userId}) => {
  return supabase
    .from('current_pomodoros')
    .delete()
    .match({userId});
};

export const updatePomodoro = ({userId, workTime, breakTime, pomodoros, longBreakTime, status, startedAt, isOnWork}) => {
  return supabase
    .from('current_pomodoros')
    .update([{workTime, breakTime, pomodoros, longBreakTime, status, startedAt, isOnWork}])
    .match({userId})
    .then((data) => {
      if (data.error) {
        return Promise.reject(data.error.message);
      } else {
        return Promise.resolve(data);
      }
    });
};

const getTime = (userId, data) => {
  // const hoursDiff = Math.floor((new Date().getTime() - new Date(data.startedAt).getTime()) / 1000 / 60 / 60);
  const minutesDiff = Math.floor((new Date().getTime() - new Date(data.startedAt).getTime()) / 1000 / 60);
  const secondsDiff = Math.floor((new Date().getTime() - new Date(data.startedAt).getTime()) / 1000);

  if (data.isOnWork) {
    return {
      minutes: data.workTime - minutesDiff - 1,
      seconds: 60 - (secondsDiff - minutesDiff * 60)
    };
  } else {
    if (data.pomodoros > 0) {
      return {
        minutes: data.breakTime - minutesDiff - 1,
        seconds: 60 - (secondsDiff - minutesDiff * 60)
      };
    } else {
      return {
        minutes: data.longBreakTime - minutesDiff - 1,
        seconds: 60 - (secondsDiff - minutesDiff * 60)
      };
    }
  }
};

export const fetchPomodoro = ({userId}) => {
  return supabase
    .from('current_pomodoros')
    .select()
    .eq('userId', userId)
    .then(({data}) => {
      if (data.length > 0) {
        const {minutes, seconds} = getTime(userId, data[0]);

        return {
          pomodoros: data[0].pomodoros,
          status: data[0].status,
          isOnWork: data[0].isOnWork,
          time: {
            minutes,
            seconds
          }
        };
      }
      return {};
    });
};