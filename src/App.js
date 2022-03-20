import React, {useEffect} from 'react';
import {supabase} from './services/Api';
import {Auth} from './views/Auth';
import {Home} from './views/Home';
import {HOME, TEAMS, TEAMS_ID, TEAMS_NEW, TEAMS_NOT_FOUND} from './constants/Routes';
import {Route, Routes} from 'react-router-dom';
import 'normalize.css';
import './index.css';
import {Navbar} from './components/Navbar';
import {TeamsNew} from './views/teams/TeamsNew';
import {useAppStore} from './hooks/UseAppStore';
import {Teams} from './views/teams/Teams';
import {Team} from './views/teams/team/Team';
import {AlertContainer} from './components/alert/AlertContainer';

export const App = () => {
  const {userInfo, setUserInfo} = useAppStore();

  const addUserOnline = async (userInfo) => {
    if (userInfo.id) {
      const {data} = await supabase
        .from('teams_users')
        .select()
        .eq('userId', userInfo.id);

      // this is a temporary solution, until realtime will be implemented
      // create a users table to store metadata
      if (data.length !== 0) {
        await supabase
          .from('teams_users')
          .update({avatarUrl: userInfo.user_metadata.avatar_url, online: true})
          .match({userId: userInfo.id});
      }
    }
  };

  useEffect(() => {
    const session = supabase.auth.session();
    setUserInfo(session?.user ?? null);

    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUserInfo(currentUser ?? null);
      }
    );

    if (session?.user) {
      addUserOnline(session?.user);
    }

    return () => {
      authListener?.unsubscribe();
    };
  }, [userInfo]);

  return (
    <>
      <AlertContainer/>
      <Navbar/>
      {!userInfo
        ? <Auth/>
        : (
          <Routes>
            <Route path={HOME} element={<Home/>}/>
            <Route exact path={TEAMS} element={<Teams/>}/>
            <Route path={TEAMS_NEW} element={<TeamsNew/>}/>
            <Route path={TEAMS_ID} element={<Team/>}/>
            <Route path={TEAMS_NOT_FOUND} element={<div>Team not found</div>}/>
          </Routes>
        )
      }
    </>
  );
};
