import Firebase from 'firebase';
import {pomodorosUrl} from '../constants/urls';

const getTime = (minutes) => Date.now() + (minutes * 60000);

const getPomodoro = (user, minutes) => ({
  userId: user.uid,
  userName: user.displayName,
  userPhotoURL: user.photoURL,
  time: getTime(minutes),
  completed: false
});

const addPomodoro = ({teamId, user, minutes}) => {
  const ref = Firebase.database().ref(`/teams/${teamId}/pomodoros`);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/teams/${teamId}/pomodoros/${user.uid}`).set(getPomodoro(user, minutes));
    })
};

const startPomodoro = ({teamId, userId, minutes}) => {
  const ref = Firebase.database().ref(`/teams/${teamId}/pomodoros`);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/teams/${teamId}/pomodoros/${userId}/time`).set(getTime(minutes));
      Firebase.database().ref(`/teams/${teamId}/pomodoros/${userId}/completed`).set(false);
    })
};

const setCompleted = ({teamId, userId}) => {
  const ref = Firebase.database().ref(`/teams/${teamId}/pomodoros`);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/teams/${teamId}/pomodoros/${userId}/completed`).set(true);
    })
};


export {addPomodoro, startPomodoro, setCompleted};
