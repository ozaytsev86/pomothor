import {supabase} from '../../services/Api';
import {useEffect} from 'react';

export const useSubscription = (
  callback,
  config
) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const subscription = supabase
      .from(config.table ?? '*')
      .on(config.event ?? '*', callback)
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */
};