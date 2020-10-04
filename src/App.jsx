import './styles/elements/background.css';
import './styles/utils/utils.css';

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './configs/firebaseConfig';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';


import {LoadingLinearProgress, Navbar} from './components';
import {NewTeamContainer} from './views/teams/new/NewTeamContainer';
import TeamContainer from './views/teams/team/TeamContainer';
import {Home} from './views/home/Home';
import {TeamNotFound} from './views/teams/team/TeamNotFound';

import {routes} from './constants/routes';
import {TeamsContainer} from './views/teams/TeamsContainer';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

const theme = createMuiTheme({
  palette: {
    primary: blue,
  }
});

export const App = (props) => {
  const {user, signOut, signInWithGoogle} = props;

  return (
    <MuiThemeProvider theme={theme}>
      <main>
        <BrowserRouter>
          <LoadingLinearProgress isLoading={user === undefined}>
            <Navbar user={user} onSignIn={signInWithGoogle} onSignOut={signOut}/>
            <Switch>
              <Route exact path={routes.Home}>
                <Home/>
              </Route>
              {user && <>
                <Route exact path={routes.Teams}>
                  <TeamsContainer user={user}/>
                </Route>
                <Route path={routes.TeamsId}
                       render={({match}) => match.params.id === 'new'
                         ? <NewTeamContainer user={user}/>
                         : <TeamContainer user={user}/>
                       }
                />
                <Route path={routes.TeamNotFound}>
                  <TeamNotFound/>
                </Route>
              </>}
            </Switch>
          </LoadingLinearProgress>
        </BrowserRouter>
      </main>
    </MuiThemeProvider>
  );
};

export default withFirebaseAuth({providers, firebaseAppAuth,})(App);
