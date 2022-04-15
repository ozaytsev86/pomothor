import {useEffect, useRef, useState} from 'react';
import {Strong} from 'evergreen-ui';
import {formatToTwoNumbers} from '../../utils/Number';

export const Countdown = ({isOnWork = false, time = null, color = 'gray900', onTick, onComplete}) => {
  const [currentMinutes, setCurrentMinutes] = useState();
  const [currentSeconds, setCurrentSeconds] = useState();
  const minutesRef = useRef(time ? time.minutes : null);
  const secondsRef = useRef(time ? time.seconds : null);

  useEffect(() => {
    const completed = currentMinutes === 0 && currentSeconds === 0;

    onTick && onTick(completed);

    if (completed) {
      onComplete && onComplete();

      secondsRef.current = null;
      minutesRef.current = null;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {

      if (secondsRef.current !== null) {
        if (secondsRef.current === 0) {
          secondsRef.current = 59;
          minutesRef.current = minutesRef - 1;
        } else {
          secondsRef.current = secondsRef.current - 1;
        }

        setCurrentMinutes(minutesRef.current);
        setCurrentSeconds(secondsRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    minutesRef.current = time ? time.minutes : null;
    secondsRef.current = time ? time.seconds : null;
  }, [time]);

  document.title = `${isOnWork ? '🔴' : '🟢'}${formatToTwoNumbers(minutesRef.current)}:${formatToTwoNumbers(secondsRef.current)}`;

  return (
    <Strong color={color}>
      {`${formatToTwoNumbers(minutesRef.current)}:${formatToTwoNumbers(secondsRef.current)}`}
    </Strong>
  );
};
