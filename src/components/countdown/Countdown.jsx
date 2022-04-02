import {useEffect, useState} from 'react';

import {calculateTime, getMinutes, getSeconds} from './Countdown.helper';
import {Strong} from 'evergreen-ui';

export const Countdown = ({time = null, onTick, onComplete}) => {
  const [counter, setCounter] = useState(calculateTime(time));

  const minutes = getMinutes(counter);
  const seconds = getSeconds(counter);

  useEffect(() => {
    if (counter !== null) {
      const completed = counter === 0;
      // document.title = !completed ? `${minutes}:${seconds}` : 'Pomothor';
      onTick && onTick(completed);

      onComplete && completed && onComplete();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(calculateTime(time));
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <Strong color={counter !== null ? 'red500' : ''}>{counter !== null ? `${minutes}:${seconds}` : '-'}</Strong>
  );
};
