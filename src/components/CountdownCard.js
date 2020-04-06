import React, {useState} from 'react';
import {Card, CardHeader, Chip, Grid, IconButton, Tooltip} from '@material-ui/core';
import {green, pink} from '@material-ui/core/colors';
import {Alarm, AlarmOn, Notifications, NotificationsActive} from '@material-ui/icons';

import {BadgeAvatar} from './BadgeAvatar';
import {Countdown} from './Countdown';

import {locale} from '../locale/en-us';

export const CountdownCard = ({pomodoro, currentUserId, notifications, onAddNotification, onDeleteNotification, onCounterComplete}) => {
  const [counter, setCounter] = useState(0);

  const badgeAvatarClass = counter === 0 ? 'badge badgeCompleted' : 'badge badgeIncompleted';

  const CardHeaderAction = () => {
    const isUserInCurrentPomodoroNotifications = notifications && notifications[currentUserId] === pomodoro.userId;

    return isUserInCurrentPomodoroNotifications
      ? <Tooltip title={locale.RemoveNotification} placement="top">
        <IconButton onClick={onDeleteNotification}>
          <NotificationsActive />
        </IconButton>
      </Tooltip>
      : <Tooltip title={locale.NotifyMeWhenTheUserIsFree} placement="top">
        <IconButton onClick={() => onAddNotification(pomodoro)}>
          <Notifications />
        </IconButton>
      </Tooltip>
  };

  const handleTick = ({counter}) => {
    setCounter(counter);
    if (counter === 0) {
      onCounterComplete(pomodoro.userId);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {currentUserId !== pomodoro.userId
        && <Card>
          <CardHeader
            avatar={<BadgeAvatar className={badgeAvatarClass} alt={pomodoro.userName} src={pomodoro.userPhotoURL} />}
            title={pomodoro.userName}
            action={<CardHeaderAction />}
            subheader={
              <Chip label={<Countdown time={pomodoro.time} onTick={handleTick} />}
                    size="small"
                    color="primary"
                    style={{backgroundColor: counter === 0 ? green[500] : pink[500]}}
                    icon={counter === 0 ? <AlarmOn /> : <Alarm />}
              />
            }
          />
        </Card>
      }
    </Grid>
  )
};