import Firebase from 'firebase';

const getTime = (minutes) => Date.now() + (minutes * 60000);

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


export {startPomodoro, setCompleted};
