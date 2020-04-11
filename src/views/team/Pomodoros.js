import React, {useState, useEffect, useRef} from 'react';
import Firebase from 'firebase';
import {Box, Grid, Typography} from '@material-ui/core';

import {startPomodoro, setCompleted} from '../../services/pomodoro.service';
import {updateNotification} from '../../services/notification.service';

import {CountdownCard} from '../../components/CountdownCard';
import {LoadingCircularProgress} from '../../components/loadings/LoadingCircularProgress';
import {FocusForm} from './FocusForm';
import {MyPomodoro} from './MyPomodoro';

import {locale} from '../../locale/en-us';
import notificationAudioSrc from '../../statics/notification.wav';

export const Pomodoros = (props) => {
  const {user, team} = props;
  const [pomodorosList, setPomodorosList] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef();

  useEffect(() => {
    const pomodorosRef = Firebase.database().ref(`/teams/${team.id}/pomodoros`);
    pomodorosRef.on('value', snapshot => {
      const list = snapshot.val();
      setPomodorosList(list || {});
      setIsLoading(false);
    });

    const notificationsRef = Firebase.database().ref(`/teams/${team.id}/notifications`);
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
        updateNotification({teamId: team.id, notification: '', userId: user.uid});
      }
    }
  }, [pomodorosList]);

  const handleStartPomodoro = (minutes) => {
    startPomodoro({teamId: team.id, userId: user.uid, minutes});
  };
  const handleAddNotification = (pomodoro) => {
    updateNotification({teamId: team.id, notification: pomodoro.userId, userId: user.uid});
  };
  const handleDeleteNotification = () => {
    updateNotification({teamId: team.id, notification: '', userId: user.uid});
  };
  const handleComplete = (userId) => {
    setCompleted({teamId: team.id, userId});
  };

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <Grid container direction="column">
        {
          user
            ? <>
                <Grid item>
                  <Box py={4} px={2}>
                    <Grid container justify="space-between" alignItems="flex-end" spacing={2}>
                      <Grid item>
                        <MyPomodoro user={user} pomodorosList={pomodorosList} onComplete={handleComplete}/>
                        <audio ref={audioRef} src={notificationAudioSrc} />
                      </Grid>
                      <Grid item>
                        <FocusForm onStart={handleStartPomodoro}/>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box py={4} px={2}>
                    <Typography variant="h4" component="h4">{locale.Users}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box px={2}>
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
                  </Box>
                </Grid>
              </>
            : <Grid item xs={12}>
                <Typography variant="h4" component="h4">{locale.PleaseSignInCapitalize}</Typography>
              </Grid>
        }
      </Grid>
    </LoadingCircularProgress>
  );
};
