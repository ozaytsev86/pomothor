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
import {TeamsContainer} from './views/teams/TeamsContainer';
import TeamContainer from './views/team/TeamContainer';
import {Home} from './views/home/Home';
import {TeamNotFound} from './views/team/TeamNotFound';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  status: {
    danger: 'orange',
  },
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
              <Route exact path="/">
                <Home/>
              </Route>
              {user && <>
                <Route exact path="/teams">
                  <TeamsContainer user={user}/>
                </Route>
                <Route exact path="/teams/team-not-found">
                  <TeamNotFound/>
                </Route>
                <Route path="/teams/:id">
                  <TeamContainer user={user}/>
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
