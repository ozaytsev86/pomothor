import React from 'react';
import {AppBar, Toolbar, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';

import logo from '../statics/logo.png';
import {locale} from '../locale/en-us';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: '36px',
    marginRight: theme.spacing(2)
  }
}));

export const Navbar = (props) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <img src={logo} className={classes.logo} />
          {locale.Pomothor}
        </Typography>
        {
          props.user
            ? <Button color="inherit" onClick={props.onSignOut}>{locale.SignOut}</Button>
            : <Button color="inherit" onClick={props.onSignIn}>{locale.SignInWithGoogle}</Button>
        }
      </Toolbar>
    </AppBar>
  );
};
