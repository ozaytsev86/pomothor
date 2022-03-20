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

  useEffect(() => {
    const session = supabase.auth.session();
    setUserInfo(session?.user ?? null);

    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUserInfo(currentUser ?? null);
      }
    );

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
