import {Avatar, Box, Grid, Typography} from '@material-ui/core';
import {Countdown} from '../../components/Countdown';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  myCardAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export const MyPomodoro = (props) => {
  const pomodoro = props.pomodorosList[props.user.uid];
  const classes = useStyles();

  const onTick = ({counter}) => {
    if (counter === 0) props.onComplete(props.user.uid);
  };

  return (
    <Grid container direction="row" alignItems="center">
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
    </Grid>
  )
};