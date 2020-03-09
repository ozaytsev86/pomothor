import React from 'react';
import {AppBar, Toolbar, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1,
    },
}));

export const Navbar = (props) => {
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>Pomothor</Typography>
                {
                    props.user
                        ? <Button color="inherit" onClick={props.onSignOut}>Sign out</Button>
                        : <Button color="inherit" onClick={props.onSignIn}>Sign in with Google</Button>

                }
            </Toolbar>
        </AppBar>
    );
};
