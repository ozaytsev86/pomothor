import './styles/utils/utils.css';

import React from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './configs/firebaseConfig';

import {LoadingLinearProgress, Navbar} from './components';
import {TeamsContainer} from './views/teams/TeamsContainer';
import TeamContainer from './views/team/TeamContainer';
import {Home} from './views/Home';
import {TeamNotFound} from './views/team/TeamNotFound';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

export const App = (props) => {
  const {user, signOut, signInWithGoogle} = props;

  return (
    <main>
      <BrowserRouter>
        <LoadingLinearProgress isLoading={user === undefined}>
          <Navbar user={user} onSignIn={signInWithGoogle} onSignOut={signOut}/>
          {user
            ? <Switch>
                <Route exact path="/">
                  <div>Welcome back! <Link to="/teams">Use Pomothor</Link></div>
                </Route>
                <Route exact path="/teams">
                  <TeamsContainer user={user}/>
                </Route>
                <Route exact path="/teams/team-not-found">
                  <TeamNotFound/>
                </Route>
                <Route path="/teams/:id">
                  <TeamContainer user={user}/>
                </Route>
              </Switch>
            : <Switch>
                <Route path="/">
                  <Home/>
                </Route>
              </Switch>
          }
        </LoadingLinearProgress>
      </BrowserRouter>
    </main>
  );
};

export default withFirebaseAuth({providers, firebaseAppAuth,})(App);