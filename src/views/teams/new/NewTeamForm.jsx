import React, {useState} from 'react';
import {withRouter} from 'react-router';
import {Box, Button, TextField} from '@material-ui/core';

import {formatTeamName, isDuplicatedTeamName, isValidTeamName} from '../teams.helper';

import {routes} from '../../../constants/routes';
import {locale} from '../../../locale/en-us';

const NewTeamForm = (props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleAddTeam = (e) => {
    e.preventDefault();

    if (name === '') {
      setError(locale.ErrorTeamNameRequired);
      return;
    }

    if (isValidTeamName(name) && !isDuplicatedTeamName(name, props.teams)) {
      props.history.push(`${routes.Teams}/${formatTeamName(name)}`);
    } else {
      //TODO: suggest a name and show link to apply
      // if the name is test, suggest test1
      setError(locale.ErrorTeamNameDuplicated);
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
      <Box pb={2}>
        <TextField
          autoFocus
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
