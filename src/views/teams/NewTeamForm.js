import React, {useState} from 'react';
import {withRouter} from 'react-router';
import {Box, Button, TextField} from '@material-ui/core';

import {formatTeamName, isDuplicatedTeamName, isValidTeamName} from './teams.helper';

const NewTeamForm = (props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (isValidTeamName(name) && !isDuplicatedTeamName(name, props.teamsList)) {
      props.history.push(`/teams/${formatTeamName(name)}`);
    } else {
      //TODO: suggest a name and show link to apply
      // if the name is test, suggest test1
      setError('The team name already exists, try different one');
    }
  };

  const handleOnChangeTeamName = (name) => {
    setError(null);
    if (isValidTeamName(name)) {
      setName(name);
    } else {
      setError('Only letters, numbers and spaces are allowed')
    }
  };

  return (
    <form onSubmit={handleAddTeam} noValidate autoComplete="off">
      <Box pb={2}>
        <TextField
          autoFocus
          id="name"
          label="Team name"
          placeholder="Write team name"
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
      >Create team</Button>
    </form>
  );
};

export default withRouter(NewTeamForm);
