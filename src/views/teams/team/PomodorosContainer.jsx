import React, {useState, useEffect, useRef} from 'react';
import Firebase from 'firebase';
import {Box, Grid, Typography, Paper, Divider} from '@material-ui/core';

import {startPomodoro, setCompleted} from '../../../services/pomodoro.service';
import {updateNotification} from '../../../services/notification.service';

import {CountdownCard, LoadingCircularProgress, CopyToClipboard} from '../../../components';
import {FocusForm} from './FocusForm';
import {MyPomodoro} from './MyPomodoro';

import {locale} from '../../../locale/en-us';
import notificationAudioSrc from '../../../statics/notification.wav';

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

  const pomodorosListWithoutMyPomodoro = Object.keys(pomodorosList).filter(pomodoroKey => pomodoroKey !== props.user.uid);

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <Box p={2}>
        <Grid container direction="column" wrap="nowrap">
          <Grid item>
            <Paper>
              <Box p={2}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <MyPomodoro user={props.user} pomodorosList={pomodorosList} onComplete={handleComplete}/>
                    <audio ref={audioRef} src={notificationAudioSrc} />
                  </Grid>
                  <Divider orientation="vertical" flexItem />
                  <Grid item>
                    <FocusForm onStart={handleStartPomodoro}/>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          {pomodorosListWithoutMyPomodoro.length
            ? <>
                <Box py={2}>
                  <Grid item>
                    <Box py={2}>
                      <Typography variant="h4" component="h4">{locale.Users}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Box>
              </>
            : <Box py={4} px={2}>
                <div className="u-display--flex u-flex-direction--column u-justify-content--center u-align-items--center">
                  <Typography gutterBottom variant="h4">
                    {locale.JustStarted}
                  </Typography>
                  <Typography gutterBottom variant="h6">
                    {locale.ShareTheLinkWithYourTeamAndStartPomothoring}
                  </Typography>
                  <Typography variant="body1">
                    {window.location.href}
                    <CopyToClipboard text={window.location.href}/>
                  </Typography>
                </div>
              </Box>
          }
        </Grid>
      </Box>
    </LoadingCircularProgress>
  );
};
