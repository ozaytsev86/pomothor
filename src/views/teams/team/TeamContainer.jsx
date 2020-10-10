import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {withRouter} from 'react-router';
import Firebase from 'firebase';

import {Box, Divider, Grid, Paper, Typography} from '@material-ui/core';

import {addTeam, addTeamUser} from '../../../services/team.service';
import {updateNotification} from '../../../services/notification.service';
import {setCompleted, startPomodoro} from '../../../services/pomodoro.service';
import {isValidTeamUrl} from '../teams.helper';

import {CopyToClipboard, LoadingCircularProgress} from '../../../components';
import {Me} from './Me';
import {FocusForm} from './FocusForm';
import {NoTeams} from './NoTeams';
import {Users} from './Users';

import {routes} from '../../../constants/routes';
import {locale} from '../../../locale/en-us';

import notificationAudioSrc from '../../../statics/notification.wav';

const TeamContainer = (props) => {
  const {user} = props;
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [pomodorosList, setPomodorosList] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [isLoadingPomodoros, setIsLoadingPomodoros] = useState(true);
  const audioRef = useRef();

  useEffect(() => {
    if (isValidTeamUrl(id)) {
      const currentTeamUrl = `/teams/${id}`;
      const teamsRef = Firebase.database().ref(currentTeamUrl);
      teamsRef.once('value', snapshot => {
        const currTeam = snapshot.val();

        if (!currTeam) {
          // TODO: ask user to create a team instead of directly create it
          addTeam({user, id});
          addTeamUser({user, teamId: id})
        } else {
          if (currTeam.users.filter(userKey => userKey === user.uid).length === 0) {
            addTeamUser({user, teamId: id, users: currTeam.users});
          }
        }

        setCurrentTeam({id, ...currTeam});
        setIsLoading(false);
      });
    } else {
      props.history.push(routes.TeamNotFound);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentTeam && currentTeam.id) {
      const pomodorosRef = Firebase.database().ref(`/teams/${currentTeam.id}/pomodoros`);
      pomodorosRef.on('value', snapshot => {
        const list = snapshot.val();
        setPomodorosList(list || {});
        setIsLoadingPomodoros(false);
      });

      const notificationsRef = Firebase.database().ref(`/teams/${currentTeam.id}/notifications`);
      notificationsRef.on('value', snapshot => {
        const list = snapshot.val();
        setNotifications(list || {});
        setIsLoadingPomodoros(false);
      });
    }
  }, [currentTeam]);

  useEffect(() => {
    if (notifications && notifications[user.uid]) {
      const isUserFree = pomodorosList[notifications[user.uid]] && pomodorosList[notifications[user.uid]].completed;
      if (isUserFree) {
        audioRef && audioRef.current && audioRef.current.play();
        updateNotification({teamId: currentTeam.id, notification: '', userId: user.uid});
      }
    }
    // eslint-disable-next-line
  }, [pomodorosList]);

  const handleStartPomodoro = (minutes) => {
    startPomodoro({teamId: currentTeam.id, userId: user.uid, minutes});
  };
  const handleAddNotification = (pomodoro) => {
    updateNotification({teamId: currentTeam.id, notification: pomodoro.userId, userId: user.uid});
  };
  const handleDeleteNotification = () => {
    updateNotification({teamId: currentTeam.id, notification: '', userId: user.uid});
  };
  const handleComplete = (userId) => {
    setCompleted({teamId: currentTeam.id, userId});
  };

  const pomodorosListWithoutMyPomodoro = Object.keys(pomodorosList).filter(pomodoroKey => pomodoroKey !== user.uid);
  const teamName = window.location.href.substring(window.location.href.lastIndexOf('/') + 1).replaceAll('-', ' ');

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <Grid container direction="column" alignContent="center">
        <Grid item>
          <Box px={2}>
            <Typography variant="h2">{teamName}</Typography>
            {pomodorosListWithoutMyPomodoro.length !== 0
              && <Typography variant="body1">
                   <strong>{locale.TeamLink}: </strong>
                   {window.location.href}
                   <CopyToClipboard text={window.location.href}/>
                 </Typography>
            }
          </Box>
        </Grid>
      </Grid>
      <LoadingCircularProgress full isLoading={isLoadingPomodoros}>
        <Box p={2}>
          <Grid container direction="column" wrap="nowrap">
            <Grid item>
              <Paper>
                <Box p={2}>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Me user={user} pomodorosList={pomodorosList} onComplete={handleComplete}/>
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
              ? <Users
                  pomodorosList={pomodorosList}
                  user={user}
                  notifications={notifications}
                  onComplete={handleComplete}
                  onAddNotification={handleAddNotification}
                  onDeleteNotification={handleDeleteNotification}
                />
              : <NoTeams />
            }
          </Grid>
        </Box>
      </LoadingCircularProgress>
    </LoadingCircularProgress>
  );
};

export default withRouter(TeamContainer);
