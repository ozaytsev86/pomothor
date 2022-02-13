import Firebase from 'firebase';

const updateNotification = ({teamId, notification, userId}) => {
  const ref = Firebase.database().ref(`/teams/${teamId}/notifications`);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`/teams/${teamId}/notifications/${userId}`).set(notification);
    })
};

export {updateNotification};
