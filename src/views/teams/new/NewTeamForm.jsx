import React, {useState} from 'react';
import {withRouter} from 'react-router';
import {Box, Button, TextField} from '@material-ui/core';
import {Link} from 'react-router-dom';

import {formatTeamNameToId, isDuplicatedTeamName, isValidTeamName} from '../Teams.helper';
import {replaceParamsInString} from '../../../utils/ReplaceParamsInString';

import {routes} from '../../../constants/Routes';
import {locale} from '../../../locale/EnUs';
import {addTeam} from '../../../services/Team.service';

const NewTeamForm = (props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleAddTeam = (e) => {
    e.preventDefault();

    if (name === '') {
      setError(locale.ErrorTeamNameRequired);
      return;
    }

    const teamId = formatTeamNameToId(name);
    if (isValidTeamName(name) && !isDuplicatedTeamName(name, props.teams)) {
      addTeam({user: props.user, teamId})
      props.history.push(`${routes.Teams}/${teamId}`);
    } else {
      setError(replaceParamsInString(locale.ErrorTeamNameDuplicatedJoinXXOrTryDifferent, <Link to={`${routes.Teams}/${formatTeamNameToId(teamId)}`}>{locale.JoinTheTeamLC}</Link>));
    }
  };

  const handleOnChangeTeamName = (name) => {
    setError(null);
    if (isValidTeamName(name)) {
      setName(name);
    } else {
      setError(locale.ErrorOnlyLettersNumbersDashes)
    }
  };

  return (
    <form onSubmit={handleAddTeam} noValidate autoComplete="off" className="u-display--flex u-flex-direction--column">
      <Box pb={2} minWidth={300}>
        <TextField
          autoFocus
          fullWidth
          id="name"
          label={locale.TeamName}
          placeholder={locale.WriteSomethingAwesome}
          value={name}
          error={!!error}
          helperText={error}
          variant="outlined"
          onChange={(e) => handleOnChangeTeamName(e.target.value)}
        />
      </Box>
      <Button type="submit"
              variant="contained"
              color="primary"
              size="large"
      >{locale.LetsGoExclamation}</Button>
    </form>
  );
};

export default withRouter(NewTeamForm);
