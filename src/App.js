import React, {useState, useEffect, useRef} from 'react';

import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './configs/firebaseConfig';

import {addPomodoro, startPomodoro, setCompleted} from './services/pomodoro.service';
import {updateNotification} from './services/notification.service';

import {Navbar} from './components/Navbar';
import {Countdown} from './components/Countdown';
import {CountdownCard} from './components/CountdownCard';

import {Avatar, Button, Box, Grid, TextField, Typography, LinearProgress} from '@material-ui/core';

import {locale} from './locale/en-us';
import {notificationsUrl, pomodorosUrl} from './constants/urls';

import notificationAudioSrc from './statics/notification.wav';
import {makeStyles} from '@material-ui/core/styles';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

const useStyles = makeStyles(theme => ({
  myCardAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

function App(props) {
  const {user, signOut, signInWithGoogle} = props;
  const [minutes, setMinutes] = useState(0);
  const [pomodorosList, setPomodorosList] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef();
  const classes = useStyles();

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
    const pomodorosRef = Firebase.database().ref(pomodorosUrl);
    pomodorosRef.on('value', snapshot => {
      const list = snapshot.val();
      setPomodorosList(list || {});
      setIsLoading(false);
    });

    const notificationsRef = Firebase.database().ref(notificationsUrl);
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
        updateNotification('', user.uid);
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
        <Box mb={4} pt={4} display="flex" alignItems="center">
          <Box mr={2}>
            <Avatar gutterBottom className={classes.myCardAvatar} alt={user.displayName} src={user.photoURL} />
          </Box>
          <Box>
            <Typography variant="h6" display="block">
              {user.displayName}
            </Typography>
            <Typography variant="h5" display="block" color="textSecondary">
              <Countdown time={pomodoro.time} onTick={onTick} />
            </Typography>
          </Box>
        </Box>
      </Grid>
    )
  };

  const handleStartPomodoro = (e) => {
    e.preventDefault();
    const time = Date.now() + (minutes * 60000);
    startPomodoro(user.uid, time);
  };

  const handleAddNotification = (pomodoro) => {
    updateNotification(pomodoro.userId, user.uid);
  };

  const handleDeleteNotification = () => {
    updateNotification('', user.uid);
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
                        {Object.keys(pomodorosList).map(pomodoroKey => (
                          pomodoroKey !== user.uid
                            ? <CountdownCard
                                pomodoro={pomodorosList[pomodoroKey]}
                                currentUserId={user.uid}
                                notifications={notifications}
                                onCounterComplete={handleComplete}
                                onAddNotification={handleAddNotification}
                                onDeleteNotification={handleDeleteNotification}
                              />
                            : null
                        ))}
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
