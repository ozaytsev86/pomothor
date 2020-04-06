import React, {useEffect, useState} from 'react';
import {Card, CardHeader, Grid, IconButton, Tooltip} from '@material-ui/core';
import {Notifications, NotificationsActive} from '@material-ui/icons';

import {BadgeAvatar} from './BadgeAvatar';
import {Counter} from './Counter';

import {locale} from '../locale/en-us';

export const CountdownCard = ({pomodoro, currentUserId, notifications, onAddNotification, onDeleteNotification, onCounterComplete}) => {
  const [isCompleted, setIsCompleted] = useState(pomodoro.completed);

  useEffect(() => {
    setIsCompleted(pomodoro.completed);
  }, [pomodoro.completed]);

  const badgeAvatarClass = isCompleted ? 'badge badgeCompleted' : 'badge badgeIncompleted';

  const CardHeaderAction = () => {
    const isUserInCurrentPomodoroNotifications = notifications && notifications[currentUserId] === pomodoro.userId;

    return isUserInCurrentPomodoroNotifications
      ? <Tooltip title={locale.RemoveNotification} placement="top">
          <IconButton onClick={onDeleteNotification}>
            <NotificationsActive />
          </IconButton>
        </Tooltip>
      : <Tooltip title={locale.NotifyMeWhenTheUserIsFree} placement="top">
          <span>
            <IconButton onClick={() => onAddNotification(pomodoro)} disabled={isCompleted}>
              <Notifications />
            </IconButton>
          </span>
        </Tooltip>
  };

  const handleOnComplete = () => {
    setIsCompleted(true);
    onCounterComplete(pomodoro.userId);
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
                <Counter pomodoro={pomodoro} onComplete={handleOnComplete} />
              }
            />
        </Card>
      }
    </Grid>
  )
};