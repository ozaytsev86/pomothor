import React from 'react';

import {Avatar, Badge} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export const BadgeAvatar = (props) => {
  const classes = useStyles();

  return (
    <Badge overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
                className={props.countdownData.completed ? 'badge badgeCompleted' : 'badge badgeIncompleted'}
    >
      <Avatar alt={props.pomodoro.userName} src={props.pomodoro.userPhotoURL} className={classes.avatarLarge}/>
    </Badge>
  )
};
