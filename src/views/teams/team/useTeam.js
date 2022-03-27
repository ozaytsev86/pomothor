import {supabase} from '../../../services/Api';
import {Queries} from '../../../constants/Queries';
import {useEffect} from 'react';
import {useQueryClient} from 'react-query';
import {useAppStore} from '../../../hooks/UseAppStore';

export const useTeamUsersSubscribeUnsubscribe = () => {
  const queryClient = useQueryClient();
  let teamUsersSubscription = null;

  useEffect(() => {
    teamUsersSubscription = supabase
      .from('teams_users')
      .on('*', (payload) => {
        queryClient.invalidateQueries(Queries.TeamUsers);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(teamUsersSubscription);
    };
  }, []);
};

export const useUpdateTeamUserStatus = () => {
  const {userInfo} = useAppStore();

  const addUserOnline = async () => {
    const {data} = await supabase
      .from('teams_users')
      .select()
      .eq('email', userInfo.email);

    if (data.length !== 0) {
      await supabase
        .from('teams_users')
        .update({online: true})
        .match({email: userInfo.email});
    }
  };

  const removeUserOnline = async () => {
    await supabase
      .from('teams_users')
      .update({online: false})
      .match({email: userInfo.email});
  };

  useEffect(() => {
    addUserOnline();

    return () => {
      removeUserOnline();
    };
  }, []);
};