import {useQueryClient} from 'react-query';
import {useEffect} from 'react';
import {supabase} from '../../../services/Api';
import {Queries} from '../../../constants/Queries';

export const useTeamUserPomodoroSubscribeUnsubscribe = (userId) => {
  const queryClient = useQueryClient();
  let userPomodoroSubscription = null;

  useEffect(() => {
    userPomodoroSubscription = supabase
      .from(`current_pomodoros:userId=eq.${userId}`)
      .on('*', (payload) => {
        queryClient.invalidateQueries(Queries.UserPomodoro);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(userPomodoroSubscription);
    };
  }, []);
};