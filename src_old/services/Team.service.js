import Firebase from 'firebase';

const getInitialPomodoro = (user) => ({
  userId: user.uid,
  userName: user.displayName,
  userPhotoURL: user.photoURL,
  time: Date.now(),
  completed: true
});

const addTeam = ({user, teamId}) => {
  const ref = Firebase.database().ref(`/teams/${teamId}`);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/teams/${teamId}/users`).set([user.uid]);
      Firebase.database().ref(`/teams/${teamId}/pomodoros/${user.uid}`).set(getInitialPomodoro(user));
    })
};

const addTeamUser = ({user, teamId, users = []}) => {
  const ref = Firebase.database().ref(`/teams/${teamId}`);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/teams/${teamId}/users`).set([...users, user.uid]);
      Firebase.database().ref(`/teams/${teamId}/pomodoros/${user.uid}`).set(getInitialPomodoro(user));
    })
};

export {addTeam, addTeamUser};
