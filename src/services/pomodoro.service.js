import Firebase from 'firebase';
import {pomodorosUrl} from '../constants/urls';

const addPomodoro = (userId, pomodoro) => {
  const ref = Firebase.database().ref(pomodorosUrl);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`${pomodorosUrl}/${userId}`).set(pomodoro);
    })
};

const startPomodoro = (userId, time) => {
  const ref = Firebase.database().ref(pomodorosUrl);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`${pomodorosUrl}/${userId}/time`).set(time);
      Firebase.database().ref(`${pomodorosUrl}/${userId}/completed`).set(false);
    })
};

const setCompleted = (userId) => {
  const ref = Firebase.database().ref(pomodorosUrl);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`${pomodorosUrl}/${userId}/completed`).set(true);
    })
};


export {addPomodoro, startPomodoro, setCompleted};
