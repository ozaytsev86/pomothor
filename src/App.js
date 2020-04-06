import React, {useState, useEffect, useRef} from 'react';

import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './configs/firebaseConfig';

import {addPomodoro, startPomodoro, setCompleted} from './services/pomodoro.service';

import {Navbar} from './components/Navbar';
import {Countdown} from './components/Countdown';
import {CountdownCard} from './components/CountdownCard';

import {Avatar, Button, Box, Grid, TextField, Typography, LinearProgress} from '@material-ui/core';

import {locale} from './locale/en-us';
import notificationAudioSrc from './statics/notification.wav';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

function App(props) {
  const {user, signOut, signInWithGoogle} = props;
  const [minutes, setMinutes] = useState(0);
  const [pomodorosList, setPomodorosList] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    if (user) {
      const newPomodoro = {
        userId: user.uid,
        userName: user.displayName,
        userPhotoURL: user.photoURL,
        time: Date.now(),
        completed: true
      };
      addPomodoro(user.uid, newPomodoro);
    }
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    const pomodorosRef = Firebase.database().ref('/pomodoros');
    pomodorosRef.on('value', snapshot => {
      const list = snapshot.val();
      setPomodorosList(list || {});
      setIsLoading(false);
    });

    const notificationsRef = Firebase.database().ref('/notifications');
    notificationsRef.on('value', snapshot => {
      const list = snapshot.val();
      setNotifications(list || {});
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (notifications && notifications[user.uid]) {
      const isUserFree = pomodorosList[notifications[user.uid]] && pomodorosList[notifications[user.uid]].completed;
      if (isUserFree) {
        audioRef && audioRef.current && audioRef.current.play();
        updateNotification('');
      }
    }
  }, [pomodorosList]);

  const MyCard = () => {
    const pomodoro = pomodorosList[user.uid];

    const onTick = ({counter}) => {
      if (counter === 0) handleComplete(user.uid);
    };

    return (
      <Grid container direction="row" alignItems="center">
        <Avatar alt={user.displayName} src={user.photoURL} />
        <Typography variant="h5" component="h5">Time: <Countdown time={pomodoro.time} onTick={onTick} /></Typography>
      </Grid>
    )
  };

  const updateNotification = (notification) => {
    const ref = Firebase.database().ref(`/notifications`);
    ref.once('value')
      .then(() => {
        Firebase.database().ref(`/notifications/${user.uid}`).set(notification);
      })
  };

  const handleStartPomodoro = (e) => {
    e.preventDefault();
    const time = Date.now() + (minutes * 60000); //60000
    startPomodoro(user.uid, time);
  };

  const handleAddNotification = (pomodoro) => {
    updateNotification(pomodoro.userId);
  };

  const handleDeleteNotification = () => {
    updateNotification('');
  };

  const handleComplete = (userId) => {
    setCompleted(userId);
  };

  return (
    isLoading
      ? <LinearProgress />
      : <>
        <Navbar user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
          <Grid container direction="column">
            {
              user
                ? <Box px={4}>
                    <Grid item>
                      <Grid container justify="space-between" alignItems="flex-end" spacing={2}>
                        <Grid item>
                          <MyCard />
                        </Grid>
                        <Grid item>
                          <Box py={4}>
                            <form onSubmit={(e) => handleStartPomodoro(e)}>
                              <TextField
                                id="time"
                                label={locale.FocusTimeCapitalize}
                                placeholder={locale.MinutesLowercase}
                                onChange={(e) => setMinutes(e.target.value)}
                              />
                              <Button type="submit" variant="contained" color="primary">{locale.Start}</Button>
                              <audio ref={audioRef} src={notificationAudioSrc} />
                            </form>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Box pb={2}>
                        <Typography variant="h4" component="h4">{locale.Users}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        {Object.keys(pomodorosList).map(pomodoroKey => <CountdownCard
                                                                         pomodoro={pomodorosList[pomodoroKey]}
                                                                         currentUserId={user.uid}
                                                                         notifications={notifications}
                                                                         onCounterComplete={handleComplete}
                                                                         onAddNotification={handleAddNotification}
                                                                         onDeleteNotification={handleDeleteNotification}
                                                                       />)}
                      </Grid>
                    </Grid>
                  </Box>
                : <Grid item xs={12}>
                    <Typography variant="h4" component="h4">{locale.PleaseSignInCapitalize}</Typography>
                  </Grid>
            }
          </Grid>
        </>
  );
}

export default withFirebaseAuth({providers, firebaseAppAuth,})(App);
