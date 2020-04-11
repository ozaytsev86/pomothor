import React, {useRef, useState} from 'react';
import {Button, TextField} from '@material-ui/core';

import {locale} from '../../locale/en-us';
import notificationAudioSrc from '../../statics/notification.wav';

export const FocusForm = (props) => {
  const [minutes, setMinutes] = useState(0);

  const handleStart = (e) => {
    e.preventDefault();
    props.onStart(minutes)
  };

  return <form onSubmit={(e) => handleStart(e)}>
    <TextField
      autoFocus
      id="time"
      label={locale.FocusTimeCapitalize}
      placeholder={locale.MinutesLowercase}
      onChange={(e) => setMinutes(e.target.value)}
    />
    <Button type="submit"
            variant="contained"
            color="primary"
            size="large"
    >{locale.Start}</Button>
  </form>
};