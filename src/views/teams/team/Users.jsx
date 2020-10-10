import React from 'react';
import {Box, Grid, Typography} from '@material-ui/core';
import {CountdownCard} from '../../../components';

import {locale} from '../../../locale/en-us';

export const Users = ({
                            pomodorosList,
                            user,
                            notifications,
                            onComplete,
                            onAddNotification,
                            onDeleteNotification
}) => {
  return (
    <Box py={2}>
      <Grid item>
        <Box py={2}>
          <Typography variant="h4" component="h4">{locale.Users}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {Object.keys(pomodorosList).map(pomodoroKey => (
            pomodoroKey !== user.uid
            && <Grid item xs={12} sm={6} md={4} lg={3}>
              <CountdownCard
                pomodoro={pomodorosList[pomodoroKey]}
                currentUserId={user.uid}
                notifications={notifications}
                onCounterComplete={onComplete}
                onAddNotification={onAddNotification}
                onDeleteNotification={onDeleteNotification}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}
