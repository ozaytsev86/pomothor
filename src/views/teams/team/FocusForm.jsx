import React, {useState} from 'react';
import {Button, FormControl, InputLabel, Input} from '@material-ui/core';

import {locale} from '../../../locale/en-us';
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
      <FormControl>
        <InputLabel htmlFor="time">{locale.FocusTime}</InputLabel>
        <Input
          autoFocus
          required
          id="time"
          placeholder={locale.MinutesLowercase}
          className={classes.timeTextField}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </FormControl>
      <Button focused
              type="submit"
              variant="contained"
              color="primary"
              size="large"
      >{locale.Start}</Button>
    </form>
  )
};