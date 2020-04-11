import React, {useState, useEffect, useRef} from 'react';
import Firebase from 'firebase';
import {Box, Grid, Typography} from '@material-ui/core';

import {startPomodoro, setCompleted} from '../../services/pomodoro.service';
import {updateNotification} from '../../services/notification.service';

import {CountdownCard, LoadingCircularProgress} from '../../components';
import {FocusForm} from './FocusForm';
import {MyPomodoro} from './MyPomodoro';

import {locale} from '../../locale/en-us';
import notificationAudioSrc from '../../statics/notification.wav';

export const PomodorosContainer = (props) => {
  const [pomodorosList, setPomodorosList] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef();

  useEffect(() => {
    const pomodorosRef = Firebase.database().ref(`/teams/${props.team.id}/pomodoros`);
    pomodorosRef.on('value', snapshot => {
      const list = snapshot.val();
      setPomodorosList(list || {});
      setIsLoading(false);
    });

    const notificationsRef = Firebase.database().ref(`/teams/${props.team.id}/notifications`);
    notificationsRef.on('value', snapshot => {
      const list = snapshot.val();
      setNotifications(list || {});
      setIsLoading(false);
    });
  }, [props.team.id]);

  useEffect(() => {
    if (notifications && notifications[props.user.uid]) {
      const isUserFree = pomodorosList[notifications[props.user.uid]] && pomodorosList[notifications[props.user.uid]].completed;
      if (isUserFree) {
        audioRef && audioRef.current && audioRef.current.play();
        updateNotification({teamId: props.team.id, notification: '', userId: props.user.uid});
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodorosList]);

  const handleStartPomodoro = (minutes) => {
    startPomodoro({teamId: props.team.id, userId: props.user.uid, minutes});
  };
  const handleAddNotification = (pomodoro) => {
    updateNotification({teamId: props.team.id, notification: pomodoro.userId, userId: props.user.uid});
  };
  const handleDeleteNotification = () => {
    updateNotification({teamId: props.team.id, notification: '', userId: props.user.uid});
  };
  const handleComplete = (userId) => {
    setCompleted({teamId: props.team.id, userId});
  };

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <Grid container direction="column">
        {
          props.user
            ? <>
                <Grid item>
                  <Box py={4} px={2}>
                    <Grid container justify="space-between" alignItems="flex-end" spacing={2}>
                      <Grid item>
                        <MyPomodoro user={props.user} pomodorosList={pomodorosList} onComplete={handleComplete}/>
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
                        pomodoroKey !== props.user.uid
                          ? <Grid item xs={12} sm={6} md={4} lg={3}>
                              <CountdownCard
                                pomodoro={pomodorosList[pomodoroKey]}
                                currentUserId={props.user.uid}
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
