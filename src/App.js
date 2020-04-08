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

import {Avatar, Button, Box, Grid, TextField, Typography} from '@material-ui/core';

import {locale} from './locale/en-us';
import {notificationsUrl, pomodorosUrl} from './constants/urls';

import notificationAudioSrc from './statics/notification.wav';
import {makeStyles} from '@material-ui/core/styles';
import {LoadingLinearProgress} from './components/loadings/LoadingLinearProgress';

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
  const [pomodorosList, setPomodorosList] = useState([]);
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
    if (user && notifications && notifications[user.uid]) {
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
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Avatar className={classes.myCardAvatar} alt={user.displayName} src={user.photoURL} />
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

  const FocusForm = (props) => {
    const [minutes, setMinutes] = useState(0);

    const handleStart = (e) => {
      e.preventDefault();
      props.onStart(minutes)
    };

    return <form onSubmit={(e) => handleStart(e)}>
             <TextField
               id="time"
               label={locale.FocusTimeCapitalize}
               placeholder={locale.MinutesLowercase}
               onChange={(e) => setMinutes(e.target.value)}
             />
             <Button type="submit" variant="contained" color="primary">{locale.Start}</Button>
             <audio ref={audioRef} src={notificationAudioSrc} />
           </form>
  };

  const handleStartPomodoro = (minutes) => {
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
    <LoadingLinearProgress isLoading={isLoading}>
      <Navbar user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
      <Grid container direction="column">
        {
          user
            ? <Box px={4}>
                <Grid item>
                  <Box py={4}>
                    <Grid container justify="space-between" alignItems="flex-end" spacing={2}>
                      <Grid item>
                        <MyCard />
                      </Grid>
                      <Grid item>
                        <FocusForm onStart={handleStartPomodoro} />
                      </Grid>
                    </Grid>
                  </Box>
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
                        ? <Grid item xs={12} sm={6} md={4} lg={3}>
                            <CountdownCard
                              pomodoro={pomodorosList[pomodoroKey]}
                              currentUserId={user.uid}
                              notifications={notifications}
                              onCounterComplete={handleComplete}
                              onAddNotification={handleAddNotification}
                              onDeleteNotification={handleDeleteNotification}
                            />
                          </Grid>
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
    </LoadingLinearProgress>
  );
}

export default withFirebaseAuth({providers, firebaseAppAuth,})(App);
