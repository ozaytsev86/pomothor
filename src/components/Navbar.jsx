import React from 'react';
import {NavLink} from 'react-router-dom';
import {AppBar, Toolbar, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';

import {locale} from '../locale/en-us';
import logo from '../statics/images/logo.png';
import {routes} from '../constants/routes';

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
  },
  menuLinkActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  }
}));

export const Navbar = (props) => {
  const classes = useStyles();

  const isTeamActive = (match, location) => !location.pathname.includes(routes.TeamsNew);

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
                <NavLink exact to={routes.Home} activeClassName={classes.menuLinkActive} className="MuiButtonBase-root MuiButton-root MuiButton-colorInherit">{locale.Home}</NavLink>
                <NavLink exact to={routes.TeamsNew} activeClassName={classes.menuLinkActive} className="MuiButtonBase-root MuiButton-root MuiButton-colorInherit">{locale.CreateTeam}</NavLink>
                <NavLink to={routes.Teams} isActive={isTeamActive} activeClassName={classes.menuLinkActive} className={`MuiButtonBase-root MuiButton-root MuiButton-colorInherit ${classes.menuLink}`}>{locale.Teams}</NavLink>
                <Button color="inherit" variant="outlined" onClick={props.onSignOut}>{locale.SignOut}</Button>
              </>
            : <Button color="inherit" variant="outlined" onClick={props.onSignIn}>{locale.SignInWithGoogle}</Button>
        }
      </Toolbar>
    </AppBar>
  );
};

// export const Navbar = withRouter(NavbarComponent);