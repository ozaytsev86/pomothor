import React, {useState} from 'react';
import {Button, TextField} from '@material-ui/core';

import {locale} from '../../locale/en-us';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  timeTextField: {
    marginRight: theme.spacing(2)
  }
}));

export const FocusForm = (props) => {
  const [minutes, setMinutes] = useState(0);
  const classes = useStyles();

  const handleStart = (e) => {
    e.preventDefault();
    props.onStart(minutes)
  };

  return (
    <form onSubmit={(e) => handleStart(e)}>
      <TextField
        autoFocus
        id="time"
        label={locale.FocusTime}
        placeholder={locale.MinutesLowercase}
        className={classes.timeTextField}
        onChange={(e) => setMinutes(e.target.value)}
      />
      <Button type="submit"
              variant="contained"
              color="primary"
              size="large"
      >{locale.Start}</Button>
    </form>
  )
};