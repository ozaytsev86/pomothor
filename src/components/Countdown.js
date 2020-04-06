import React, {useEffect, useState} from 'react';

import {formatToTwoNumbers} from '../utils/number';

import {locale} from '../locale/en-us';

const calculateTime = (t) => {
  const startTimeStamp = new Date(t).getTime();
  const total = Math.round(
    parseFloat(
      (Math.max(0, startTimeStamp - Date.now()) / 1000).toFixed(
        Math.max(0, Math.min(20, 0))
      )
    ) * 1000
  );

  return total / 1000;
};

export const Countdown = ({time, onTick}) => {
  const [counter, setCounter] = useState(calculateTime(time));

  const hours = formatToTwoNumbers(Math.floor((counter / 3600) % 24));
  const minutes = formatToTwoNumbers(Math.floor((counter / 60) % 60));
  const seconds = formatToTwoNumbers(Math.floor(counter % 60));

  useEffect(() => {
    onTick && onTick({counter, hours, minutes, seconds});
  }, [counter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(calculateTime(time));
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);




  return (
    counter !== 0 ? `${hours}:${minutes}:${seconds}` : locale.Free
  );
};
