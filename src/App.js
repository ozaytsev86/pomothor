import React, {useState, useEffect, useRef} from 'react';

import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './configs/firebaseConfig';

import {Navbar} from './components/navbar';
import {BadgeAvatar} from './components/BadgeAvatar';
import {Status} from './components/Status';
import Countdown from 'react-countdown';

import {Button, Box, Grid, Card, CardHeader, IconButton, TextField, Typography, LinearProgress, Tooltip} from '@material-ui/core';
import {Notifications, NotificationsActive} from '@material-ui/icons';

import {locale} from './locale/en-us';
import notificationAudioSrc from './notification.wav';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

function App(props) {
  const {user, signOut, signInWithGoogle,} = props;
  const [minutes, setMinutes] = useState(0);
  const [pomodorosList, setPomodorosList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    getPomodorosListData();
  }, []);

  const MyCard = ({pomodoro}) => {
    return (
      <Card>
        <Countdown
          date={pomodoro.time}
          renderer={(countdownData) => (
            <CardHeader
              avatar={<BadgeAvatar countdownData={countdownData} pomodoro={pomodoro}/>}
              title={pomodoro.userName}
              subheader={
                <Status
                  user={user}
                  countdownData={countdownData}
                  pomodoro={pomodoro}
                  pomodorosList={pomodorosList}
                  onComplete={handleComplete}
                  onNotify={handleNotify}
                />
              }
            />)
          }
        />
      </Card>
    )
  };

  const CardHeaderAction = ({currentPomodoro = {}, pomodoro}) => {
    const isUserInMyNotifications = currentPomodoro.notifications && currentPomodoro.notifications.filter(item => item.userId === pomodoro.userId);

    return isUserInMyNotifications
      ? <Tooltip title={locale.RemoveNotification} placement="top">
          <IconButton onClick={() => handleDeleteNotification()}>
            <NotificationsActive />
          </IconButton>
        </Tooltip>
      : <Tooltip title={locale.NotifyMeWhenTheUserIsFree} placement="top">
          <IconButton onClick={() => handleAddNotification(pomodoro)}>
            <Notifications />
          </IconButton>
        </Tooltip>
  };

  const Counter = (pomodoroKey) => {
    const pomodoro = pomodorosList[pomodoroKey];
    const currentPomodoro = pomodorosList[user.uid];

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        {user.uid !== pomodoro.userId
          ? <Card>
              <Countdown
                date={pomodoro.time}
                renderer={(countdownData) => (
                  <CardHeader
                    avatar={<BadgeAvatar countdownData={countdownData} pomodoro={pomodoro}/>}
                    title={pomodoro.userName}
                    action={<CardHeaderAction currentPomodoro={currentPomodoro} pomodoro={pomodoro} />}
                    subheader={
                      <Status
                        user={user}
                        pomodorosList={pomodorosList}
                        countdownData={countdownData}
                        pomodoro={pomodoro}
                        onComplete={handleComplete}
                      />
                    }
                  />)
                }
              />
            </Card>
          : <MyCard pomodoro={pomodoro} />
        }
      </Grid>
    )
  };

  const getPomodorosListData = () => {
    setIsLoading(true);
    let ref = Firebase.database().ref('/pomodoros');
    ref.on('value', snapshot => {
      const list = snapshot.val();
      setPomodorosList(list || {});
      setIsLoading(false);
    });
  };

  const handleStartPomodoro = (e) => {
    e.preventDefault();
    const currentPomodoro = pomodorosList[user.uid] || {};

    const ref = Firebase.database().ref('/pomodoros');
    ref.once('value')
      .then(() => {
        const pomodoro = {
          ...currentPomodoro,
          userId: user.uid,
          userName: user.displayName,
          userPhotoURL: user.photoURL,
          time: Date.now() + (minutes * 60000),
          completed: false
        };
        Firebase.database().ref(`/pomodoros/${user.uid}`).set(pomodoro);
    })
  };

  const handleAddNotification = (pomodoro) => {
    const currentPomodoro = pomodorosList[user.uid];

    const ref = Firebase.database().ref('/pomodoros');
    ref.once('value')
      .then(() => {
        const newPomodoro = {...currentPomodoro, notifications: [{userId: pomodoro.userId, notified: false}]};
        Firebase.database().ref(`/pomodoros/${user.uid}`).set(newPomodoro);
      })
  };

  const handleDeleteNotification = () => {
    const currentPomodoro = pomodorosList[user.uid];

    const ref = Firebase.database().ref('/pomodoros');
    ref.once('value')
      .then(() => {
        const newPomodoro = {...currentPomodoro, notifications: []};
        Firebase.database().ref(`/pomodoros/${user.uid}`).set(newPomodoro);
      })
  };

  const handleComplete = () => {
    const currentPomodoro = pomodorosList[user.uid];
    audioRef.current.play();

    const ref = Firebase.database().ref('/pomodoros');
    ref.once('value')
      .then(() => {
        const newPomodoro = {...currentPomodoro, completed: true};
        Firebase.database().ref(`/pomodoros/${user.uid}`).set(newPomodoro);
      })
  };

  const handleNotify = () => {
    const currentPomodoro = pomodorosList[user.uid];
    const ref = Firebase.database().ref('/pomodoros');
    ref.once('value')
      .then(() => {
        const newPomodoro = {...currentPomodoro, notifications: [{userId: currentPomodoro.notifications[0].userId, notified: true}]};
        Firebase.database().ref(`/pomodoros/${user.uid}`).set(newPomodoro);
      })
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
                      <Grid container justify="flex-end" alignItems="flex-end" spacing={2}>
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
                        {Object.keys(pomodorosList).map(pomodoroKey => Counter(pomodoroKey))}
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

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
