import React, {useEffect, useState} from 'react';
import {supabase} from './services/api';
import {Auth} from './components/Auth';
import {Home} from './views/Home';
import {HOME, TEAMS, TEAMS_NOT_FOUND} from './constants/Routes';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import 'normalize.css';
import './index.css';
import {queryClientConfig} from './configs/ReactQuery';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Navbar} from './components/Navbar';

export const App = () => {
  const queryClient = new QueryClient(queryClientConfig);

  const [user, setUser] = useState(null);
  // useMatch
  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const {data: authListener} = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar user={user}/>
      <BrowserRouter>
        {!user
          ? <Auth/>
          : (
            <Routes>
              <Route exact path={HOME} element={<Home user={user}/>}/>
              <Route exact path={TEAMS} element={<div>Teams</div>}>
                <Route path=":id" element={<div>Teams ID</div>}/>
                <Route path="new" element={<div>Teams New</div>}/>
              </Route>
              <Route path={TEAMS_NOT_FOUND} element={<div>Team not found</div>}/>
            </Routes>
          )
        }
      </BrowserRouter>
    </QueryClientProvider>
  );
};
