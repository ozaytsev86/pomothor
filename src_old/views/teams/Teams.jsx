import React from 'react';
import {Box, Grid} from '@material-ui/core';

import TeamItem from './TeamItem';
import NoTeams from './NoTeams';

export const Teams = (props) => {
  return (
    props.teams
        ? <Box p={2}>
            <Grid container spacing={2} justifyContent="center">
              {Object.keys(props.teams).map(name => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                  <TeamItem name={name} users={props.teams[name].users.length}/>
                </Grid>
              ))}
            </Grid>
          </Box>
        : <NoTeams />
  );
};
