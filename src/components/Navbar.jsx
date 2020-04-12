import React from 'react';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {AppBar, Toolbar, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';

import {locale} from '../locale/en-us';
import logo from '../statics/images/logo.png';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: 'linear-gradient(45deg, #64b5f6 30%, #2196f3 90%)',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: '36px',
    marginRight: theme.spacing(2)
  },
  menuLink: {
    marginRight: theme.spacing(2)
  }
}));

const Navbar = (props) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <img src={logo} className={classes.logo} alt={locale.Pomothor} />
          {locale.Pomothor}
        </Typography>
        {
          props.user
            ? <>
                <Link to="/" className="MuiButtonBase-root MuiButton-root MuiButton-colorInherit">{locale.Home}</Link>
                <Link to="/teams" className={`MuiButtonBase-root MuiButton-root MuiButton-colorInherit ${classes.menuLink}`}>{locale.CreateTeam}</Link>
                <Button color="inherit" variant="outlined" onClick={props.onSignOut}>{locale.SignOut}</Button>
              </>
            : <Button color="inherit" variant="outlined" onClick={props.onSignIn}>{locale.SignInWithGoogle}</Button>
        }
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
