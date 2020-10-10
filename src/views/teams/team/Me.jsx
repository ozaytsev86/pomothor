import React from 'react';
import {Avatar, Box, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import {Countdown} from '../../../components';

const useStyles = makeStyles(theme => ({
  myCardAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export const Me = (props) => {
  const pomodoro = props.pomodorosList[props.user.uid];
  const classes = useStyles();

  const onTick = ({counter}) => {
    if (counter === 0) props.onComplete(props.user.uid);
  };

  return (
    <Box display="flex" alignItems="center">
      <Box mr={2}>
        <Avatar className={classes.myCardAvatar} alt={props.user.displayName} src={props.user.photoURL}/>
      </Box>
      <Box>
        <Typography variant="h6" display="block">
          {props.user.displayName}
        </Typography>
        <Typography variant="h5" display="block" color="textSecondary">
          {pomodoro && <Countdown time={pomodoro.time} onTick={onTick}/>}
        </Typography>
      </Box>
    </Box>
  )
};