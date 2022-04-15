import React, {useEffect} from 'react';
import {supabase} from './services/Api';
import {Auth} from './views/Auth';
import {Home} from './views/Home';
import {HOME, SETTINGS, TEAMS, TEAMS_ID, TEAMS_MY, TEAMS_NEW, TEAMS_NOT_ACCEPTED, TEAMS_NOT_FOUND, TEAMS_NOT_INVITED, TEAMS_NOT_JOINED} from './constants/Routes';
import {Link, Route, Routes} from 'react-router-dom';
import 'normalize.css';
import './index.css';
import {Navbar} from './components/Navbar';
import {TeamsNew} from './views/teams/TeamsNew';
import {useAppStore} from './hooks/UseAppStore';
import {Teams} from './views/teams/Teams';
import {Team} from './views/teams/team/Team';
import {AlertContainer} from './components/alert/AlertContainer';
import {Provider} from 'react-supabase';
import {createClient} from '@supabase/supabase-js';
import {Settings} from './views/settings/Settings';
import {TeamsMy} from './views/teams/TeamsMy';

const client = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

export const App = () => {
  const {userInfo, setUserInfo} = useAppStore();

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const currentUser = session?.user;
        setUserInfo(currentUser ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUserInfo(null);
      }
    });

    return () => {
      supabase.removeSubscription(authSubscription);
    };
  }, [userInfo]);

  return (
    <>
      <AlertContainer/>
      <Navbar/>
      {!userInfo
        ? <Auth/>
        : (
          <Provider value={client}>
            <Routes>
              <Route path={HOME} element={<Home/>}/>
              <Route exact path={TEAMS} element={<Teams/>}/>
              <Route path={TEAMS_NEW} element={<TeamsNew/>}/>
              <Route path={TEAMS_MY} element={<TeamsMy/>}/>
              <Route path={TEAMS_ID} element={<Team/>}/>
              <Route path={TEAMS_NOT_FOUND} element={<div>Team not found</div>}/>
              <Route path={TEAMS_NOT_INVITED} element={<div>It looks like you're not a team member, please ask the admin for an invite</div>}/>
              <Route path={TEAMS_NOT_ACCEPTED} element={<div>You haven't accepted the invitation yet</div>}/>
              <Route path={TEAMS_NOT_JOINED} element={<div>You haven't join this team yet, you can do it from the <Link to={TEAMS}>teams</Link> page</div>}/>
              <Route path={SETTINGS} element={<Settings/>}/>
            </Routes>
          </Provider>
        )
      }
    </>
  );
};
