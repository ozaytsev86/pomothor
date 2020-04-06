import Firebase from 'firebase';
import {notificationsUrl} from '../constants/urls';

const updateNotification = (notification, userId) => {
  const ref = Firebase.database().ref(notificationsUrl);
  ref.once('value')
    .then(() => {
      Firebase.database().ref(`${notificationsUrl}/${userId}`).set(notification);
    })
};

export {updateNotification};
