import React, {useState, useEffect} from 'react';

import withFirebaseAuth from 'react-with-firebase-auth'
import Firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './configs/firebaseConfig';

import {Navbar} from './components/navbar';
import Countdown from 'react-countdown';

import {makeStyles} from '@material-ui/core/styles';
import {green, pink} from '@material-ui/core/colors';
import {Button, Box, Avatar, Grid, Badge, Card, CardHeader, TextField, Chip, Typography, LinearProgress} from '@material-ui/core';
import {AlarmOn, Alarm} from '@material-ui/icons';

import {locale} from './locale/en-us';

const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new Firebase.auth.GoogleAuthProvider(),
};

const useStyles = makeStyles(theme => ({
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function App(props) {
  const {user, signOut, signInWithGoogle,} = props;
  const [minutes, setMinutes] = useState(0);
  const [pomodorosList, setPomodorosList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    getPomodorosListData();
  }, []);

  const BadgeAvatar = (props) => {
    return <Badge overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant="dot"
                  className={props.completed ? 'badge badgeCompleted' : 'badge badgeIncompleted'}
    >
      <Avatar alt={props.userName} src={props.userPhotoURL} className={classes.avatarLarge}/>
    </Badge>
  };

  const formatToTwoNumbers = (number) => number.toString().length === 1 ? `0${number}` : number;

  const Status = ({hours, minutes, seconds, completed, userId}) => {
    const label = completed ? 'Free' : `${formatToTwoNumbers(hours)}:${formatToTwoNumbers(minutes)}:${formatToTwoNumbers(seconds)}`;

    if (userId === user.uid && !completed) document.title = `Pomothor - ${label}`;

    return (
      <Chip label={label}
            size="small"
            color="primary"
            style={{backgroundColor: completed ? green[500] : pink[500]}}
            icon={completed ? <AlarmOn /> : <Alarm />}
      />
    )
  };

  const Counter = (pomodoroKey) => {
    const pomodoro = pomodorosList[pomodoroKey];

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>
          <Countdown date={pomodoro.time}
                     renderer={(countdownData) => (
                       <CardHeader avatar={BadgeAvatar({...countdownData, ...pomodoro})}
                                   title={pomodoro.userName}
                                   subheader={Status({...countdownData, ...pomodoro})}
                       />)
                     }
          />
        </Card>
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
    const ref = Firebase.database().ref('/pomodoros');
    ref.once('value')
      .then(() => {
        const pomodoro = {userId: user.uid, userName: user.displayName, userPhotoURL: user.photoURL, time: Date.now() + (minutes * 60000)};
        Firebase.database().ref(`/pomodoros/${user.uid}`).set(pomodoro);
    })
  };

  return (
    isLoading
      ? <LinearProgress />
      : <>
        <Navbar user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
          <Grid container
                direction="column"
          >
            {
              user
                ? <Box px={4}>
                    <Grid item>
                      <Grid container
                            justify="flex-end"
                            alignItems="flex-end"
                            spacing={2}
                      >
                        <Grid item>
                          <Box py={4}>
                            <form onSubmit={(e) => handleStartPomodoro(e)}>
                              <TextField id="time" label={locale.FocusTimeCapitalize} placeholder={locale.MinutesLowercase} onChange={(e) => setMinutes(e.target.value)}/>
                              <Button type="submit" variant="contained" color="primary">{locale.Start}</Button>
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
                      <Grid container
                            spacing={2}
                      >
                          {Object.keys(pomodorosList).map(pomodoroKey => {
                            console.log(pomodorosList[pomodoroKey])
                            return Counter(pomodoroKey)
                          })}
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
