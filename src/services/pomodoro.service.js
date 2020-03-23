import Firebase from 'firebase';

const addPomodoro = (userId, pomodoro) => {
  const ref = Firebase.database().ref('/pomodoros');
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/pomodoros/${userId}`).set(pomodoro);
    })
};

const startPomodoro = (userId, time) => {
  const ref = Firebase.database().ref('/pomodoros');
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/pomodoros/${userId}/time`).set(time);
      Firebase.database().ref(`/pomodoros/${userId}/completed`).set(false);
    })
};

const setCompleted = (userId) => {
  const ref = Firebase.database().ref('/pomodoros');
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/pomodoros/${userId}/completed`).set(true);
    })
};


export {addPomodoro, startPomodoro, setCompleted};
