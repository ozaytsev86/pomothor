import React, {useState} from 'react';
import {Chip} from '@material-ui/core';
import {green, pink} from '@material-ui/core/colors';
import {Alarm, AlarmOn} from '@material-ui/icons';

import {Countdown} from './Countdown';

export const Counter = (props) => {
  const [counter, setCounter] = useState(0);

  const handleOnTick = ({counter}) => {
    setCounter(counter);
    if (counter === 0) {
      props.onComplete();
    }
  };

  return (
    <Chip label={<Countdown time={props.pomodoro.time} onTick={handleOnTick}/>}
          size="small"
          color="primary"
          style={{backgroundColor: counter === 0 ? green[500] : pink[500]}}
          icon={counter === 0 ? <AlarmOn /> : <Alarm />}
    />
  );
};