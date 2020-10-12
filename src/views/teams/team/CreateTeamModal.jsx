import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme, makeStyles} from '@material-ui/core/styles';

import {replaceParamsInString} from '../../../utils/ReplaceParamsInString';
import {locale} from '../../../locale/EnUs';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
  bold: {
    fontWeight: 'bold',
  },
}));

export const CreateTeamModal = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.isOpened}
      TransitionComponent={Transition}
      onClose={props.onClose}
      aria-labelledby="create-team-dialog-title"
      aria-describedby="create-team-dialog-description"
    >
      <DialogTitle id="create-team-dialog-title">{locale.CreateNewTeamConfirmation}</DialogTitle>
      <DialogContent>
        <DialogContentText id="create-team-dialog-description">
          {replaceParamsInString(locale.TheTeamXXIsNotCreatedYetDoYouWantToCreateIt, <strong>{props.teamName}</strong>)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          {locale.No}
        </Button>
        <Button color="primary" className={classes.bold} onClick={props.onConfirm}>
          {locale.YesCreateTheTeam}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
