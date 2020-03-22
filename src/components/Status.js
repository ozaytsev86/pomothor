import React from 'react';

import {Chip} from '@material-ui/core';
import {green, pink} from '@material-ui/core/colors';
import {Alarm, AlarmOn} from '@material-ui/icons';

import {locale} from '../locale/en-us';

const formatToTwoNumbers = (number) => number.toString().length === 1 ? `0${number}` : number;

export const Status = (props) => {
  const label = props.countdownData.completed
    ? locale.Free
    : `${formatToTwoNumbers(props.countdownData.hours)}:${formatToTwoNumbers(props.countdownData.minutes)}:${formatToTwoNumbers(props.countdownData.seconds)}`;

  if (props.pomodoro.userId === props.user.uid) {
    if (props.pomodoro.notifications && props.pomodorosList[props.pomodoro.notifications[0].userId].completed) {
      if (!props.pomodoro.notifications[0].notified) {
        props.onNotify();
      }
      document.title = `Pomothor - ${label} (x)`;
    } else {
      document.title = `Pomothor - ${label}`;
    }
  }

  // trigger onComplete
  !props.pomodoro.completed && props.countdownData.completed && props.onComplete(props.user.uid);

  return (
    <Chip label={label}
          size="small"
          color="primary"
          style={{backgroundColor: props.countdownData.completed ? green[500] : pink[500]}}
          icon={props.countdownData.completed ? <AlarmOn /> : <Alarm />}
    />
  )
};
